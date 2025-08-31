"use client"

import { useReadContract } from "wagmi"
import { formatUnits } from "viem"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { CAMPAIGN_ABI } from "@/lib/contracts"

interface CampaignCardProps {
  campaignAddress: `0x${string}`
  index: number
}

function getStateString(state: number): string {
  switch (state) {
    case 0:
      return "Active"
    case 1:
      return "Under Review"
    case 2:
      return "Completed"
    case 3:
      return "Refunded"
    default:
      return "Unknown"
  }
}

export function CampaignCard({ campaignAddress, index }: CampaignCardProps) {
  // Read campaign data using ABI methods
  const { data: title, isLoading: isTitleLoading } = useReadContract({
    address: campaignAddress,
    abi: CAMPAIGN_ABI,
    functionName: "title",
  })

  const { data: description, isLoading: isDescriptionLoading } = useReadContract({
    address: campaignAddress,
    abi: CAMPAIGN_ABI,
    functionName: "description",
  })

  const { data: goalAmount, isLoading: isGoalLoading } = useReadContract({
    address: campaignAddress,
    abi: CAMPAIGN_ABI,
    functionName: "goalAmount",
  })

  const { data: totalRaised, isLoading: isRaisedLoading } = useReadContract({
    address: campaignAddress,
    abi: CAMPAIGN_ABI,
    functionName: "totalRaised",
  })

  const { data: creator, isLoading: isCreatorLoading } = useReadContract({
    address: campaignAddress,
    abi: CAMPAIGN_ABI,
    functionName: "creator",
  })

  const { data: state, isLoading: isStateLoading } = useReadContract({
    address: campaignAddress,
    abi: CAMPAIGN_ABI,
    functionName: "state",
  })

  const { data: ensSubdomain, isLoading: isEnsLoading } = useReadContract({
    address: campaignAddress,
    abi: CAMPAIGN_ABI,
    functionName: "ensSubdomain",
  })

  const isLoading = isTitleLoading || isDescriptionLoading || isGoalLoading || 
                   isRaisedLoading || isCreatorLoading || isStateLoading || isEnsLoading

  // Calculate progress
  const progressPercentage = goalAmount && totalRaised ? 
    Number((totalRaised * BigInt(100)) / goalAmount) : 0

  // Format amounts
  const goalFormatted = goalAmount ? formatUnits(goalAmount, 6) : "0"
  const raisedFormatted = totalRaised ? formatUnits(totalRaised, 6) : "0"

  if (isLoading) {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <Badge variant="outline">Loading...</Badge>
            <Badge variant="outline" className="text-xs">
              Base
            </Badge>
          </div>
          <CardTitle className="text-lg">Campaign #{index + 1}</CardTitle>
          <CardDescription>Loading campaign details...</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">Loading...</span>
              </div>
              <Progress value={0} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">0% funded</p>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1" disabled>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading...
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              <p>Address: {campaignAddress.slice(0, 6)}...{campaignAddress.slice(-4)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const statusInfo = getStateString(Number(state || 0))

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge
            variant={
              statusInfo === "Active"
                ? "default"
                : statusInfo === "Under Review"
                  ? "secondary"
                  : "outline"
            }
          >
            {statusInfo}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Base
          </Badge>
        </div>
        <CardTitle className="text-lg">{title || "Untitled Campaign"}</CardTitle>
        <CardDescription>
          {description || "No description available"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                ${Number(raisedFormatted).toLocaleString()} / ${Number(goalFormatted).toLocaleString()}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(progressPercentage)}% funded
            </p>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1" asChild>
              <Link href={`/campaign/${campaignAddress}`}>
                {statusInfo === "Active" ? "Donate" : "View Details"}
              </Link>
            </Button>
            {ensSubdomain && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`https://${ensSubdomain}.tucausa.eth`} target="_blank">
                  ENS
                </Link>
              </Button>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            <p>Creator: {creator ? `${creator.slice(0, 6)}...${creator.slice(-4)}` : "Unknown"}</p>
            <p>Campaign: {campaignAddress.slice(0, 6)}...{campaignAddress.slice(-4)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
