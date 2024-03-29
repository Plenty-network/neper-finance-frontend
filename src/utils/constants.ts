import BigNumber from "bignumber.js";

interface Chains {
  [key: string]: {
    name: string;
    rpcUrl: string;
    iconUrl: string;
    currency: {
      name: string;
      symbol: string;
      decimals: number;
    };
    contracts: {
      neperCore: string;
      neperUSD: string;
      wbtc: string;
      stabilityPool: string;
    };
    subgraphEndpoint?: string;
  };
}

export const TEST_ETH_PRICE = 2200;

export const Q64 = new BigNumber(2).pow(64);
export const Q64_MUL_100 = new BigNumber(100).multipliedBy(Q64);

export const CHAINS: Chains = {
  "0xaa36a7": {
    name: "Sepolia",
    rpcUrl: "https://rpc.sepolia.org",
    iconUrl: "https://chainlist.org/unknown-logo.png",
    currency: { name: "ETH", symbol: "ETH", decimals: 18 },
    subgraphEndpoint: "https://api.studio.thegraph.com/query/60908/neper-sepolia/version/latest",
    contracts: {
      neperCore: "0xCD010F537A4054e4D9DC413A3b81C0fbD8782b41",
      neperUSD: "0xabe877b0d850a13918cf5b2bcaa9bbea6c35c74f",
      wbtc: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
      stabilityPool: "0x0d0f8a5f0c2f4d3a8d6c8e8b0a1b7d9f1c5f8d9e"
    }
  },
  "0x66eee": {
    name: "Arbitrum testnet",
    rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
    iconUrl: "https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg",
    currency: { name: "ETH", symbol: "ETH", decimals: 18 },
    subgraphEndpoint: "https://api.studio.thegraph.com/query/64179/nepercore/version/latest",
    contracts: {
      neperCore: "0xcD517C93DE23230773935Fd5d3285924454fB0b3",
      neperUSD: "0xC0d60616054974c86CB04089574EC9628Fe51b03",
      wbtc: "0xD085812E6B7FC569809423Fb7c564f56547a85Ed",
      stabilityPool: "0x6C0148cB8a01B10756D135f50c014c729A2F666D"
    }
  },
  "0x5a2": {
    name: "Polygon zkevm testnet",
    rpcUrl: "https://rpc.public.zkevm-test.net",
    iconUrl: "https://icons.llamao.fi/icons/chains/rsz_polygon.jpg",
    currency: { name: "ETH", symbol: "ETH", decimals: 18 },
    subgraphEndpoint: "https://api.studio.thegraph.com/query/60908/neper-polygon/version/latest",
    contracts: {
      neperCore: "0x9666242Cc04Be9BFbc6165640Ce23208aEb4398a",
      neperUSD: "0xd449bb18c6020296ff0f790c4758bbbd5fec675b",
      wbtc: "",
      stabilityPool: "0x0d0f8a5f0c2f4d3a8d6c8e8b0a1b7d9f1c5f8d9e"
    }
  },
  "0x1389": {
    name: "Mantle testnet",
    rpcUrl: "https://rpc.testnet.mantle.xyz/",
    iconUrl: "https://icons.llamao.fi/icons/chains/rsz_mantle.jpg",
    currency: { name: "MNT", symbol: "MNT", decimals: 18 },
    contracts: {
      neperCore: "0x9666242Cc04Be9BFbc6165640Ce23208aEb4398a",
      neperUSD: "0xd449bb18c6020296ff0f790c4758bbbd5fec675b",
      wbtc: "",
      stabilityPool: "0x0d0f8a5f0c2f4d3a8d6c8e8b0a1b7d9f1c5f8d9e"
    }
  },
  "0x8274f": {
    name: "Scroll testnet",
    rpcUrl: "https://scroll-sepolia.blockpi.network/v1/rpc/public",
    iconUrl: "https://icons.llamao.fi/icons/chains/rsz_scroll",
    currency: { name: "ETH", symbol: "ETH", decimals: 18 },
    subgraphEndpoint: "https://api.studio.thegraph.com/query/60908/neper-scroll/version/latest",
    contracts: {
      neperCore: "0x7F0A3832BadC8568084fe5Ab600b81638F28F15f",
      neperUSD: "0x92b63d8d8fb8dd7a613e3c9f9651456dfeaeb546",
      wbtc: "",
      stabilityPool: "0x0d0f8a5f0c2f4d3a8d6c8e8b0a1b7d9f1c5f8d9e"
    }
  },
  "0x14a33": {
    name: "Base testnet",
    rpcUrl: "https://base-goerli.publicnode.com",
    iconUrl: "https://icons.llamao.fi/icons/chains/rsz_base.jpg",
    currency: { name: "ETH", symbol: "ETH", decimals: 18 },
    subgraphEndpoint: "https://api.studio.thegraph.com/query/60908/neper-base/version/latest",
    contracts: {
      neperCore: "0x9666242Cc04Be9BFbc6165640Ce23208aEb4398a",
      neperUSD: "0xd449bb18c6020296ff0f790c4758bbbd5fec675b",
      wbtc: "",
      stabilityPool: "0x0d0f8a5f0c2f4d3a8d6c8e8b0a1b7d9f1c5f8d9e"
    }
  },
  "0xAef3": {
    name: "Celo testnet",
    rpcUrl: "https://alfajores-forno.celo-testnet.org",
    iconUrl: "https://icons.llamao.fi/icons/chains/rsz_celo.jpg",
    currency: { name: "CELO", symbol: "CELO", decimals: 18 },
    subgraphEndpoint: "https://api.studio.thegraph.com/query/60908/neper-celo/version/latest",
    contracts: {
      neperCore: "0x9666242Cc04Be9BFbc6165640Ce23208aEb4398a",
      neperUSD: "0xd449bb18c6020296ff0f790c4758bbbd5fec675b",
      wbtc: "",
      stabilityPool: "0x0d0f8a5f0c2f4d3a8d6c8e8b0a1b7d9f1c5f8d9e"
    }
  },

  "0xc3": {
    name: "X1 testnet",
    rpcUrl: "https://testrpc.x1.tech",
    iconUrl:
      "https://play-lh.googleusercontent.com/TjM3iJJHQBi8yvElMbbP3AJieBK0jAjGKO5oQKUVg09qYPZiADjtjQEBAhMCIB09Ky0",
    currency: { name: "OKB", symbol: "OKB", decimals: 18 },
    contracts: {
      neperCore: "0x9666242Cc04Be9BFbc6165640Ce23208aEb4398a",
      neperUSD: "0xd449bb18c6020296ff0f790c4758bbbd5fec675b",
      wbtc: "",
      stabilityPool: "0x0d0f8a5f0c2f4d3a8d6c8e8b0a1b7d9f1c5f8d9e"
    }
  }
};

export const DEFAULT_NETWORK = "0xaa36a7";
