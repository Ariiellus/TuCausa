"use client"

import { useReadContract, useWriteContract } from "wagmi"
import { USDC_ADDRESS, USDC_ABI } from "@/lib/contracts"
import { useChainId, useAccount } from "wagmi"

export function useUSDC() {
  const chainId = useChainId()
  const { address } = useAccount()

  const usdcAddress = USDC_ADDRESS[chainId as keyof typeof USDC_ADDRESS]

  // Read methods
  const { data: balance, isLoading: isBalanceLoading } = useReadContract({
    address: usdcAddress,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const { data: decimals, isLoading: isDecimalsLoading } = useReadContract({
    address: usdcAddress,
    abi: USDC_ABI,
    functionName: "decimals",
  })

  const { data: totalSupply, isLoading: isTotalSupplyLoading } = useReadContract({
    address: usdcAddress,
    abi: USDC_ABI,
    functionName: "totalSupply",
  })

  // Write methods
  const { writeContract: approve, isPending: isApproving } = useWriteContract()
  const { writeContract: transfer, isPending: isTransferring } = useWriteContract()
  const { writeContract: transferFrom, isPending: isTransferringFrom } = useWriteContract()

  // Helper functions
  const approveSpending = (spender: string, amount: bigint) => {
    if (!usdcAddress) return

    approve({
      address: usdcAddress,
      abi: USDC_ABI,
      functionName: "approve",
      args: [spender as `0x${string}`, amount],
    })
  }

  const transferTokens = (to: string, amount: bigint) => {
    if (!usdcAddress) return

    transfer({
      address: usdcAddress,
      abi: USDC_ABI,
      functionName: "transfer",
      args: [to as `0x${string}`, amount],
    })
  }

  const transferFromTokens = (from: string, to: string, amount: bigint) => {
    if (!usdcAddress) return

    transferFrom({
      address: usdcAddress,
      abi: USDC_ABI,
      functionName: "transferFrom",
      args: [from as `0x${string}`, to as `0x${string}`, amount],
    })
  }

  // Check allowance for a specific spender
  const getAllowance = (owner: string, spender: string) => {
    return useReadContract({
      address: usdcAddress,
      abi: USDC_ABI,
      functionName: "allowance",
      args: [owner as `0x${string}`, spender as `0x${string}`],
    })
  }

  const isLoading = isBalanceLoading || isDecimalsLoading || isTotalSupplyLoading

  return {
    // Read data
    balance: balance as bigint | undefined,
    decimals: decimals as number | undefined,
    totalSupply: totalSupply as bigint | undefined,
    
    // Loading states
    isLoading,
    isApproving,
    isTransferring,
    isTransferringFrom,
    
    // Write methods
    approveSpending,
    transferTokens,
    transferFromTokens,
    getAllowance,
  }
}
