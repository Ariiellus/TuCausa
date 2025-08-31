"use client"

import { useTuCausa } from "@/hooks/use-tucausa"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface CampaignCardProps {
  campaignAddress: string
}

export function CampaignCard({ campaignAddress }: CampaignCardProps) {
  const {
    getCampaign,
    formatUSDC,
    getCampaignStateString,
    getFundingProgress,
    getVotingProgress,
    isCampaignCreator,
    hasUserDonated,
    canUserVote,
    canUserClaimRefund,
    canCreatorClaimFunds,
    isCampaignActive,
    isCampaignInVoting,
    parseUSDC,
    isConnected,
  } = useTuCausa()

  const campaign = getCampaign(campaignAddress)
  const [donationAmount, setDonationAmount] = useState("")

  if (campaign.isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-2 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const fundingProgress = getFundingProgress(campaignAddress)
  const votingProgress = getVotingProgress(campaignAddress)
  const isCreator = isCampaignCreator(campaignAddress)
  const userDonated = hasUserDonated(campaignAddress)
  const canVote = canUserVote(campaignAddress)
  const canClaimRefund = canUserClaimRefund(campaignAddress)
  const canClaimFunds = canCreatorClaimFunds(campaignAddress)
  const isActive = isCampaignActive(campaignAddress)
  const inVoting = isCampaignInVoting(campaignAddress)

  const handleDonate = () => {
    if (!donationAmount || !isConnected) return
    const amount = parseUSDC(donationAmount)
    campaign.donateToCampaign(amount)
    setDonationAmount("")
  }

  const handleVote = (solved: boolean) => {
    campaign.voteOnCampaign(solved)
  }

  const handleClaimRefund = () => {
    campaign.claimUserRefund()
  }

  const handleClaimFunds = () => {
    campaign.claimCampaignFunds()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{campaign.title}</CardTitle>
            <CardDescription className="mt-2">{campaign.description}</CardDescription>
          </div>
          <Badge variant={isActive ? "default" : inVoting ? "secondary" : "outline"}>
            {getCampaignStateString(campaign.state)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Funding Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Funding Progress</span>
            <span>{formatUSDC(campaign.totalRaised)} / {formatUSDC(campaign.goalAmount)} USDC</span>
          </div>
          <Progress value={fundingProgress} className="h-2" />
        </div>

        {/* Campaign Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Creator:</span>
            <p className="font-mono text-xs truncate">{campaign.creator}</p>
          </div>
          <div>
            <span className="text-gray-600">Donors:</span>
            <p>{campaign.donorCount?.toString() || "0"}</p>
          </div>
          <div>
            <span className="text-gray-600">ENS Subdomain:</span>
            <p>{campaign.ensSubdomain}</p>
          </div>
          {userDonated && (
            <div>
              <span className="text-gray-600">Your Donation:</span>
              <p>{formatUSDC(campaign.userDonation)} USDC</p>
            </div>
          )}
        </div>

        {/* Voting Status */}
        {inVoting && campaign.votingStatus && (
          <div className="border rounded-lg p-3">
            <h4 className="font-medium mb-2">Voting Status</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Votes for Solved:</span>
                <p>{campaign.votingStatus[0].toString()}</p>
              </div>
              <div>
                <span className="text-gray-600">Votes for Not Solved:</span>
                <p>{campaign.votingStatus[1].toString()}</p>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Voting Progress</span>
                <span>{votingProgress}%</span>
              </div>
              <Progress value={votingProgress} className="h-2" />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Donate Button */}
          {isActive && isConnected && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Amount in USDC"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <Button 
                onClick={handleDonate}
                disabled={campaign.isDonating || !donationAmount}
              >
                {campaign.isDonating ? "Donating..." : "Donate"}
              </Button>
            </div>
          )}

          {/* Vote Buttons */}
          {canVote && (
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => handleVote(true)}
                disabled={campaign.isVoting}
                className="flex-1"
              >
                {campaign.isVoting ? "Voting..." : "Vote Solved"}
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleVote(false)}
                disabled={campaign.isVoting}
                className="flex-1"
              >
                {campaign.isVoting ? "Voting..." : "Vote Not Solved"}
              </Button>
            </div>
          )}

          {/* Claim Buttons */}
          {canClaimRefund && (
            <Button 
              onClick={handleClaimRefund}
              disabled={campaign.isClaimingRefund}
              className="w-full"
            >
              {campaign.isClaimingRefund ? "Claiming..." : "Claim Refund"}
            </Button>
          )}

          {canClaimFunds && (
            <Button 
              onClick={handleClaimFunds}
              disabled={campaign.isClaimingFunds}
              className="w-full"
            >
              {campaign.isClaimingFunds ? "Claiming..." : "Claim Funds"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
