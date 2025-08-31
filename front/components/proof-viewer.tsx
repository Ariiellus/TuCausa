"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ExternalLink, ImageIcon, Video, FileText } from "lucide-react"

interface ProofFile {
  name: string
  type: string
  commp: string
  url: string
}

interface ProofMetadata {
  description: string
  files: ProofFile[]
  timestamp: string
  campaign: string
}

interface ProofViewerProps {
  proofURI: string
  className?: string
}

export function ProofViewer({ proofURI, className }: ProofViewerProps) {
  const [proofData, setProofData] = useState<ProofMetadata | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProofData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Check if this is a mock URL (for development)
        if (proofURI.includes('mock_')) {
          console.log("Mock proof URI detected, skipping fetch")
          setError("Mock proof data - not available in production")
          return
        }
        
        console.log("Fetching proof data from:", proofURI)
        const response = await fetch(proofURI)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        console.log("Proof data received:", data)
        setProofData(data)
      } catch (err) {
        console.error("Error fetching proof:", err)
        const errorMessage = err instanceof Error ? err.message : "Failed to load proof data"
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    if (proofURI) {
      fetchProofData()
    } else {
      setIsLoading(false)
      setError("No proof URI provided")
    }
  }, [proofURI])

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading proof...</span>
        </CardContent>
      </Card>
    )
  }

  if (error || !proofData) {
    return (
      <Card className={className}>
        <CardContent className="py-8">
          <Alert variant="destructive">
            <AlertDescription>
              {error || "No proof data available"}
              {error?.includes("Mock proof data") && (
                <div className="mt-2 text-sm">
                  This is development data and won&apos;t be available in production.
                </div>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Proof of Completion
        </CardTitle>
        <CardDescription>Submitted on {new Date(proofData.timestamp).toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-muted-foreground leading-relaxed">{proofData.description}</p>
        </div>

        {proofData.files && proofData.files.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Evidence Files</h3>
            <div className="grid gap-3">
              {proofData.files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {file.type.startsWith("image/") ? (
                      <ImageIcon className="h-5 w-5 text-primary" />
                    ) : file.type.startsWith("video/") ? (
                      <Video className="h-5 w-5 text-primary" />
                    ) : (
                      <FileText className="h-5 w-5 text-primary" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {file.type.split("/")[0]}
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <Button variant="outline" size="sm" asChild className="bg-transparent">
            <a href={proofURI} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Raw Proof Data
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
