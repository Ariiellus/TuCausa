import { createConfig, http } from "wagmi"
import { base, baseSepolia, mainnet } from "wagmi/chains"
import { coinbaseWallet, walletConnect } from "wagmi/connectors"

export const config = createConfig({
  chains: [base, baseSepolia, mainnet],
  connectors: [
    coinbaseWallet({
      appName: "TuCausa",
      appLogoUrl: "https://tucausa.eth/logo.png",
    }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID!,
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [mainnet.id]: http(),
  },
})
