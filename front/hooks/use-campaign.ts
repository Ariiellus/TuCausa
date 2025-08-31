"use client"

import { useReadContract, useWriteContract } from "wagmi"
import { CAMPAIGN_ABI } from "@/lib/contracts"
import { useAccount } from "wagmi"

export function useCampaign(address: string) {
  const { address: userAddress } = useAccount()
  const campaignAddress = address as `0x${string}`

  // Basic campaign info
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

  const { data: proofURI, isLoading: isProofLoading } = useReadContract({
    address: campaignAddress,
    abi: CAMPAIGN_ABI,
    functionName: "proofURI",
  })

  // Voting constants
  const { data: votingPeriod, isLoading: isVotingPeriodLoading } = useReadContract({
    address: campaignAddress,
    abi: CAMPAIGN_ABI,
    functionName: "VOTING_PERIOD",
  })

  const { data: votingThreshold, isLoading: isVotingThresholdLoading } = useReadContract({
    address: campaignAddress,
    abi: CAMPAIGN_ABI,
    functionName: "VOTING_THRESHOLD",
  })

  // Voting status
  const { data: votingStatus, isLoading: isVotingStatusLoading } = useReadContract({
    address: campaignAddress,
    abi: CAMPAIGN_ABI,
    functionName: "getVotingStatus",
  })

  // User-specific data
  const { data: userDonation, isLoading: isUserDonationLoading } = useReadContract({
    address: campaignAddress,
    abi: CAMPAIGN_ABI,
    functionName: "donations",
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  })

  const { data: hasUserVoted, isLoading: isHasVotedLoading } = useReadContract({
    address: campaignAddress,
    abi: CAMPAIGN_ABI,
    functionName: "hasVoted",
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  })

  // Additional campaign data
  const { data: donorCount, isLoading: isDonorCountLoading } = useReadContract({
    address: campaignAddress,
    abi: CAMPAIGN_ABI,
    functionName: "getDonorCount",
  })

  const { data: votesForSolved, isLoading: isVotesForSolvedLoading } = useReadContract({
    address: campaignAddress,
    abi: CAMPAIGN_ABI,
    functionName: "votesForSolved",
  })

  const { data: votesForNotSolved, isLoading: isVotesForNotSolvedLoading } = useReadContract({
    address: campaignAddress,
    abi: CAMPAIGN_ABI,
    functionName: "votesForNotSolved",
  })

  const { data: votingStartTime, isLoading: isVotingStartTimeLoading } = useReadContract({
    address: campaignAddress,
    abi: CAMPAIGN_ABI,
    functionName: "votingStartTime",
  })

  // Write methods
  const { writeContract: donate, isPending: isDonating } = useWriteContract()
  const { writeContract: submitProof, isPending: isSubmittingProof } = useWriteContract()
  const { writeContract: vote, isPending: isVoting } = useWriteContract()
  const { writeContract: claimFunds, isPending: isClaimingFunds } = useWriteContract()
  const { writeContract: claimRefund, isPending: isClaimingRefund } = useWriteContract()

  // Helper functions
  const donateToCampaign = (amount: bigint) => {
    donate({
      address: campaignAddress,
      abi: CAMPAIGN_ABI,
      functionName: "donate",
      args: [amount],
    })
  }

  const submitCampaignProof = (proofURI: string) => {
    submitProof({
      address: campaignAddress,
      abi: CAMPAIGN_ABI,
      functionName: "submitProof",
      args: [proofURI],
    })
  }

  const voteOnCampaign = (solved: boolean) => {
    vote({
      address: campaignAddress,
      abi: CAMPAIGN_ABI,
      functionName: "vote",
      args: [solved],
    })
  }

  const claimCampaignFunds = () => {
    claimFunds({
      address: campaignAddress,
      abi: CAMPAIGN_ABI,
      functionName: "claimFunds",
    })
  }

  const claimUserRefund = () => {
    claimRefund({
      address: campaignAddress,
      abi: CAMPAIGN_ABI,
      functionName: "claimRefund",
    })
  }

  const isLoading =
    isTitleLoading || isDescriptionLoading || isGoalLoading || isRaisedLoading || 
    isCreatorLoading || isStateLoading || isEnsLoading || isProofLoading ||
    isVotingPeriodLoading || isVotingThresholdLoading || isVotingStatusLoading ||
    isUserDonationLoading || isHasVotedLoading || isDonorCountLoading ||
    isVotesForSolvedLoading || isVotesForNotSolvedLoading || isVotingStartTimeLoading

  return {
    // Basic campaign data
    title: title as string,
    description: description as string,
    goalAmount: goalAmount as bigint,
    totalRaised: totalRaised as bigint,
    creator: creator as string,
    state: state as number,
    ensSubdomain: ensSubdomain as string,
    proofURI: proofURI as string,
    
    // Voting constants
    votingPeriod: votingPeriod as bigint,
    votingThreshold: votingThreshold as bigint,
    
    // Voting status
    votingStatus: votingStatus as [bigint, bigint, bigint, bigint] | undefined,
    
    // User-specific data
    userDonation: userDonation as bigint,
    hasUserVoted: hasUserVoted as boolean,
    
    // Additional data
    donorCount: donorCount as bigint,
    votesForSolved: votesForSolved as bigint,
    votesForNotSolved: votesForNotSolved as bigint,
    votingStartTime: votingStartTime as bigint,
    
    // Loading states
    isLoading,
    isDonating,
    isSubmittingProof,
    isVoting,
    isClaimingFunds,
    isClaimingRefund,
    
    // Write methods
    donateToCampaign,
    submitCampaignProof,
    voteOnCampaign,
    claimCampaignFunds,
    claimUserRefund,
  }
}
