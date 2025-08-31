import { createConfig, http } from "wagmi"
import { base } from "wagmi/chains"
import { coinbaseWallet, walletConnect } from "wagmi/connectors"

export const config = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: "TuCausa",
      appLogoUrl: "https://tucausa.eth/logo.png",
    }),
    // Temporarily disable WalletConnect if project ID is missing
    ...(process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ? [
      walletConnect({
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
        metadata: {
          name: "TuCausa",
          description: "Fundraise for Local Causes on Base",
          url: "https://tucausa.eth",
          icons: ["https://tucausa.eth/logo.png"],
        },
      })
    ] : []),
  ],
  transports: {
    [base.id]: http(),
  },
})
