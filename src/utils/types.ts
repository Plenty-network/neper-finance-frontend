export interface Vault {
  id: string;
  coll: string;
  debt: string;
  collRatio: string;
  liquidationAt: string;
  isVault?: boolean;
}

export interface Params {
  baseRate: string;
  mcr: string;
  totalColl: string;
  totalDebt: string;
  vaultCount: string;
  debtRebaseIndex: string;
  collRebaseIndex: string;
}
