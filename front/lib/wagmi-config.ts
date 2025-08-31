import { createConfig, http } from "wagmi"
import { base, mainnet } from "wagmi/chains"
import { coinbaseWallet, walletConnect } from "wagmi/connectors"

// Use public RPC endpoints for better localhost development
const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://mainnet.base.org"
const MAINNET_RPC_URL = process.env.NEXT_PUBLIC_MAINNET_RPC_URL || "https://eth.llamarpc.com"

export const config = createConfig({
  chains: [base, mainnet],
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
    [base.id]: http(BASE_RPC_URL),
    [mainnet.id]: http(MAINNET_RPC_URL),
  },
})
