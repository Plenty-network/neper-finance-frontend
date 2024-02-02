import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  sepolia,
  arbitrumSepolia,
  polygonZkEvmTestnet,
  mantleTestnet,
  scrollTestnet,
  baseGoerli
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import HomePage from "./pages/HomePage";
import { AppProvider } from "./context/AppContext";
const { chains, publicClient } = configureChains([arbitrumSepolia], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: "Neper Finance",
  projectId: "YOUR_PROJECT_ID",
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});

const App = () => {
  return (
    <div className="bg-gradient-to-b from-purple-800 via-gray-950 to-black ">
      <WagmiConfig config={wagmiConfig}>
        <AppProvider>
          <RainbowKitProvider chains={chains}>
            <BrowserRouter>
              <Routes>
                <Route path="/" Component={HomePage} />
                <Route path="/dapp" element={<HomePage />} />
              </Routes>
            </BrowserRouter>
          </RainbowKitProvider>
        </AppProvider>
      </WagmiConfig>
    </div>
  );
};

export default App;
