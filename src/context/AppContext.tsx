import { JsonRpcProvider, JsonRpcSigner, ethers } from "ethers";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { CHAINS } from "../utils/constants";
import NeperCore from "../abi/NeperCore";
import BigNumber from "bignumber.js";
import ERC20 from "../abi/ERC20";
import { toast } from "react-hot-toast";
import { getEthersSigner } from "../utils/signer";
import {
  ApolloClient,
  DefaultOptions,
  InMemoryCache,
  gql,
} from "@apollo/client";
import { Params, Vault } from "../utils/types";
import StabilityPool from "../abi/StabilityPool";

type AppContextType = {
  stats: Params;
  increaseCollateral: (collAmount: string) => Promise<void>;
  decreaseCollateral: (collAmount: string) => Promise<void>;
  fetchVault: (owner: string) => Promise<void>;
  mintDebt: (debtAmount: string) => Promise<void>;
  depositStablityPool: (amount: string) => Promise<void>;
  withdrawStabilityPool: (amount: string) => Promise<void>;
  returnDebt: (debtAmount: string) => Promise<void>;
  vault: Vault;
};

// Create the context
const AppContext = createContext<AppContextType>({
  stats: {
    mcr: "",
    totalColl: "",
    totalDebt: "",
    vaultCount: "",
    borrowRate: "",
  },
  increaseCollateral: async (collAmount: string) => {},
  decreaseCollateral: async (collAmount: string) => {},
  mintDebt: async (debtAmount: string) => {},
  returnDebt: async (debtAmount: string) => {},
  depositStablityPool: async (amount: string) => {},
  withdrawStabilityPool: async (amount: string) => {},
  fetchVault: async (owner: string) => {},
  vault: {
    id: "",
    debt: "",
    coll: "",
    collRatio: "",
    liquidationAt: "",
    isVault: false,
  },
});

export const AppProvider = ({ children }: any) => {
  // State that you want to provide to other components
  const [stats, setStats] = useState<Params>({} as Params);
  const chainId = useChainId();
  const { address, isConnected } = useAccount();
  const defaultOptions: DefaultOptions = {
    watchQuery: {
      fetchPolicy: "no-cache",
      errorPolicy: "ignore",
    },
    query: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
  };
  const [vault, setVault] = useState<Vault>({} as Vault);

  useEffect(() => {
    fetchStats();
    if (!isConnected || !address) return;
    fetchVault(address);
  }, [address, isConnected]);

  const fetchVaultsFromSubgraph = async (account: string) => {
    try {
      const client = new ApolloClient({
        uri: CHAINS["0x" + chainId.toString(16)].subgraphEndpoint,
        cache: new InMemoryCache(),
        defaultOptions,
      });

      const query = gql`
      query {
        vaults(where: { id: "${account.toLowerCase()}" }) {
          id
          owner
          debt
          coll
          lastDebtRebaseIndex
          lastCollRebaseIndex
        }
      }`;
      return await client.query({ query });
    } catch (err: any) {
      throw err;
    }
  };

  const fetchStatsFromSubgraph = async () => {
    try {
      const client = new ApolloClient({
        uri: CHAINS["0x" + chainId.toString(16)].subgraphEndpoint,
        cache: new InMemoryCache(),
        defaultOptions,
      });

      const query = gql`
        query States {
          states(id: "001") {
            id
            mcr
            totalColl
            pUSDSupply
            vaultCount
            borrowRate
          }
        }
      `;
      return await client.query({ query });
    } catch (err: any) {
      throw err;
    }
  };

  const fetchStats = async () => {
    try {
      const stats = (await fetchStatsFromSubgraph()).data.states;

      setStats({
        borrowRate: parseFloat(stats.borrowRate).toFixed(2),
        mcr: parseFloat(stats.mcr).toFixed(2), //todo calculation
        totalColl: parseFloat(stats.totalColl).toFixed(4),
        totalDebt: parseFloat(stats.pUSDSupply).toFixed(2),
        vaultCount: stats.vaultCount,
      });
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const fetchVault = async (owner: string) => {
    try {
      const vaultsRes = (await fetchVaultsFromSubgraph(owner)).data.vaults;
      console.log(vaultsRes);
      if (vaultsRes.length === 0) {
        setVault({
          id: "",
          debt: "",
          coll: "",
          collRatio: "",
          liquidationAt: "",
          isVault: false,
        });
        return;
      }
      setVault({
        id: vaultsRes[0].id,
        debt: parseFloat(vaultsRes[0].debt).toFixed(4),
        coll: parseFloat(vaultsRes[0].coll).toFixed(4),
        collRatio: "", //todo calculate
        liquidationAt: "",
        isVault: true,
      });
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const increaseCollateral = async (collAmount: string) => {
    try {
      const signer = await getEthersSigner({ chainId });
      const neperCore = new ethers.Contract(
        CHAINS["0x" + chainId.toString(16)].contracts.neperCore,
        JSON.stringify(NeperCore),
        signer
      );

      let toastId = toast.loading("Approving...");
      const amount = BigNumber(collAmount).multipliedBy(1e8).toString();
      const wbtc = new ethers.Contract(
        CHAINS["0x" + chainId.toString(16)].contracts.wbtc,
        JSON.stringify(ERC20),
        signer
      );
      const tx1 = await wbtc.approve(
        CHAINS["0x" + chainId.toString(16)].contracts.neperCore,
        amount
      );
      await tx1.wait();
      toast.success("Approve Successful", { id: toastId });

      toastId = toast.loading("Increasing Collateral...");
      const tx2 = await neperCore.increaseVaultColl(amount);
      await tx2.wait();
      toast.success("Collateral Increased Successfully", { id: toastId });
    } catch (err: any) {
      toast.dismiss();
      console.error(err);
      throw err;
    }
  };

  const decreaseCollateral = async (collAmount: string) => {
    try {
      const signer = await getEthersSigner({ chainId });
      const neperCore = new ethers.Contract(
        CHAINS["0x" + chainId.toString(16)].contracts.neperCore,
        JSON.stringify(NeperCore),
        signer
      );

      const amount = BigNumber(collAmount).multipliedBy(1e8).toString();

      let toastId = toast.loading("Decreasing Collateral...");
      const tx = await neperCore.decreaseVaultColl(amount);
      await tx.wait(1);
      toast.success("Collateral decreased Successfully", { id: toastId });
    } catch (err: any) {
      toast.dismiss();
      console.error(err);
      throw err;
    }
  };

  const mintDebt = async (debtAmount: string) => {
    try {
      const signer = await getEthersSigner({ chainId });
      const neperCore = new ethers.Contract(
        CHAINS["0x" + chainId.toString(16)].contracts.neperCore,
        JSON.stringify(NeperCore),
        signer
      );

      const amount = BigNumber(debtAmount).multipliedBy(1e18).toString();

      let toastId = toast.loading("Minting Debt...");
      const tx = await neperCore.increaseVaultDebt(amount);
      await tx.wait(1);
      toast.success("Debt minted Successfully", { id: toastId });
    } catch (err: any) {
      toast.dismiss();
      console.error(err);
      throw err;
    }
  };

  const returnDebt = async (debtAmount: string) => {
    try {
      const signer = await getEthersSigner({ chainId });
      const neperCore = new ethers.Contract(
        CHAINS["0x" + chainId.toString(16)].contracts.neperCore,
        JSON.stringify(NeperCore),
        signer
      );

      const amount = BigNumber(debtAmount).multipliedBy(1e18).toString();

      let toastId = toast.loading("Returning Debt...");
      const tx = await neperCore.decreaseVaultDebt(amount);
      await tx.wait(1);
      toast.success("Debt returned Successfully", { id: toastId });
    } catch (err: any) {
      toast.dismiss();
      console.error(err);
      throw err;
    }
  };

  const depositStablityPool = async (amount: string) => {
    try {
      const signer = await getEthersSigner({ chainId });
      const stabilityPool = new ethers.Contract(
        CHAINS["0x" + chainId.toString(16)].contracts.stabilityPool,
        JSON.stringify(StabilityPool),
        signer
      );

      let toastId = toast.loading("Approving...");
      const amount1 = BigNumber(amount).multipliedBy(1e18).toString();
      const pUSD = new ethers.Contract(
        CHAINS["0x" + chainId.toString(16)].contracts.neperUSD,
        JSON.stringify(ERC20),
        signer
      );
      const tx1 = await pUSD.approve(
        CHAINS["0x" + chainId.toString(16)].contracts.stabilityPool,
        amount1
      );
      await tx1.wait();
      toast.success("Approve Successful", { id: toastId });

      toastId = toast.loading("Staking....");
      const tx2 = await stabilityPool.deposit(amount1);
      await tx2.wait();
      toast.success("Staked Successfully", { id: toastId });
    } catch (err: any) {
      toast.dismiss();
      console.error(err);
      throw err;
    }
  };

  const withdrawStabilityPool = async (amount: string) => {
    try {
      const signer = await getEthersSigner({ chainId });
      const stabilityPool = new ethers.Contract(
        CHAINS["0x" + chainId.toString(16)].contracts.stabilityPool,
        JSON.stringify(StabilityPool),
        signer
      );

      const amount1 = BigNumber(amount).multipliedBy(1e18).toString();

      let toastId = toast.loading("Withdrawing....");
      const tx = await stabilityPool.withdraw(amount1);
      await tx.wait(1);
      toast.success("Withdrawn Successfully", { id: toastId });
    } catch (err: any) {
      toast.dismiss();
      console.error(err);
      throw err;
    }
  };
  // The value that will be given to the context
  const contextValue = {
    stats,
    increaseCollateral,
    decreaseCollateral,
    mintDebt,
    returnDebt,
    fetchVault,
    depositStablityPool,
    withdrawStabilityPool,
    vault,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
