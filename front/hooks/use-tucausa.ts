"use client"

import { useEffect, useState } from "react"
import { useAccount, useChainId, useSwitchChain } from "wagmi"
import { base } from "wagmi/chains"

export function useTuCausa() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const [isSwitching, setIsSwitching] = useState(false)

  const isBaseNetwork = chainId === 8453

  // Auto-switch to Base network when connected to wrong network
  useEffect(() => {
    if (isConnected && !isBaseNetwork && !isSwitching) {
      console.log("User connected to wrong network, switching to Base...")
      setIsSwitching(true)
      try {
        switchChain({ chainId: base.id })
        console.log("Successfully switched to Base network")
      } catch (error) {
        console.error("Failed to switch to Base network:", error)
      } finally {
        setIsSwitching(false)
      }
    }
  }, [isConnected, isBaseNetwork, switchChain, isSwitching])

  // Force Base network on every connection
  useEffect(() => {
    if (isConnected && chainId !== 8453 && !isSwitching) {
      console.log("Forcing Base network connection...")
      setIsSwitching(true)
      try {
        switchChain({ chainId: 8453 })
        console.log("Forced switch to Base network successful")
      } catch (error) {
        console.error("Failed to force switch to Base network:", error)
      } finally {
        setIsSwitching(false)
      }
    }
  }, [isConnected, chainId, switchChain, isSwitching])

  const forceSwitchToBase = () => {
    if (chainId !== 8453 && !isSwitching) {
      setIsSwitching(true)
      try {
        switchChain({ chainId: 8453 })
        console.log("Manual switch to Base network successful")
      } catch (error) {
        console.error("Manual switch to Base network failed:", error)
        throw error
      } finally {
        setIsSwitching(false)
      }
    }
  }

  return {
    address,
    isConnected,
    chainId,
    isBaseNetwork,
    isSwitching,
    switchToBase: forceSwitchToBase,
  }
}
