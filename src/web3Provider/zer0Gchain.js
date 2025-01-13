export const ZEROGCHAIN = {
  id: 16600,
  name: 'Zer0Gchain',
  nativeCurrency: { name: 'Zer0Gchain', symbol: 'A0GI', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://evmrpc-testnet.0g.ai'],
    },
  },
  blockExplorers: {
    default: {
      name: 'ChainScan',
      url: 'https://chainscan-newton.0g.ai/',
      apiUrl: '#',
    },
  },
  contracts: {
    ensRegistry: {
      address: '',
    },
    ensUniversalResolver: {
      address: '',
      blockCreated: null,
    },
    multicall3: {
      address: '',
      blockCreated: null,
    },
  },
} ;
