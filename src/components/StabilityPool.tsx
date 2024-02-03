import { useState } from "react";
import { toast } from "react-hot-toast";

import Button from "./Button";
import Modal from "./modals/Modal";

import { useActions } from "../hooks/useActions";

import { useAppContext } from "../context/AppContext";

const StabilityPool = ({}) => {
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  const [stakeModalOpen, setStakeModalOpen] = useState(false);
  const [withdrawCollateralModalOpen, setWithdrawCollateralModalOpen] = useState(false);

  const [stakeInput, setStakeInput] = useState("");
  const [withdrawInput, setWithdrawInput] = useState("");

  const [stakeError, setStakeError] = useState(false);
  const [withdrawError, setWithdrawError] = useState(false);

  const { setLoader } = useActions();

  const { depositStablityPool, withdrawStabilityPool, fetchAllData,
    stabilityPool
  } = useAppContext();

  const onStake = async () => {
    try {
      setLoader(true);
      await depositStablityPool(stakeInput);
      await new Promise(resolve => setTimeout(resolve, 5000));
      fetchAllData();
      /*       await new Promise((resolve) => setTimeout(resolve, 2000));
      fetchVault(address!); */
      setStakeModalOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to stake!");
    }
    setLoader(false);
  };

  const onWithdraw = async () => {
    try {
      setLoader(true);
      await withdrawStabilityPool(withdrawInput);
      await new Promise(resolve => setTimeout(resolve, 5000));
      fetchAllData();
      /*       await new Promise((resolve) => setTimeout(resolve, 2000));
      fetchVault(address!); */
      setWithdrawModalOpen(false);
      //toast.success("Succesfully withdrawn collateral!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to withdraw");
    }
    setLoader(false);
  };

  return (
    <div>
      {
        <div className="text-xl rounded-md bg-white">
          <div className="px-6 py-2 bg-gradient-to-r from-blue-400 to-blue-200">
            <h2 className="text-xl font-bold">Stability Pool</h2>
          </div>
          <div className="flex items-center justify-between gap-8 px-8 py-4">
            <div>
              <div className="font-medium mb-1">Unclaimed WBTC</div>
              <div>{stabilityPool.reward_amount} WBTC</div>
            </div>
            <div>
              <div className="font-medium mb-1">pUSD Staked</div>
              <div>{stabilityPool.stake_amount} pUSD</div>
            </div>
          </div>
          <div className="h-0.5"></div>
          <div className="flex gap-2 px-8 py-3">
            <Button onClick={() => setStakeModalOpen(true)}>
              <div className="text-sm px-3 py-2.5">Stake</div>
            </Button>
            <Button onClick={() => setWithdrawModalOpen(true)}>
              <div className="text-sm px-3 py-2.5">Withdraw</div>
            </Button>
          </div>
        </div>
      }
      <Modal
        show={stakeModalOpen}
        heading="Stake in Stability Pool"
        label="pUSD to Stake"
        placeholder="pUSD amount"
        error={stakeError}
        value={stakeInput}
        onClose={() => setStakeModalOpen(false)}
        onSubmit={onStake}
        onChange={v => setStakeInput(v)}
      />
      <Modal
        show={withdrawModalOpen}
        heading="Withdraw From Stability Pool"
        label="pUSD to withdraw"
        placeholder="pUSD amount"
        error={withdrawError}
        value={withdrawInput}
        onClose={() => setWithdrawCollateralModalOpen(false)}
        onSubmit={onWithdraw}
        onChange={v => setWithdrawInput(v)}
      />
    </div>
  );
};

export default StabilityPool;
