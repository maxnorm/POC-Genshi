'use client';

import '@rainbow-me/rainbowkit/styles.css';
import {getDefaultConfig, RainbowKitProvider, darkTheme} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";
import { getNetworkConfig } from "@/lib/networkConfig";

const { wagmiChain } = getNetworkConfig()

const config = getDefaultConfig({
  appName: 'Voting DApp',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [wagmiChain],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

const RainbowKitAndWagmiProvider = ({children} : {children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
            accentColor: '#03c0f9',
            accentColorForeground: '#000f24',
            borderRadius: 'large',
            fontStack: 'system',
            overlayBlur: 'small',
        })}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default RainbowKitAndWagmiProvider