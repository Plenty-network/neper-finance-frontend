export default [
  {
    type: "constructor",
    inputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "decreaseVaultColl",
    inputs: [
      {
        name: "collAmount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "decreaseVaultDebt",
    inputs: [
      {
        name: "debtAmount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "increaseVaultColl",
    inputs: [
      {
        name: "collAmount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "increaseVaultDebt",
    inputs: [
      {
        name: "debtAmount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "initialise",
    inputs: [
      {
        name: "_pricefeed",
        type: "address",
        internalType: "contract IPriceFeed",
      },
      {
        name: "_stabilityPool",
        type: "address",
        internalType: "contract IStabilityPool",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "liquidate",
    inputs: [
      {
        name: "vaultOwner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "redeem",
    inputs: [
      {
        name: "debtToRedeem",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "vaults",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "debt",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "coll",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "lastDebtRebaseIndex",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "lastCollRebaseIndex",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "BorrowingFeeUpdated",
    inputs: [
      {
        name: "",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DecreaseVaultColl",
    inputs: [
      {
        name: "",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "coll",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "dri",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "cri",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DecreaseVaultDebt",
    inputs: [
      {
        name: "",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "debt",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "dri",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "cri",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "IncreaseVaultColl",
    inputs: [
      {
        name: "",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "coll",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "dri",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "cri",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "IncreaseVaultDebt",
    inputs: [
      {
        name: "",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "debt",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "dri",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "cri",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Liquidate",
    inputs: [
      {
        name: "",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "debt",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "coll",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MCRUpdated",
    inputs: [
      {
        name: "",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PUSDSupplyUpdated",
    inputs: [
      {
        name: "",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Redeem",
    inputs: [
      {
        name: "",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "debtRedeemed",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "collReceived",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TotalCollateralUpdated",
    inputs: [
      {
        name: "",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "AlreadyInitialised",
    inputs: [],
  },
  {
    type: "error",
    name: "NotEnoughNeperUSDInStabilityPool",
    inputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "VaultNotUnderCollateralised",
    inputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "VaultUnderCollateralised",
    inputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
];
