"use client"

import { Button } from "@/components/ui/button"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Heart, Wallet, Menu, X } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { LanguageToggle } from "@/components/language-toggle"
import { ClientOnly } from "@/components/client-only"
import { EnsProfile } from "@/components/ens-profile"
import { useState } from "react"

export function Header() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const t = useI18n()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleConnect = () => {
    const coinbaseConnector = connectors.find((connector) => connector.name === "Coinbase Wallet")
    if (coinbaseConnector) {
      connect({ connector: coinbaseConnector })
    }
  }

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
          {isConnected ? (
            <div className="flex items-center gap-2">
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
              {isConnected ? (
                <div className="flex flex-col space-y-3">
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
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
