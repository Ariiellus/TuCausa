"use client"

import { useState, use } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from "wagmi"
import { parseUnits, formatUnits } from "viem"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ProofViewer } from "@/components/proof-viewer"
import {
  Loader2,
  Heart,
  Users,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Clock,
  DollarSign,
} from "lucide-react"
import { CAMPAIGN_ABI, USDC_ADDRESS, USDC_ABI } from "@/lib/contracts"
import { useChainId } from "wagmi"
import Link from "next/link"

interface CampaignPageProps {
  params: Promise<{ address: string }>
}

export default function CampaignPage({ params }: CampaignPageProps) {
  const { address } = use(params)
  const { address: userAddress, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const [donationAmount, setDonationAmount] = useState("")
  const [step, setStep] = useState<"input" | "approve" | "donate">("input")
  
  // Network validation
  const isBaseNetwork = chainId === 8453



  
  // Read campaign data
  const { data: title } = useReadContract({
    address: address as `0x${string}`,
    abi: CAMPAIGN_ABI,
    functionName: "title",
  })

  const { data: description } = useReadContract({
    address: address as `0x${string}`,
    abi: CAMPAIGN_ABI,
    functionName: "description",
  })

  const { data: goalAmount } = useReadContract({
    address: address as `0x${string}`,
    abi: CAMPAIGN_ABI,
    functionName: "goalAmount",
  })

  const { data: totalRaised } = useReadContract({
    address: address as `0x${string}`,
    abi: CAMPAIGN_ABI,
    functionName: "totalRaised",
  })

  const { data: creator } = useReadContract({
    address: address as `0x${string}`,
    abi: CAMPAIGN_ABI,
    functionName: "creator",
  })

  const { data: campaignState } = useReadContract({
    address: address as `0x${string}`,
    abi: CAMPAIGN_ABI,
    functionName: "state",
  })

  const { data: userDonation } = useReadContract({
    address: address as `0x${string}`,
    abi: CAMPAIGN_ABI,
    functionName: "donations",
    args: userAddress ? [userAddress] : undefined,
  })

  const { data: usdcBalance } = useReadContract({
    address: USDC_ADDRESS[chainId as keyof typeof USDC_ADDRESS],
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
  })

  const { data: proofURI } = useReadContract({
    address: address as `0x${string}`,
    abi: CAMPAIGN_ABI,
    functionName: "proofURI",
  })

  const { data: votingStatus } = useReadContract({
    address: address as `0x${string}`,
    abi: CAMPAIGN_ABI,
    functionName: "getVotingStatus",
  })

  const { data: hasVoted } = useReadContract({
    address: address as `0x${string}`,
    abi: CAMPAIGN_ABI,
    functionName: "hasVoted",
    args: userAddress ? [userAddress] : undefined,
  })

  // Contract interactions
  const { writeContract: approveUSDC, data: approveHash, isPending: isApproving } = useWriteContract()
  const { writeContract: donate, data: donateHash, isPending: isDonating } = useWriteContract()

  const { writeContract: vote, data: voteHash, isPending: isVoting } = useWriteContract()
  const { writeContract: claimFunds, data: claimHash, isPending: isClaiming } = useWriteContract()
  const { writeContract: claimRefund, data: refundHash, isPending: isRefunding } = useWriteContract()

  const { isLoading: isApproveConfirming, isSuccess: isApproveConfirmed } = useWaitForTransactionReceipt({
    hash: approveHash,
  })

  const { isLoading: isDonateConfirming, isSuccess: isDonateConfirmed } = useWaitForTransactionReceipt({
    hash: donateHash,
  })

  const { isLoading: isVoteConfirming, isSuccess: isVoteConfirmed } = useWaitForTransactionReceipt({
    hash: voteHash,
  })

  const { isLoading: isClaimConfirming, isSuccess: isClaimConfirmed } = useWaitForTransactionReceipt({
    hash: claimHash,
  })

  const { isLoading: isRefundConfirming, isSuccess: isRefundConfirmed } = useWaitForTransactionReceipt({
    hash: refundHash,
  })

  // Calculate progress
  const progressPercentage = goalAmount && totalRaised ? Number((totalRaised * BigInt(100)) / goalAmount) : 0

  // Format amounts
  const goalFormatted = goalAmount ? formatUnits(goalAmount, 6) : "0"
  const raisedFormatted = totalRaised ? formatUnits(totalRaised, 6) : "0"
  const userDonationFormatted = userDonation ? formatUnits(userDonation, 6) : "0"
  const usdcBalanceFormatted = usdcBalance ? formatUnits(usdcBalance, 6) : "0"

  const votesForSolved = votingStatus ? Number(votingStatus[0]) : 0
  const votesForNotSolved = votingStatus ? Number(votingStatus[1]) : 0
  const totalDonors = votingStatus ? Number(votingStatus[2]) : 0
  const timeRemaining = votingStatus ? Number(votingStatus[3]) : 0

  // Get campaign status
  const getStatusInfo = (state: number) => {
    switch (state) {
      case 0:
        return { label: "Active", variant: "default" as const, color: "text-primary" }
      case 1:
        return { label: "Under Review", variant: "secondary" as const, color: "text-yellow-600" }
      case 2:
        return { label: "Completed", variant: "outline" as const, color: "text-green-600" }
      case 3:
        return { label: "Refunded", variant: "destructive" as const, color: "text-red-600" }
      default:
        return { label: "Unknown", variant: "outline" as const, color: "text-gray-600" }
    }
  }

  const statusInfo = getStatusInfo(Number(campaignState || 0))

  const handleApprove = async () => {
    if (!donationAmount || !isConnected) return
    
    if (!isBaseNetwork) {
      alert("Please switch to Base network to donate to this campaign.")
      return
    }

    const amountWei = parseUnits(donationAmount, 6)

    try {
      approveUSDC({
        address: USDC_ADDRESS[chainId as keyof typeof USDC_ADDRESS],
        abi: USDC_ABI,
        functionName: "approve",
        args: [address as `0x${string}`, amountWei],
      })
      setStep("approve")
    } catch (err) {
      console.error("Error approving USDC:", err)
    }
  }

  const handleDonate = async () => {
    if (!donationAmount || !isConnected) return
    
    if (!isBaseNetwork) {
      alert("Please switch to Base network to donate to this campaign.")
      return
    }

    const amountWei = parseUnits(donationAmount, 6)

    try {
      donate({
        address: address as `0x${string}`,
        abi: CAMPAIGN_ABI,
        functionName: "donate",
        args: [amountWei],
      })
      setStep("donate")
    } catch (err) {
      console.error("Error donating:", err)
    }
  }

  const handleVote = async (solved: boolean) => {
    if (!isConnected) return
    
    if (!isBaseNetwork) {
      alert("Please switch to Base network to vote on this campaign.")
      return
    }

    try {
      vote({
        address: address as `0x${string}`,
        abi: CAMPAIGN_ABI,
        functionName: "vote",
        args: [solved],
      })
    } catch (err) {
      console.error("Error voting:", err)
    }
  }

  const handleClaimFunds = async () => {
    if (!isConnected) return
    
    if (!isBaseNetwork) {
      alert("Please switch to Base network to claim funds from this campaign.")
      return
    }

    try {
      claimFunds({
        address: address as `0x${string}`,
        abi: CAMPAIGN_ABI,
        functionName: "claimFunds",
        args: [],
      })
    } catch (err) {
      console.error("Error claiming funds:", err)
    }
  }

  const handleClaimRefund = async () => {
    if (!isConnected) return
    
    if (!isBaseNetwork) {
      alert("Please switch to Base network to claim refund from this campaign.")
      return
    }

    try {
      claimRefund({
        address: address as `0x${string}`,
        abi: CAMPAIGN_ABI,
        functionName: "claimRefund",
        args: [],
      })
    } catch (err) {
      console.error("Error claiming refund:", err)
    }
  }

  // Auto-progress to donation step after approval
  if (isApproveConfirmed && step === "approve") {
    handleDonate()
  }

  // Reset form after successful donation
  if (isDonateConfirmed && step === "donate") {
    setDonationAmount("")
    setStep("input")
  }

  const isCreator = creator && userAddress && creator.toLowerCase() === userAddress.toLowerCase()
  const isDonor = Number(userDonation || 0) > 0
  const canVote = isDonor && Number(campaignState || 0) === 1 && !hasVoted && timeRemaining > 0

  const formatTimeRemaining = (seconds: number) => {
    if (seconds <= 0) return "Voting ended"
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (days > 0) return `${days}d ${hours}h remaining`
    if (hours > 0) return `${hours}h ${minutes}m remaining`
    return `${minutes}m remaining`
  }

  return (
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
        <div className="max-w-4xl mx-auto">
          {/* Campaign Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              {isCreator && <Badge variant="outline">Your Campaign</Badge>}
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{title || "Loading..."}</h1>
            <p className="text-muted-foreground">{description || "Loading description..."}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Funding Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Raised</span>
                        <span className="font-medium">
                          ${raisedFormatted} / ${goalFormatted} USDC
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-3" />
                      <p className="text-xs text-muted-foreground mt-1">{progressPercentage.toFixed(1)}% funded</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">${raisedFormatted}</p>
                        <p className="text-sm text-muted-foreground">Total Raised</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">${goalFormatted}</p>
                        <p className="text-sm text-muted-foreground">Goal Amount</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {Number(campaignState || 0) >= 1 && proofURI && <ProofViewer proofURI={proofURI as string} />}

              {Number(campaignState || 0) === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Community Voting
                    </CardTitle>
                    <CardDescription>Donors are reviewing the proof and voting on completion</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">{votesForSolved}</p>
                        <p className="text-sm text-muted-foreground">Solved</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-600">{votesForNotSolved}</p>
                        <p className="text-sm text-muted-foreground">Not Solved</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{totalDonors}</p>
                        <p className="text-sm text-muted-foreground">Total Donors</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{formatTimeRemaining(timeRemaining)}</span>
                      </div>
                      <Progress value={totalDonors > 0 ? (votesForSolved / totalDonors) * 100 : 0} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {totalDonors > 0 ? Math.round((votesForSolved / totalDonors) * 100) : 0}% approval rate
                      </p>
                    </div>

                    {canVote && (
                      <div className="flex gap-3 pt-4 border-t">
                        <Button
                          onClick={() => handleVote(true)}
                          disabled={isVoting || isVoteConfirming}
                          className="flex-1"
                        >
                          {isVoting || isVoteConfirming ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <ThumbsUp className="mr-2 h-4 w-4" />
                          )}
                          Mark as Solved
                        </Button>
                        <Button
                          onClick={() => handleVote(false)}
                          disabled={isVoting || isVoteConfirming}
                          variant="destructive"
                          className="flex-1"
                        >
                          {isVoting || isVoteConfirming ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <ThumbsDown className="mr-2 h-4 w-4" />
                          )}
                          Not Solved
                        </Button>
                      </div>
                    )}

                    {isDonor && hasVoted && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>You have already voted on this campaign</AlertDescription>
                      </Alert>
                    )}

                    {isVoteConfirmed && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>Your vote has been recorded successfully!</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Campaign Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">{description}</p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Creator</p>
                      <p className="font-mono text-sm">
                        {creator ? `${creator.slice(0, 6)}...${creator.slice(-4)}` : "Loading..."}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className={`font-medium ${statusInfo.color}`}>{statusInfo.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Donation Sidebar */}
            <div className="space-y-6">
              {/* Donation Card */}
              {Number(campaignState || 0) === 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Make a Donation</CardTitle>
                    <CardDescription>Support this cause with USDC</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!isConnected ? (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>Connect your wallet to donate</AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="amount">Donation Amount (USDC)</Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="100"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(e.target.value)}
                            min="0.01"
                            step="0.01"
                          />
                          <p className="text-xs text-muted-foreground">Your USDC balance: ${usdcBalanceFormatted}</p>
                        </div>

                        <Button
                          onClick={step === "input" ? handleApprove : handleDonate}
                          className="w-full"
                          disabled={
                            !donationAmount ||
                            isApproving ||
                            isApproveConfirming ||
                            isDonating ||
                            isDonateConfirming ||
                            Number(donationAmount) <= 0
                          }
                        >
                          {isApproving || isApproveConfirming ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Approving USDC...
                            </>
                          ) : isDonating || isDonateConfirming ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Donating...
                            </>
                          ) : step === "input" ? (
                            "Donate Now"
                          ) : (
                            "Confirm Donation"
                          )}
                        </Button>

                        {isDonateConfirmed && (
                          <Alert>
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>Thank you for your donation!</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Creator Fund Claim */}
              {isCreator && Number(campaignState || 0) === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      Claim Funds
                    </CardTitle>
                    <CardDescription>Your campaign was approved by the community</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <p className="text-2xl font-bold text-primary">${raisedFormatted}</p>
                      <p className="text-sm text-muted-foreground">Available to claim</p>
                    </div>
                    <Button onClick={handleClaimFunds} disabled={isClaiming || isClaimConfirming} className="w-full">
                      {isClaiming || isClaimConfirming ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Claiming...
                        </>
                      ) : (
                        "Claim Funds"
                      )}
                    </Button>
                    {isClaimConfirmed && (
                      <Alert className="mt-4">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>Funds claimed successfully!</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Donor Refund */}
              {isDonor && Number(campaignState || 0) === 3 && Number(userDonation || 0) > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-destructive" />
                      Claim Refund
                    </CardTitle>
                    <CardDescription>Campaign was not approved by the community</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <p className="text-2xl font-bold text-destructive">${userDonationFormatted}</p>
                      <p className="text-sm text-muted-foreground">Available for refund</p>
                    </div>
                    <Button
                      onClick={handleClaimRefund}
                      disabled={isRefunding || isRefundConfirming}
                      variant="destructive"
                      className="w-full"
                    >
                      {isRefunding || isRefundConfirming ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Claim Refund"
                      )}
                    </Button>
                    {isRefundConfirmed && (
                      <Alert className="mt-4">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>Refund processed successfully!</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* User Stats */}
              {isConnected && Number(userDonation || 0) > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Your Contribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">${userDonationFormatted}</p>
                      <p className="text-sm text-muted-foreground">Total Donated</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Campaign Actions for Creator */}
              {isCreator && Number(campaignState || 0) === 0 && Number(totalRaised || 0) > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Campaign Actions</CardTitle>
                    <CardDescription>Manage your campaign</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link href={`/campaign/${address}/submit-proof`}>Submit Proof</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* External Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <Link href={`https://basescan.org/address/${address}`} target="_blank">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on BaseScan
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <Link href="/causes">
                      <Heart className="mr-2 h-4 w-4" />
                      Browse Other Causes
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
