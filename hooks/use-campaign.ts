"use client"

import { useReadContract } from "wagmi"
import { CAMPAIGN_ABI } from "@/lib/contracts"

export function useCampaign(address: string) {
  const { data: title, isLoading: isTitleLoading } = useReadContract({
    address: address as `0x${string}`,
    abi: CAMPAIGN_ABI,
    functionName: "title",
  })

  const { data: description, isLoading: isDescriptionLoading } = useReadContract({
    address: address as `0x${string}`,
    abi: CAMPAIGN_ABI,
    functionName: "description",
  })

  const { data: goalAmount, isLoading: isGoalLoading } = useReadContract({
    address: address as `0x${string}`,
    abi: CAMPAIGN_ABI,
    functionName: "goalAmount",
  })

  const { data: totalRaised, isLoading: isRaisedLoading } = useReadContract({
    address: address as `0x${string}`,
    abi: CAMPAIGN_ABI,
    functionName: "totalRaised",
  })

  const { data: creator, isLoading: isCreatorLoading } = useReadContract({
    address: address as `0x${string}`,
    abi: CAMPAIGN_ABI,
    functionName: "creator",
  })

  const { data: state, isLoading: isStateLoading } = useReadContract({
    address: address as `0x${string}`,
    abi: CAMPAIGN_ABI,
    functionName: "state",
  })

  const isLoading =
    isTitleLoading || isDescriptionLoading || isGoalLoading || isRaisedLoading || isCreatorLoading || isStateLoading

  return {
    title: title as string,
    description: description as string,
    goalAmount: goalAmount as bigint,
    totalRaised: totalRaised as bigint,
    creator: creator as string,
    state: state as number,
    isLoading,
  }
}
