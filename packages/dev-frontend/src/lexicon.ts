export type Lexicon = {
  term: string;
  description?: string;
  link?: string;
};

export const BORROW_FEE: Lexicon = {
  term: "Borrowing Fee",
  description:
    "The Borrowing Fee is a one-off fee charged as a percentage of the borrowed amount (in pUSD) and is part of a Vault's debt. The fee varies between 0.5% and 5% depending on pUSD redemption volumes."
};

export const TVL: Lexicon = {
  term: "TVL",
  description:
    "The Total Value Locked (TVL) is the total value of Ether locked as collateral in the system, given in WBTC and USD."
};

export const STAKED_LQTY: Lexicon = {
  term: "Staked LQTY",
  description: "The total amount of LQTY that is staked for earning fee revenue."
};

export const TCR: Lexicon = {
  term: "Total Collateral Ratio",
  description:
    "The ratio of the Dollar value of the entire system collateral at the current WBTC:USD price, to the entire system debt."
};

export const RECOVERY_MODE: Lexicon = {
  term: "Recovery Mode",
  description:
    "Recovery Mode is activated when the Total Collateral Ratio (TCR) falls below 150%. When active, your Vault can be liquidated if its collateral ratio is below the TCR. The maximum collateral you can lose from liquidation is capped at 110% of your Vault's debt. Operations are also restricted that would negatively impact the TCR."
};

export const STABILITY_POOL_LUSD: Lexicon = {
  term: "pUSD in Stability Pool",
  description:
    "The total pUSD currently held in the Stability Pool, expressed as an amount and a fraction of the pUSD supply."
};

export const KICKBACK_RATE: Lexicon = {
  term: "Kickback Rate",
  description:
    "A rate between 0 and 100% set by the Frontend Operator that determines the fraction of LQTY that will be paid out as a kickback to the Stability Providers using the frontend."
};

export const WBTC: Lexicon = {
  term: "WBTC"
};

export const pUSD: Lexicon = {
  term: "pUSD"
};

export const LQTY: Lexicon = {
  term: "LQTY"
};

export const TROVES: Lexicon = {
  term: "Vaults",
  description: "The total number of active Vaults in the system."
};

export const DAILY_MCR_CHANGE: Lexicon = {
  term: "Daily MCR Change",
  description: "Daily MCR Change"
};

export const LUSD_SUPPLY: Lexicon = {
  term: "pUSD supply",
  description: "The total pUSD minted by the Liquity Protocol."
};
