"use client"

import { useReadContract, useWriteContract } from "wagmi"
import { CAMPAIGN_FACTORY_ADDRESS, CAMPAIGN_FACTORY_ABI } from "@/lib/contracts"
import { useChainId, useAccount } from "wagmi"

export function useCampaignFactory() {
  const chainId = useChainId()
  const { address } = useAccount()

  const factoryAddress = CAMPAIGN_FACTORY_ADDRESS[chainId as keyof typeof CAMPAIGN_FACTORY_ADDRESS]
  const isBaseNetwork = chainId === 8453

  // Read methods
  const { data: campaigns, isLoading: isLoadingCampaigns } = useReadContract({
    address: factoryAddress,
    abi: CAMPAIGN_FACTORY_ABI,
    functionName: "getAllCampaigns",
  })

  const { data: campaignCount, isLoading: isLoadingCount } = useReadContract({
    address: factoryAddress,
    abi: CAMPAIGN_FACTORY_ABI,
    functionName: "getCampaignCount",
  })

  const { data: usdcToken, isLoading: isLoadingUsdc } = useReadContract({
    address: factoryAddress,
    abi: CAMPAIGN_FACTORY_ABI,
    functionName: "usdcToken",
  })

  // Write methods
  const { writeContract: createCampaign, isPending: isCreating } = useWriteContract()

  const createNewCampaign = (title: string, description: string, goalAmount: bigint, ensSubdomain: string) => {
    if (!factoryAddress || !isBaseNetwork) return

    createCampaign({
      address: factoryAddress,
      abi: CAMPAIGN_FACTORY_ABI,
      functionName: "createCampaign",
      args: [title, description, goalAmount, ensSubdomain],
    })
  }

  return {
    // Read data
    campaigns: campaigns as string[] | undefined,
    campaignCount: campaignCount as bigint | undefined,
    usdcToken: usdcToken as string | undefined,
    
    // Network state
    isBaseNetwork,
    
    // Loading states
    isLoadingCampaigns,
    isLoadingCount,
    isLoadingUsdc,
    
    // Write methods
    createNewCampaign,
    isCreating,
  }
}
