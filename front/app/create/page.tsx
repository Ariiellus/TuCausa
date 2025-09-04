"use client"

import type React from "react"
import { useState } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useConnect, useSwitchChain } from "wagmi"
import { parseUnits } from "viem"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Loader2, AlertCircle } from "lucide-react"
import { CAMPAIGN_FACTORY_ADDRESS, CAMPAIGN_FACTORY_ABI } from "@/lib/contracts"
import { generateEnsSubdomain, getCampaignUrl } from "@/lib/ens-utils"
import { useChainId } from "wagmi"
import { useI18n } from "@/lib/i18n"
import Link from "next/link"
import { FarcasterEmbed } from "@/components/farcaster-embed"

export default function CreateCausePage() {
  const { address, isConnected } = useAccount()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })
  const { connect, connectors } = useConnect()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const t = useI18n()
  
  // Network validation
  const isBaseNetwork = chainId === 8453
  const [formData, setFormData] = useState({
    title: "",
    campaignTag: "",
    description: "",
    goalAmount: "",
  })

  const [ensSubdomain, setEnsSubdomain] = useState("")
  const [tagError, setTagError] = useState("")

  const handleConnect = () => {
    const coinbaseConnector = connectors.find((connector) => connector.name === "Coinbase Wallet")
    if (coinbaseConnector) {
      connect({ connector: coinbaseConnector })
    }
  }

  // Show Log In state if not connected
  if (!isConnected || !address) {
    return (
      <>
        <FarcasterEmbed
          title="🎯 Create Cause"
          url="https://tu-causa.vercel.app/create"
        />
        <div className="min-h-screen bg-background">
          <Header />
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">{t('create.title')}</h1>
                <p className="text-muted-foreground">
                  {t('create.subtitle')}
                </p>
              </div>
              <Card>
                <CardContent className="py-8">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Connect your wallet to create a new cause
                    </p>
                    <Button onClick={handleConnect} size="lg">
                      {t('create.loginButton')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    )
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    // Generate ENS subdomain when campaign tag changes
    if (field === "campaignTag") {
      const subdomain = generateEnsSubdomain(value)
      setEnsSubdomain(subdomain)
      
      // Validate tag format
      if (value.length > 0) {
        if (value.length < 8) {
          setTagError("Project name must be at least 8 characters")
        } else if (value.length > 20) {
          setTagError("Project name must be at most 20 characters")
        } else if (!/^[a-z0-9-]+$/.test(value)) {
          setTagError("Project name can only contain lowercase letters, numbers, and hyphens")
        } else {
          setTagError("")
        }
      } else {
        setTagError("")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected || !address) {
      alert("Please connect your wallet first")
      return
    }

    if (!isBaseNetwork) {
      alert("Please switch to Base network to create campaigns. Use the 'Switch to Base' button in the header.")
      return
    }

    if (tagError) {
      alert("Please fix the project name errors before submitting")
      return
    }

    try {
      const goalAmountWei = parseUnits(formData.goalAmount, 6)
      
      writeContract({
        address: CAMPAIGN_FACTORY_ADDRESS[chainId as keyof typeof CAMPAIGN_FACTORY_ADDRESS],
        abi: CAMPAIGN_FACTORY_ABI,
        functionName: "createCampaign",
        args: [
          formData.title,
          formData.description,
          goalAmountWei,
          ensSubdomain
        ],
      })
    } catch (err) {
      console.error("Error creating campaign:", err)
    }
  }

  if (isConfirmed) {
    return (
      <>
        <FarcasterEmbed
          title="🎯 Create Cause"
          url="https://tu-causa.vercel.app/create"
        />
        <div className="min-h-screen bg-background">
          <Header />
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                  <CardTitle className="text-2xl">Campaign Created Successfully!</CardTitle>
                  <CardDescription>
                    Your cause has been deployed to the blockchain and is now live
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Campaign URL:</p>
                    <p className="font-mono text-sm break-all">
                      {getCampaignUrl(ensSubdomain)}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button asChild className="flex-1">
                      <Link href="/causes">View All Causes</Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full bg-transparent">
                      <Link href="/create">Create Another Cause</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <FarcasterEmbed
        title="🎯 Create Cause"
        url="https://tu-causa.vercel.app/create"
      />
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
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">{t('create.title')}</h1>
              <p className="text-muted-foreground">
                {t('create.subtitle')}
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="campaignTag">Project Name</Label>
                    <Input
                      id="campaignTag"
                      placeholder="e.g., potholes-fix, community-garden (8-20 characters)"
                      value={formData.campaignTag}
                      onChange={(e) => handleInputChange("campaignTag", e.target.value)}
                      required
                      className={tagError ? "border-red-500" : ""}
                    />
                    {tagError && <p className="text-sm text-red-500">{tagError}</p>}
                    {ensSubdomain && !tagError && (
                      <p className="text-sm text-muted-foreground">
                        Cause ID: <span className="font-mono">{ensSubdomain}.tucausa.eth</span>
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
                    <Label htmlFor="goalAmount">Goal Amount</Label>
                    <Input
                      id="goalAmount"
                      type="number"
                      placeholder="Insert amount in USD"
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
    </>
  )
}