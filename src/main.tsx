import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  createConfig,
  http,
  WagmiProvider,
} from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css";

// --- Setup wallets ---
const { connectors } = getDefaultWallets({
  appName: "Monad Swap",
  projectId: "cb5be958d603567487c52cd49e585965", // WalletConnect Project ID
});

// --- Setup wagmi config ---
const config = createConfig({
  chains: [sepolia],
  connectors,
  transports: {
    [sepolia.id]: http(), // use Monad RPC here later
  },
});

// --- React Query client (needed by wagmi v2) ---
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
