"use client"

import type React from "react"

import { useState } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseUnits } from "viem"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { CAMPAIGN_FACTORY_ADDRESS, CAMPAIGN_FACTORY_ABI } from "@/lib/contracts"
import { generateEnsSubdomain, getCampaignUrl } from "@/lib/ens-utils"
import { useChainId } from "wagmi"
import Link from "next/link"

export default function CreateCausePage() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: "",
  })
  const [ensSubdomain, setEnsSubdomain] = useState("")
  const [createdCampaignAddress, setCreatedCampaignAddress] = useState("")

  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Generate ENS subdomain when title changes
    if (field === "title" && value) {
      setEnsSubdomain(generateEnsSubdomain(value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected || !address) {
      alert("Please connect your wallet first")
      return
    }

    if (!formData.title || !formData.description || !formData.goalAmount) {
      alert("Please fill in all fields")
      return
    }

    const goalAmountWei = parseUnits(formData.goalAmount, 6) // USDC has 6 decimals

    try {
      writeContract({
        address: CAMPAIGN_FACTORY_ADDRESS[chainId as keyof typeof CAMPAIGN_FACTORY_ADDRESS],
        abi: CAMPAIGN_FACTORY_ABI,
        functionName: "createCampaign",
        args: [formData.title, formData.description, goalAmountWei, ensSubdomain],
      })
    } catch (err) {
      console.error("Error creating campaign:", err)
    }
  }

  // Mock campaign address for demo - in real app, this would come from transaction logs
  const mockCampaignAddress = "0x1234567890123456789012345678901234567890"

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl">Campaign Created Successfully!</CardTitle>
                <CardDescription>Your cause is now live and ready to receive donations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Campaign Details:</h3>
                  <p>
                    <strong>Title:</strong> {formData.title}
                  </p>
                  <p>
                    <strong>Goal:</strong> ${formData.goalAmount} USDC
                  </p>
                  <p>
                    <strong>ENS Domain:</strong> {ensSubdomain}.tucausa.eth
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <Button asChild className="w-full">
                    <Link href={getCampaignUrl(mockCampaignAddress)}>View Your Campaign</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/causes">Browse All Causes</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/create">Create Another Cause</Link>
                  </Button>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Share your campaign link with your community to start receiving donations. Remember to submit proof
                    once your cause is completed!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Start a New Cause</h1>
            <p className="text-muted-foreground">
              Create a fundraising campaign for your local cause and get community support
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>
                Provide clear information about your cause to build trust with potential donors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Campaign Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Fix Neighborhood Potholes"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                  {ensSubdomain && (
                    <p className="text-sm text-muted-foreground">
                      ENS Domain: <span className="font-mono">{ensSubdomain}.tucausa.eth</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your cause, why it's needed, and how the funds will be used..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goalAmount">Goal Amount (USDC)</Label>
                  <Input
                    id="goalAmount"
                    type="number"
                    placeholder="5000"
                    value={formData.goalAmount}
                    onChange={(e) => handleInputChange("goalAmount", e.target.value)}
                    min="1"
                    step="0.01"
                    required
                  />
                  <p className="text-sm text-muted-foreground">Set a realistic funding goal for your cause</p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Error creating campaign: {error.message}</AlertDescription>
                  </Alert>
                )}

                {!isConnected ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Please connect your wallet to create a campaign</AlertDescription>
                  </Alert>
                ) : (
                  <Button type="submit" className="w-full" disabled={isPending || isConfirming}>
                    {isPending || isConfirming ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isPending ? "Creating Campaign..." : "Confirming..."}
                      </>
                    ) : (
                      "Create Campaign"
                    )}
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 bg-muted p-6 rounded-lg">
            <h3 className="font-semibold mb-3">How it works:</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li>1. Create your campaign with a clear title and description</li>
              <li>2. Share your campaign link to receive USDC donations</li>
              <li>3. Submit proof when your cause is completed</li>
              <li>4. Donors vote to verify completion and release funds</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
