"use client"

import { Button } from "@/components/ui/button"
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi"
import { Heart, Wallet, Menu, X } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { LanguageToggle } from "@/components/language-toggle"
import { ClientOnly } from "@/components/client-only"
import { EnsProfile } from "@/components/ens-profile"
import { useState } from "react"

function WalletSection() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const t = useI18n()

  const handleConnect = () => {
    console.log("Available connectors:", connectors.map(c => c.name))
    console.log("Current chain ID:", chainId)
    
    // Try Coinbase Wallet first
    const coinbaseConnector = connectors.find((connector) => 
      connector.name === "Coinbase Wallet" || 
      connector.name === "Coinbase Wallet (SDK)" ||
      connector.name.toLowerCase().includes("coinbase")
    )
    
    if (coinbaseConnector) {
      console.log("Connecting with:", coinbaseConnector.name)
      connect({ connector: coinbaseConnector })
    } else {
      // Fallback to first available connector
      const firstConnector = connectors[0]
      if (firstConnector) {
        console.log("Connecting with fallback:", firstConnector.name)
        connect({ connector: firstConnector })
      } else {
        console.error("No connectors available")
        alert("No wallet connectors available. Please install Coinbase Wallet or WalletConnect.")
      }
    }
  }

  const handleSwitchToBase = () => {
    console.log("Switching to Base network...")
    switchChain({ chainId: 8453 })
  }

  return (
    <>
                    {isConnected ? (
                <div className="flex items-center gap-2">
                  <div className="text-xs text-muted-foreground">
                    {chainId === 8453 ? "Base" : chainId === 1 ? "Ethereum" : `Chain ${chainId}`}
                  </div>
                  {chainId !== 8453 && (
                    <Button variant="destructive" size="sm" onClick={handleSwitchToBase} className="bg-red-600 hover:bg-red-700">
                      ⚠️ Switch to Base
                    </Button>
                  )}
                  <EnsProfile />
                  <Button variant="outline" size="sm" onClick={() => disconnect()}>
                    {t('common.disconnect')}
                  </Button>
                </div>
              ) : (
        <Button onClick={handleConnect} className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          {t('common.connectWallet')}
        </Button>
      )}
    </>
  )
}

function MobileWalletSection() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const t = useI18n()

  const handleConnect = () => {
    console.log("Available connectors:", connectors.map(c => c.name))
    
    // Try Coinbase Wallet first
    const coinbaseConnector = connectors.find((connector) => 
      connector.name === "Coinbase Wallet" || 
      connector.name === "Coinbase Wallet (SDK)" ||
      connector.name.toLowerCase().includes("coinbase")
    )
    
    if (coinbaseConnector) {
      console.log("Connecting with:", coinbaseConnector.name)
      connect({ connector: coinbaseConnector })
    } else {
      // Fallback to first available connector
      const firstConnector = connectors[0]
      if (firstConnector) {
        console.log("Connecting with fallback:", firstConnector.name)
        connect({ connector: firstConnector })
      } else {
        console.error("No connectors available")
        alert("No wallet connectors available. Please install Coinbase Wallet or WalletConnect.")
      }
    }
  }

  const handleSwitchToBase = () => {
    console.log("Switching to Base network from mobile...")
    switchChain({ chainId: 8453 })
  }

  return (
    <>
      {isConnected ? (
        <div className="flex flex-col space-y-3">
          <div className="text-xs text-muted-foreground">
            {chainId === 8453 ? "Base Network" : chainId === 1 ? "Ethereum" : `Chain ${chainId}`}
          </div>
          {chainId !== 8453 && (
            <Button variant="destructive" size="sm" onClick={handleSwitchToBase} className="bg-red-600 hover:bg-red-700">
              ⚠️ Switch to Base
            </Button>
          )}
          <EnsProfile />
          <Button variant="outline" size="sm" onClick={() => disconnect()}>
            {t('common.disconnect')}
          </Button>
        </div>
      ) : (
        <Button onClick={handleConnect} className="flex items-center gap-2 w-full">
          <Wallet className="h-4 w-4" />
          {t('common.connectWallet')}
        </Button>
      )}
    </>
  )
}

export function Header() {
  const t = useI18n()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">{t('header.title')}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t('common.home')}
          </Link>
          <Link
            href="/causes"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('common.viewCauses')}
          </Link>
          <Link
            href="/create"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('common.startACause')}
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <ClientOnly fallback={<div className="w-20 h-9 bg-muted rounded-md animate-pulse" />}>
            <LanguageToggle />
          </ClientOnly>
          <ClientOnly fallback={<div className="w-32 h-9 bg-muted rounded-md animate-pulse" />}>
            <WalletSection />
          </ClientOnly>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <ClientOnly fallback={<div className="w-9 h-9 bg-muted rounded-md animate-pulse" />}>
            <LanguageToggle />
          </ClientOnly>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('common.home')}
              </Link>
              <Link
                href="/causes"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('common.viewCauses')}
              </Link>
              <Link
                href="/create"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('common.startACause')}
              </Link>
            </nav>

            {/* Mobile Wallet Section */}
            <div className="pt-4 border-t border-border">
              <ClientOnly fallback={<div className="w-full h-9 bg-muted rounded-md animate-pulse" />}>
                <MobileWalletSection />
              </ClientOnly>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
