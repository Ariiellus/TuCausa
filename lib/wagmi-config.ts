import { createConfig, http } from "wagmi"
import { base, baseSepolia } from "wagmi/chains"
import { coinbaseWallet } from "wagmi/connectors"

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: "TuCausa",
      appLogoUrl: "https://tucausa.eth/logo.png",
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})
