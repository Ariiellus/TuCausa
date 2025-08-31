"use client"

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useChainId, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useRouter } from 'next/navigation'
import { parseEther } from 'viem'
import { CAMPAIGN_FACTORY_ADDRESS, CAMPAIGN_FACTORY_ABI } from '@/lib/contracts'
import { useI18n } from '@/lib/i18n'

export default function CreateCausePage() {
  const [providerReady, setProviderReady] = useState(false)

  useEffect(() => {
    // Check if WagmiProvider is available by testing a simple hook
    const checkProvider = () => {
      try {
        // This will throw if WagmiProvider is not available
        const { useConfig } = require('wagmi')
        const config = useConfig()
        setProviderReady(true)
      } catch {
        // Retry after a short delay
        setTimeout(checkProvider, 100)
      }
    }
    checkProvider()
  }, [])

  if (!providerReady) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Create Campaign</h1>
              <p className="text-muted-foreground">
                Create a fundraising campaign for your local cause and get community support
              </p>
            </div>
            <div className="h-64 bg-muted rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const chainId = useChainId()
  const router = useRouter()
  const t = useI18n()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goalAmount: '',
    ensSubdomain: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { writeContract, data: hash } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  const handleConnect = () => {
    if (connectors && connectors.length > 0) {
      connect({ connector: connectors[0] })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validate chain
      if (chainId !== 11155111) {
        throw new Error('Please switch to Sepolia network')
      }

      // Validate factory address exists
      const factoryAddress = CAMPAIGN_FACTORY_ADDRESS[chainId]
      if (!factoryAddress) {
        throw new Error('Campaign factory not deployed on this network')
      }

      const goalAmountWei = parseEther(formData.goalAmount)

      writeContract({
        address: factoryAddress as `0x${string}`,
        abi: CAMPAIGN_FACTORY_ABI,
        functionName: 'createCampaign',
        args: [formData.title, formData.description, goalAmountWei, formData.ensSubdomain]
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create campaign')
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (isConfirmed) {
      setSuccess(true)
      setIsSubmitting(false)
      setTimeout(() => {
        router.push('/causes')
      }, 2000)
    }
  }, [isConfirmed, router])

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Create Campaign</h1>
              <p className="text-muted-foreground">
                Create a fundraising campaign for your local cause and get community support
              </p>
            </div>
            <div className="bg-card rounded-lg p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
              <p className="text-muted-foreground mb-6">
                You need to connect your wallet to create a campaign
              </p>
              <button
                onClick={handleConnect}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Campaign Created!</h1>
              <p className="text-muted-foreground">
                Your campaign has been successfully created on the blockchain
              </p>
            </div>
            <div className="bg-card rounded-lg p-8 text-center">
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <h2 className="text-xl font-semibold mb-4">Success!</h2>
              <p className="text-muted-foreground mb-6">
                Redirecting to campaigns page...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Campaign</h1>
            <p className="text-muted-foreground">
              Create a fundraising campaign for your local cause and get community support
            </p>
          </div>

          <div className="bg-card rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Campaign Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  placeholder="Enter campaign title"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  placeholder="Describe your campaign"
                />
              </div>

              <div>
                <label htmlFor="goalAmount" className="block text-sm font-medium mb-2">
                  Goal Amount (ETH)
                </label>
                <input
                  type="number"
                  id="goalAmount"
                  name="goalAmount"
                  value={formData.goalAmount}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  placeholder="0.0"
                />
              </div>

              <div>
                <label htmlFor="ensSubdomain" className="block text-sm font-medium mb-2">
                  ENS Subdomain (Optional)
                </label>
                <input
                  type="text"
                  id="ensSubdomain"
                  name="ensSubdomain"
                  value={formData.ensSubdomain}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  placeholder="mycampaign"
                />
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || isConfirming}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Creating Campaign...' : isConfirming ? 'Confirming Transaction...' : 'Create Campaign'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
