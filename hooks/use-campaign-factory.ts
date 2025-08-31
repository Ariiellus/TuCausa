"use client"

import { useReadContract, useWriteContract } from "wagmi"
import { CAMPAIGN_FACTORY_ADDRESS, CAMPAIGN_FACTORY_ABI } from "@/lib/contracts"
import { useChainId } from "wagmi"

export function useCampaignFactory() {
  const chainId = useChainId()

  const { data: campaigns, isLoading: isLoadingCampaigns } = useReadContract({
    address: CAMPAIGN_FACTORY_ADDRESS[chainId as keyof typeof CAMPAIGN_FACTORY_ADDRESS],
    abi: CAMPAIGN_FACTORY_ABI,
    functionName: "getAllCampaigns",
  })

  const { writeContract: createCampaign, isPending: isCreating } = useWriteContract()

  return {
    campaigns: campaigns as string[] | undefined,
    isLoadingCampaigns,
    createCampaign,
    isCreating,
  }
}
