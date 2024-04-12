"use client";

import { siteConfig } from "@/config/site";
import { PrivyProvider, type PrivyClientConfig } from "@privy-io/react-auth";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";

export const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
    noPromptOnSignature: false,
  },
  loginMethods: ["wallet", "google", "email"],
  appearance: {
    showWalletLoginFirst: true,
  },
  supportedChains: [siteConfig.contracts.chain],
  defaultChain: siteConfig.contracts.chain,
};

const wagmiConfig = createConfig({
  chains: [siteConfig.contracts.chain],
  transports: {
    [siteConfig.contracts.chain.id]: http(),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={privyConfig}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
