export interface Vault {
  id: string;
  coll: string;
  debt: string;
  collRatio: string;
  liquidationAt: string;
  isVault?: boolean;
}

export interface StabilityPool {
  // id: string;
  stake_amount: string;
  reward_amount: string;
}

export interface StabilityPoolStates {
  currentScale: BigInt;
  currentEpoch: BigInt;
  P: BigInt;
}

export interface Params {
  baseRate: string;
  mcr: string;
  totalColl: string;
  totalDebt: string;
  vaultCount: string;
  debtRebaseIndex: string;
  collRebaseIndex: string;
  pUSDInStabilityPool : string;
}
