import React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Web3Provider } from "@/components/web3-provider"
import { LanguageProvider } from "@/components/language-provider"
import { FarcasterProvider } from "@/components/farcaster-provider"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "TuCausa - Fundraise for Local Causes",
  description: "Create and fundraise for local causes with USDC on Base",
  generator: "v0.app",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <FarcasterProvider>
            <LanguageProvider>
              <Web3Provider>{children}</Web3Provider>
            </LanguageProvider>
          </FarcasterProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
