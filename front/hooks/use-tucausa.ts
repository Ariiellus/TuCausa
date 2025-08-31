"use client"

import { useCampaignFactory } from "./use-campaign-factory"
import { useCampaign } from "./use-campaign"
import { useUSDC } from "./use-usdc"
import { useAccount, useChainId } from "wagmi"
import { CAMPAIGN_FACTORY_ADDRESS } from "@/lib/contracts"

export function useTuCausa() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  
  const factory = useCampaignFactory()
  const usdc = useUSDC()

  // Helper function to get campaign data
  const getCampaign = (campaignAddress: string) => {
    return useCampaign(campaignAddress)
  }

  // Helper function to check if user is campaign creator
  const isCampaignCreator = (campaignAddress: string) => {
    const campaign = useCampaign(campaignAddress)
    return campaign.creator === address
  }

  // Helper function to check if user has donated
  const hasUserDonated = (campaignAddress: string) => {
    const campaign = useCampaign(campaignAddress)
    return campaign.userDonation && campaign.userDonation > BigInt(0)
  }

  // Helper function to check if user can vote
  const canUserVote = (campaignAddress: string) => {
    const campaign = useCampaign(campaignAddress)
    return hasUserDonated(campaignAddress) && !campaign.hasUserVoted && campaign.state === 1 // UnderReview
  }

  // Helper function to check if user can claim refund
  const canUserClaimRefund = (campaignAddress: string) => {
    const campaign = useCampaign(campaignAddress)
    return hasUserDonated(campaignAddress) && campaign.state === 3 // Refunded
  }

  // Helper function to check if creator can claim funds
  const canCreatorClaimFunds = (campaignAddress: string) => {
    const campaign = useCampaign(campaignAddress)
    return isCampaignCreator(campaignAddress) && campaign.state === 2 // Completed
  }

  // Helper function to check if campaign is in voting phase
  const isCampaignInVoting = (campaignAddress: string) => {
    const campaign = useCampaign(campaignAddress)
    return campaign.state === 1 // UnderReview
  }

  // Helper function to check if campaign is active
  const isCampaignActive = (campaignAddress: string) => {
    const campaign = useCampaign(campaignAddress)
    return campaign.state === 0 // Active
  }

  // Helper function to format USDC amount
  const formatUSDC = (amount: bigint | undefined) => {
    if (!amount || !usdc.decimals) return "0"
    const divisor = BigInt(10 ** usdc.decimals)
    const whole = amount / divisor
    const fraction = amount % divisor
    return `${whole}.${fraction.toString().padStart(usdc.decimals, '0')}`
  }

  // Helper function to parse USDC amount
  const parseUSDC = (amount: string) => {
    if (!usdc.decimals) return 0n
    const [whole, fraction = "0"] = amount.split(".")
    const paddedFraction = fraction.padEnd(usdc.decimals, "0").slice(0, usdc.decimals)
    return BigInt(whole + paddedFraction)
  }

  // Helper function to get campaign state string
  const getCampaignStateString = (state: number) => {
    switch (state) {
      case 0: return "Active"
      case 1: return "Under Review"
      case 2: return "Completed"
      case 3: return "Refunded"
      default: return "Unknown"
    }
  }

  // Helper function to get voting progress percentage
  const getVotingProgress = (campaignAddress: string) => {
    const campaign = useCampaign(campaignAddress)
    if (!campaign.votingStatus) return 0
    
    const [votesForSolved, votesForNotSolved, totalDonors] = campaign.votingStatus
    const totalVotes = votesForSolved + votesForNotSolved
    
    if (totalDonors === BigInt(0)) return 0
    return Number((totalVotes * BigInt(100)) / totalDonors)
  }

  // Helper function to get funding progress percentage
  const getFundingProgress = (campaignAddress: string) => {
    const campaign = useCampaign(campaignAddress)
    if (!campaign.goalAmount || campaign.goalAmount === BigInt(0)) return 0
    
    return Number((campaign.totalRaised * BigInt(100)) / campaign.goalAmount)
  }

  return {
    // User state
    address,
    isConnected,
    chainId,
    
    // Factory methods
    ...factory,
    
    // USDC methods
    ...usdc,
    
    // Campaign helpers
    getCampaign,
    isCampaignCreator,
    hasUserDonated,
    canUserVote,
    canUserClaimRefund,
    canCreatorClaimFunds,
    isCampaignInVoting,
    isCampaignActive,
    
    // Utility functions
    formatUSDC,
    parseUSDC,
    getCampaignStateString,
    getVotingProgress,
    getFundingProgress,
    
    // Contract addresses
    factoryAddress: CAMPAIGN_FACTORY_ADDRESS[chainId as keyof typeof CAMPAIGN_FACTORY_ADDRESS],
  }
}
