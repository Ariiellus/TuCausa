import { createConfig, http } from "wagmi"
import { mainnet, base, sepolia } from "wagmi/chains"
import { coinbaseWallet, walletConnect } from "wagmi/connectors"

export const config = createConfig({
  chains: [mainnet, base, sepolia],
  connectors: [
    coinbaseWallet({
      appName: "TuCausa",
      appLogoUrl: "https://tucausa.eth/logo.png",
    }),
    // Temporarily disable WalletConnect if project ID is missing
    ...(process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ? [
      walletConnect({
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
      })
    ] : []),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
  },
})
