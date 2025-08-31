"use client"

import { Button } from "@/components/ui/button"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Heart, Wallet } from "lucide-react"
import Link from "next/link"

export function Header() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

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
          <span className="text-xl font-bold text-foreground">TuCausa</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link
            href="/causes"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            View Causes
          </Link>
          <Link
            href="/create"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Start a Cause
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <Button variant="outline" size="sm" onClick={() => disconnect()}>
                Disconnect
              </Button>
            </div>
          ) : (
            <Button onClick={handleConnect} className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
