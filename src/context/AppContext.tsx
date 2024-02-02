import { JsonRpcProvider, JsonRpcSigner, ethers } from "ethers";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { CHAINS, Q64_MUL_100 } from "../utils/constants";
import NeperCore from "../abi/NeperCore";
import BigNumber from "bignumber.js";
import ERC20 from "../abi/ERC20";
import { toast } from "react-hot-toast";
import { getEthersSigner } from "../utils/signer";
import { ApolloClient, DefaultOptions, InMemoryCache, gql } from "@apollo/client";
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
    baseRate: "",
    debtRebaseIndex: "",
    collRebaseIndex: ""
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
    isVault: false
  }
});

export const AppProvider = ({ children }: any) => {
  // State that you want to provide to other components
  const [stats, setStats] = useState<Params>({} as Params);
  const priceFeed = 40000;
  const chainId = useChainId();
  const { address, isConnected } = useAccount();
  const defaultOptions: DefaultOptions = {
    watchQuery: {
      fetchPolicy: "no-cache",
      errorPolicy: "ignore"
    },
    query: {
      fetchPolicy: "network-only",
      errorPolicy: "all"
    }
  };
  const [vault, setVault] = useState<Vault>({} as Vault);

  useEffect(() => {
    const fetchAllData = async () => {
      const stats = await fetchStats();
      if (!isConnected || !address) return;
      await fetchVault2(address, stats);
    };
    fetchAllData();
  }, [address, isConnected]);

  const fetchVaultsFromSubgraph = async (account: string) => {
    try {
      const client = new ApolloClient({
        uri: CHAINS["0x" + chainId.toString(16)].subgraphEndpoint,
        cache: new InMemoryCache(),
        defaultOptions
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
        defaultOptions
      });

      const query = gql`
        query States {
          states(id: "001") {
            id
            mcr
            totalColl
            pUSDSupply
            vaultCount
            baseRate
            debtRebaseIndex
            collRebaseIndex
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
      const statsHere = (await fetchStatsFromSubgraph()).data.states;
      console.log(statsHere);
      setStats({
        baseRate: parseFloat(statsHere.baseRate).toFixed(2),
        mcr: parseFloat(statsHere.mcr).toFixed(2), //todo calculation
        totalColl: parseFloat(statsHere.totalColl).toFixed(4),
        totalDebt: new BigNumber(statsHere.pUSDSupply).dividedBy(1e18).toFixed(4),
        vaultCount: statsHere.vaultCount,
        debtRebaseIndex: statsHere.debtRebaseIndex,
        collRebaseIndex: statsHere.collRebaseIndex
      });

      return statsHere;
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const fetchVault = async (owner: string) => {
    try {
      const vaultsRes = (await fetchVaultsFromSubgraph(owner)).data.vaults;

      if (vaultsRes.length === 0) {
        setVault({
          id: "",
          debt: "",
          coll: "",
          collRatio: "",
          liquidationAt: "",
          isVault: false
        });
        return;
      }

      const debt = new BigNumber(vaultsRes[0].debt)
        .multipliedBy(new BigNumber(vaultsRes[0].lastDebtRebaseIndex))
        .dividedBy(new BigNumber(stats.debtRebaseIndex));

      const coll = new BigNumber(vaultsRes[0].coll)
        .multipliedBy(new BigNumber(vaultsRes[0].lastCollRebaseIndex))
        .dividedBy(new BigNumber(stats.collRebaseIndex));

      setVault({
        id: vaultsRes[0].id,
        debt: debt.toFixed(4),
        coll: coll.toFixed(4),
        collRatio: debt.isGreaterThan(0)
          ? new BigNumber(coll).multipliedBy(100).dividedBy(debt).toFixed(2)
          : "MAX",
        liquidationAt: new BigNumber(stats.mcr)
          .multipliedBy(debt)
          .dividedBy(coll.dividedBy(priceFeed).multipliedBy(Q64_MUL_100))
          .multipliedBy(1e18)
          .toString(),
        isVault: true
      });
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const fetchVault2 = async (owner: string, stats: Params) => {
    try {
      const vaultsRes = (await fetchVaultsFromSubgraph(owner)).data.vaults;

      if (vaultsRes.length === 0) {
        setVault({
          id: "",
          debt: "",
          coll: "",
          collRatio: "",
          liquidationAt: "",
          isVault: false
        });
        return;
      }

      const debt = new BigNumber(vaultsRes[0].debt)
        .multipliedBy(new BigNumber(vaultsRes[0].lastDebtRebaseIndex))
        .dividedBy(new BigNumber(stats.debtRebaseIndex));

      const coll = new BigNumber(vaultsRes[0].coll)
        .multipliedBy(new BigNumber(vaultsRes[0].lastCollRebaseIndex))
        .dividedBy(new BigNumber(stats.collRebaseIndex));

      setVault({
        id: vaultsRes[0].id,
        debt: debt.toFixed(4),
        coll: coll.toFixed(4),
        collRatio: debt.isGreaterThan(0)
          ? new BigNumber(coll).multipliedBy(100).dividedBy(debt).toFixed(2)
          : "MAX",
        liquidationAt: new BigNumber(stats.mcr)
          .multipliedBy(debt)
          .dividedBy(coll.dividedBy(priceFeed).multipliedBy(Q64_MUL_100))
          .multipliedBy(1e18)
          .toString(),
        isVault: true
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
    vault
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
