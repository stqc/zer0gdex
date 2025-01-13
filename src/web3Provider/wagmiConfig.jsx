import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { ZEROGCHAIN } from "./zer0Gchain";

export const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [ZEROGCHAIN],
    transports: {
      // RPC URL for each chain
      [ZEROGCHAIN.id]: http(
        "https://evmrpc-testnet.0g.ai",
      ),
    },

    // Required API Keys
    // walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,

    // Required App Info
    appName: "Zer0Gdex",

    // Optional App Info
    appDescription: "Zer0Gdex is a decentralized exchange for the Zer0G ecosystem.",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};