"use client"

import type React from "react"

import { useState, use } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from "wagmi"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, CheckCircle, AlertCircle, ArrowLeft, ImageIcon, Video } from "lucide-react"
import { CAMPAIGN_ABI } from "@/lib/contracts"
import { uploadToSynapse, getSynapseUrl } from "@/lib/synapse-utils"
import Link from "next/link"

interface SubmitProofPageProps {
  params: Promise<{ address: string }>
}

export default function SubmitProofPage({ params }: SubmitProofPageProps) {
  const { address } = use(params)
  const { address: userAddress, isConnected } = useAccount()
  const [proofDescription, setProofDescription] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedProofURI, setUploadedProofURI] = useState("")
  
  // Network validation
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const isBaseNetwork = chainId === 8453

  // Read campaign data
  const { data: title } = useReadContract({
    address: address as `0x${string}`,
    abi: CAMPAIGN_ABI,
    functionName: "title",
  })

  const { data: creator } = useReadContract({
    address: address as `0x${string}`,
    abi: CAMPAIGN_ABI,
    functionName: "creator",
  })

  const { data: campaignState } = useReadContract({
    address: address as `0x${string}`,
    abi: CAMPAIGN_ABI,
    functionName: "state",
  })

  const { data: totalRaised } = useReadContract({
    address: address as `0x${string}`,
    abi: CAMPAIGN_ABI,
    functionName: "totalRaised",
  })

  // Contract interaction
  const { writeContract: submitProof, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const isCreator = creator && userAddress && creator.toLowerCase() === userAddress.toLowerCase()
  const canSubmitProof = isCreator && Number(campaignState || 0) === 0 && Number(totalRaised || 0) > 0

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(files)
  }

  const handleUploadFiles = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select files to upload")
      return
    }

    setIsUploading(true)
    try {
      const uploadedFiles = []

      for (const file of selectedFiles) {
        const commp = await uploadToSynapse(file)
        uploadedFiles.push({
          name: file.name,
          type: file.type,
          commp,
          url: getSynapseUrl(commp),
        })
      }

      // Create proof metadata
      const proofMetadata = {
        description: proofDescription,
        files: uploadedFiles,
        timestamp: new Date().toISOString(),
        campaign: address,
      }

      // Upload metadata to Synapse
      const metadataBlob = new Blob([JSON.stringify(proofMetadata, null, 2)], { type: "application/json" })
      const metadataFile = new File([metadataBlob], "proof-metadata.json", { type: "application/json" })
      const metadataCommp = await uploadToSynapse(metadataFile)
      const proofURI = getSynapseUrl(metadataCommp)

      setUploadedProofURI(proofURI)
    } catch (err) {
      console.error("Error uploading files:", err)
      alert("Failed to upload files. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmitProof = async () => {
    if (!uploadedProofURI) {
      alert("Please upload proof files first")
      return
    }
    
    if (!isBaseNetwork) {
      alert("Please switch to Base network to submit proof.")
      return
    }

    try {
      submitProof({
        address: address as `0x${string}`,
        abi: CAMPAIGN_ABI,
        functionName: "submitProof",
        args: [uploadedProofURI],
      })
    } catch (err) {
      console.error("Error submitting proof:", err)
    }
  }

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl">Proof Submitted Successfully!</CardTitle>
                <CardDescription>Your campaign is now under community review</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Donors will now review your proof and vote on whether the cause has been completed. You&apos;ll receive
                    the funds if the community approves your submission.
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col gap-3">
                  <Button asChild className="w-full">
                    <Link href={`/campaign/${address}`}>View Campaign</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/causes">Browse Other Causes</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Please connect your wallet to submit proof</AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    )
  }

  if (!canSubmitProof) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {!isCreator
                  ? "Only the campaign creator can submit proof"
                  : Number(campaignState || 0) !== 0
                    ? "Proof can only be submitted for active campaigns"
                    : "Campaign must have received donations before submitting proof"}
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button asChild variant="outline">
                <Link href={`/campaign/${address}`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Campaign
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Network Warning */}
      {isConnected && !isBaseNetwork && (
        <Alert className="mx-4 mt-4 mb-0 border-red-500 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="flex items-center justify-between">
              <div>
                <strong>⚠️ Wrong Network Detected!</strong> You are currently on {chainId === 1 ? "Ethereum Mainnet" : `Chain ${chainId}`}. 
                TuCausa only works on Base network.
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => switchChain({ chainId: 8453 })}
                className="bg-red-600 hover:bg-red-700 ml-4"
              >
                Switch to Base
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button variant="outline" asChild className="mb-4 bg-transparent">
              <Link href={`/campaign/${address}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Campaign
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-foreground mb-2">Submit Proof of Completion</h1>
            <p className="text-muted-foreground">
              Upload evidence that your cause &quot;{title}&quot; has been completed successfully
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Proof Submission</CardTitle>
              <CardDescription>
                Provide clear evidence of your completed work. This will be reviewed by your donors.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">Proof Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you accomplished and how the funds were used..."
                  value={proofDescription}
                  onChange={(e) => setProofDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-4">
                <Label>Upload Photos/Videos</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload photos and videos of your completed work
                    </p>
                    <p className="text-xs text-muted-foreground">Supports images and videos up to 10MB each</p>
                  </label>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Selected Files:</p>
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                        {file.type.startsWith("image/") ? (
                          <ImageIcon className="h-4 w-4 text-primary" />
                        ) : (
                          <Video className="h-4 w-4 text-primary" />
                        )}
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  onClick={handleUploadFiles}
                  disabled={selectedFiles.length === 0 || isUploading}
                  className="w-full bg-transparent"
                  variant="outline"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading to Synapse...
                    </>
                  ) : (
                    "Upload Files to Synapse"
                  )}
                </Button>
              </div>

              {uploadedProofURI && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Files uploaded successfully! Proof URI: {uploadedProofURI.substring(0, 50)}...
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Error submitting proof: {error.message}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleSubmitProof}
                disabled={!uploadedProofURI || !proofDescription || isPending || isConfirming}
                className="w-full"
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isPending ? "Submitting Proof..." : "Confirming..."}
                  </>
                ) : (
                  "Submit Proof for Review"
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="mt-8 bg-muted p-6 rounded-lg">
            <h3 className="font-semibold mb-3">What happens next?</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li>1. Your proof will be uploaded to Synapse for permanent storage on Filecoin</li>
              <li>2. Campaign status changes to &quot;Under Review&quot;</li>
              <li>3. Donors can view your proof and vote on completion</li>
              <li>4. If approved by the community, funds are released to you</li>
              <li>5. If not approved, donors can claim refunds</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
