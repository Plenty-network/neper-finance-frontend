export default [
  {
    type: "receive",
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "currentEpoch",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint128",
        internalType: "uint128",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "currentScale",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint128",
        internalType: "uint128",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "deposit",
    inputs: [
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "depositSnapshots",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "S",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "P",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "scale",
        type: "uint128",
        internalType: "uint128",
      },
      {
        name: "epoch",
        type: "uint128",
        internalType: "uint128",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "deposits",
    inputs: [
      {
        name: "",
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
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "epochToScaleToSum",
    inputs: [
      {
        name: "",
        type: "uint128",
        internalType: "uint128",
      },
      {
        name: "",
        type: "uint128",
        internalType: "uint128",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "initialise",
    inputs: [
      {
        name: "_neperCore",
        type: "address",
        internalType: "address",
      },
      {
        name: "_neperUSD",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "_collateralToken",
        type: "address",
        internalType: "contract IERC20",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "neperUSDDeposit",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "offset",
    inputs: [
      {
        name: "debtToOffset",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "collToAdd",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "DepositSnapshotUpdated",
    inputs: [
      {
        name: "",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "S",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "P",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "scale",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "epoch",
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
    name: "UnauthorisedCaller",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
  },
];
