import { createConfig, http } from 'wagmi'
import { tempoModerato } from 'viem/chains'
import { metaMask } from 'wagmi/connectors'

export const config = createConfig({
  
  // chains: [mainnet, sepolia],
  chains: [tempoModerato as any],
  connectors: [metaMask()], 
  multiInjectedProviderDiscovery: true, 
  transports: {
    [tempoModerato.id]: http(),
  },
  // transports: {
  //   [mainnet.id]: http(),
  //   [sepolia.id]: http(),
  // },
})