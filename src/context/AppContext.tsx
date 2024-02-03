import { JsonRpcProvider, JsonRpcSigner, ethers, parseEther } from "ethers";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { CHAINS, Q64_MUL_100 } from "../utils/constants";
import NeperCore from "../abi/NeperCore";
import BigNumber from "bignumber.js";
import ERC20 from "../abi/ERC20";
import { toast } from "react-hot-toast";
import { getEthersSigner } from "../utils/signer";
import { ApolloClient, DefaultOptions, InMemoryCache, gql } from "@apollo/client";
import { Params, StabilityPool, Vault } from "../utils/types";
import StabilityPoolAbi from "../abi/StabilityPool";

type AppContextType = {
  stats: Params;
  increaseCollateral: (collAmount: string) => Promise<void>;
  decreaseCollateral: (collAmount: string) => Promise<void>;
  fetchAllData: () => Promise<void>;
  mintDebt: (debtAmount: string) => Promise<void>;
  depositStablityPool: (amount: string) => Promise<void>;
  withdrawStabilityPool: (amount: string) => Promise<void>;
  returnDebt: (debtAmount: string) => Promise<void>;
  // s_ppol
  vault: Vault;
  stabilityPool: StabilityPool;
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
  fetchAllData: async () => {},
  vault: {
    id: "",
    debt: "",
    coll: "",
    collRatio: "",
    liquidationAt: "",
    isVault: false
  },
  stabilityPool: {
    reward_amount: "",
    stake_amount: ""
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
  const [stabilityPool, setStabilityPool] = useState<StabilityPool>({} as any);

  const fetchAllData = async () => {
    const stats = await fetchStats();
    const stabilityPoolState = await fetchStabilityPoolStats();
    if (!isConnected || !address) return;
    await fetchVault(address, stats);
    await fetchStabilityPool(address, stabilityPoolState);
  };

  useEffect(() => {
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

  const fetchStabilityPoolFromSubgraph = async (account: string) => {
    try {
      const client = new ApolloClient({
        uri: CHAINS["0x" + chainId.toString(16)].subgraphEndpoint,
        cache: new InMemoryCache(),
        defaultOptions
      });

      const query = gql`
      query DepositorStates {
          depositorStates(id: "${account.toLowerCase()}"){
            id
            currentDeposit
            S
            P
            scale
            epoch
          }
        }`;

      return await client.query({ query });
    } catch (err: any) {
      console.error(err);
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

  const fetchStabilityPoolStatsFromSubgraph = async () => {
    try {
      const client = new ApolloClient({
        uri: CHAINS["0x" + chainId.toString(16)].subgraphEndpoint,
        cache: new InMemoryCache(),
        defaultOptions
      });

      const query = gql`
        query StabilityPoolStates {
          stabiltyPoolStates(id: "002") {
            id
            currentScale
            currentEpoch
            P
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
        mcr: parseFloat(statsHere.mcr).toFixed(2),
        totalColl: parseFloat(statsHere.totalColl).toFixed(4),
        totalDebt: new BigNumber(statsHere.pUSDSupply).dividedBy(1e18).toFixed(2),
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

  const fetchStabilityPoolStats = async () => {
    try {
      const statsHere = (await fetchStabilityPoolStatsFromSubgraph()).data.stabiltyPoolStates;

      if (statsHere === null || statsHere.length === 0) {
        return {
          currentScale: BigNumber(0),
          currentEpoch: BigNumber(0),
          P: BigNumber(1)
        };
      }

      return {
        currentScale: BigNumber(statsHere[0].currentScale),
        currentEpoch: BigNumber(statsHere[0].currentEpoch),
        P: BigNumber(statsHere[0].P)
      };
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const fetchVault = async (owner: string, stats: Params) => {
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
        debt: debt.toFixed(2),
        coll: coll.toFixed(4),
        collRatio: debt.isGreaterThan(0)
          ? new BigNumber(coll).multipliedBy(priceFeed).multipliedBy(100).dividedBy(debt).toFixed(2)
          : "MAX",
        liquidationAt: new BigNumber(stats.mcr)
          .multipliedBy(debt)
          .dividedBy(coll.multipliedBy(100))
          .toFixed(2),
        isVault: true
      });
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const fetchStabilityPool = async (owner: string, stats: any) => {
    try {
      const stabilityPoolRes = (await fetchStabilityPoolFromSubgraph(owner)).data.depositorStates;

      if (stabilityPoolRes.length === 0) {
        setStabilityPool({
          reward_amount: "",
          stake_amount: ""
        });
        return;
      }

      console.log("Stability Pool Res");
      console.log(stabilityPoolRes);

      // TODO: compute reward amount per stake unit
      const reward_amount = "0.0";

      const stake_amount = calculateCompoundedStakeFromSnapshots(stabilityPoolRes, stats);
      // calculateCompoundedStakeFromSnapshots(new BigNumber(stabilityPoolRes.currentDeposit).multipliedBy(1e18), stats)
      // new BigNumber(stabilityPoolRes.currentDeposit).toFixed(2);

      setStabilityPool({
        reward_amount,
        stake_amount
      });
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  };

  /// userSnapshot: the user's snapshot {currentDeposit, S, P, scale, epoch}
  /// snapshot: the current snapshot {currentScale, currentEpoch, P}
  function calculateCompoundedStakeFromSnapshots(userSnapshot: any, snapshot: any): string {
    const SP_SCALING_FACTOR = Math.pow(2, 32);

    const currentEpoch: BigNumber = snapshot.currentEpoch;
    const currentScale: BigNumber = snapshot.currentScale;
    const P: BigNumber = snapshot.P;

    let snapshot_P: BigNumber = BigNumber(userSnapshot.P);
    const scaleSnapshot: BigNumber = BigNumber(userSnapshot.scale);
    const epochSnapshot: BigNumber = BigNumber(userSnapshot.epoch);

    const initialStake = BigNumber(userSnapshot.currentDeposit).multipliedBy(1e18);

    // If stake was made before a pool-emptying event, then it has been fully cancelled with debt -- so, return 0
    if (epochSnapshot < currentEpoch) return "0.0";

    let compoundedStake: BigNumber;
    const scaleDiff: number = currentScale.minus(scaleSnapshot).toNumber();

    console.log("Scale Diff");
    console.log(scaleDiff);

    if (snapshot_P.isEqualTo(0)) snapshot_P = BigNumber(1);

    /* Compute the compounded stake. If a scale change in P was made during the stake's lifetime,
     * account for it. If more than one scale change was made, then the stake has decreased by a factor of
     * at least 2^32 (i.e., FixedPoint.Q32) -- so return 0.
     */
    if (scaleDiff === 0) {
      compoundedStake = initialStake.multipliedBy(P).dividedBy(snapshot_P);
    } else if (scaleDiff === 1) {
      compoundedStake = initialStake
        .multipliedBy(P)
        .dividedBy(snapshot_P)
        .dividedBy(SP_SCALING_FACTOR);
    } else {
      // if scaleDiff >= 2
      compoundedStake = BigNumber(0);
    }

    /*
     * If compounded deposit is less than a billionth of the initial deposit, return 0.
     *
     * NOTE: originally, this line was in place to stop rounding errors making the deposit too large. However, the error
     * corrections should ensure the error in P "favors the Pool", i.e., any given compounded deposit should slightly less
     * than its theoretical value.
     *
     * Thus it's unclear whether this line is still really needed.
     */
    if (compoundedStake < initialStake.dividedBy(SP_SCALING_FACTOR)) return "0.0";

    return compoundedStake.dividedBy(1e18).toString();
  }

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

      const amount = ethers.parseEther(debtAmount);

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

      const amount = ethers.parseEther(debtAmount);

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
        JSON.stringify(StabilityPoolAbi),
        signer
      );

      let toastId = toast.loading("Approving...");
      const amount1 = ethers.parseEther(amount);
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
        JSON.stringify(StabilityPoolAbi),
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
    fetchAllData,
    depositStablityPool,
    withdrawStabilityPool,
    vault,
    stabilityPool
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
