import { defineChain } from 'viem';
import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';

export const arcTestnet = defineChain({
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.arc.network'],
    },
    public: {
      http: ['https://rpc.testnet.arc.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'ArcScan',
      url: 'https://testnet.arcscan.app',
    },
  },
});

export const CONTRACT_ADDRESS = (import.meta.env.VITE_CONTRACT_ADDRESS ||
  '0x89e73e6d885eeFA1a99bEBA1feF983BcAFe11Ce3') as `0x${string}`;

export const ADMIN_ADDRESS = '0x8C4eCe4809bdD380Ae944f1e72DAeF769CC6f55B' as `0x${string}`;

export const TOKENS = {
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x3600000000000000000000000000000000000000' as `0x${string}`,
    decimals: 6,
  },
  EURC: {
    symbol: 'EURC',
    name: 'Euro Coin',
    address: '0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a' as `0x${string}`,
    decimals: 6,
  },
} as const;

export const wagmiConfig = createConfig({
  chains: [arcTestnet],
  connectors: [
    injected(),
  ],
  transports: {
    [arcTestnet.id]: http('https://rpc.testnet.arc.network'),
  },
});

