import type { AppProps } from "next/app";
import "dotenv/config";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  ConnectButton,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  arbitrum,
  goerli,
  mainnet,
  optimism,
  polygon,
  base,
  zora,
} from "wagmi/chains";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { publicProvider } from "wagmi/providers/public";
import {
  braveWallet,
  rabbyWallet,
  trustWallet,
} from "@rainbow-me/rainbowkit/wallets";
import "@rainbow-me/rainbowkit/styles.css";
import "../styles/globals.css";
import { Nanum_Gothic_Coding } from "next/font/google";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
    goerli,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [goerli] : []),
  ],
  [publicProvider()]
);

const { wallets } = getDefaultWallets({
  appName: "KT",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID!,
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [braveWallet({ chains }), rabbyWallet({ chains })],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const nanum_Gothic_Coding = Nanum_Gothic_Coding({
  subsets: ["latin"],
  weight: ["400"],
});

// const cloister_black = localFont({ src: "../font/CloisterBlack.ttf" });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className="nanum_Gothic_Coding min-h-screen bg-stone-800 text-slate-50 px-5 md:px-20 lg:px-40">
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "rgb(100,100,100)",
          })}
          chains={chains}
        >
          <Component {...pageProps} />
          <div className="grid justify-items-center mt-5 pb-10">
            <ConnectButton chainStatus="icon" showBalance={true} />
          </div>
        </RainbowKitProvider>
      </WagmiConfig>
    </main>
  );
}

export default MyApp;
