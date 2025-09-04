"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { CAMPAIGN_FACTORY_ADDRESS, CAMPAIGN_FACTORY_ABI } from "@/lib/contracts"
import { useReadContract } from "wagmi"
import { CampaignCard } from "@/components/campaign-card"
import { FarcasterEmbed } from "@/components/farcaster-embed"

export default function CausesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Read campaign addresses from factory
  const { data: campaignAddresses, error: factoryError } = useReadContract({
    address: CAMPAIGN_FACTORY_ADDRESS[8453],
    abi: CAMPAIGN_FACTORY_ABI,
    functionName: "getAllCampaigns",
  })

  // Read campaign count
  const { data: campaignCount } = useReadContract({
    address: CAMPAIGN_FACTORY_ADDRESS[8453],
    abi: CAMPAIGN_FACTORY_ABI,
    functionName: "getCampaignCount",
  })

  useEffect(() => {
    console.log("Campaign addresses:", campaignAddresses)
    console.log("Campaign count:", campaignCount)
    
    if (factoryError) {
      console.error("Factory error:", factoryError)
      setError("Failed to load campaigns from factory")
      setIsLoading(false)
      return
    }

    if (!campaignAddresses || campaignAddresses.length === 0) {
      console.log("No campaigns found")
      setIsLoading(false)
      return
    }

    // For now, show a message that campaigns are being loaded
    // In a real implementation, you'd fetch individual campaign data
    setIsLoading(false)
  }, [campaignAddresses, factoryError, campaignCount])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading campaigns...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <FarcasterEmbed 
        title="📋 Browse Causes"
        url="https://tu-causa.vercel.app/causes"
      />
      <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Local Causes</h1>
            <p className="text-muted-foreground">Support your community by donating to local causes</p>
            {campaignCount && (
              <p className="text-sm text-muted-foreground">
                Total campaigns: {Number(campaignCount)}
              </p>
            )}
          </div>
          <Button asChild className="flex items-center gap-2">
            <Link href="/create">
              <Wallet className="h-4 w-4" />
              Start a Cause
            </Link>
          </Button>
        </div>

        {campaignAddresses && campaignAddresses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaignAddresses.map((campaignAddress, index) => (
              <CampaignCard 
                key={campaignAddress} 
                campaignAddress={campaignAddress} 
                index={index} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No causes found on blockchain</p>
            <Button asChild className="flex items-center gap-2">
              <Link href="/create">
                <Wallet className="h-4 w-4" />
                Create the First Cause
              </Link>
            </Button>
          </div>
        )}
      </div>
      </div>
    </>
  )
}
