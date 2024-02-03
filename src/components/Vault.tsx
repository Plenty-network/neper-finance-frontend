import { useState } from "react";
import { toast } from "react-hot-toast";

import Button from "./Button";
import Modal from "./modals/Modal";

import { Vault as VaultType } from "../utils/types";
import { useActions } from "../hooks/useActions";

import { useAccount } from "wagmi";
import EmptyVault from "./EmptyVault";
import { useAppContext } from "../context/AppContext";

type VaultProps = VaultType;

const Vault = ({ isVault = false, id, coll, debt, collRatio, liquidationAt }: VaultProps) => {
  const [createVaultModalOpen, setCreateVaultModalOpen] = useState(false);
  const [createVaultInput, setCreateVaultInput] = useState("");
  const [createVaultError, setCreateVaultError] = useState(false);
  const [addCollateralModalOpen, setAddCollateralModalOpen] = useState(false);
  const [withdrawCollateralModalOpen, setWithdrawCollateralModalOpen] = useState(false);
  const [mintDebtModalOpen, setMintDebtModalOpen] = useState(false);
  const [returnDebtModalOpen, setReturnDebtModalOpen] = useState(false);

  const [addCollateralInput, setAddCollateralInput] = useState("");
  const [withdrawCollateralInput, setWithdrawCollateralInput] = useState("");
  const [mintDebtInput, setMintDebtInput] = useState("");
  const [returnDebtInput, setReturnDebtInput] = useState("");

  const [addCollateralError, setAddCollateralError] = useState(false);
  const [withdrawCollateralError, setWithdrawCollateralError] = useState(false);
  const [mintDebtError, setMintDebtError] = useState(false);
  const [returnDebtError, setReturnDebtError] = useState(false);

  const { fetchData, setLoader, setDataLoading } = useActions();
  const { address } = useAccount();

  const { increaseCollateral, decreaseCollateral, fetchAllData, mintDebt, returnDebt } =
    useAppContext();

  const onAddCollateral = async () => {
    try {
      setLoader(true);
      await increaseCollateral(addCollateralInput);

      await new Promise(resolve => setTimeout(resolve, 3000));
      fetchAllData();
      setAddCollateralModalOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to add collateral");
    }
    setLoader(false);
  };

  const onWithdrawCollateral = async () => {
    try {
      setLoader(true);
      await decreaseCollateral(withdrawCollateralInput);
      //await withdrawCollateral(id, withdrawCollateralInput);
      //setDataLoading();
      await new Promise(resolve => setTimeout(resolve, 3000));
      fetchAllData();
      setWithdrawCollateralModalOpen(false);
      //toast.success("Succesfully withdrawn collateral!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to withdraw collateral");
    }
    setLoader(false);
  };

  const onMintDebt = async () => {
    try {
      setLoader(true);
      //await mintDebt(id, mintDebtInput);
      await mintDebt(mintDebtInput);
      await new Promise(resolve => setTimeout(resolve, 3000));
      fetchAllData();
      setMintDebtModalOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to mint debt");
    }
    setLoader(false);
  };

  const onReturnDebt = async () => {
    try {
      setLoader(true);
      await returnDebt(returnDebtInput);
      await new Promise(resolve => setTimeout(resolve, 3000));
      fetchAllData();
      setReturnDebtModalOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to return debt");
    }
    setLoader(false);
  };

  const onCreateVault = async () => {
    try {
      setLoader(true);
      await increaseCollateral(createVaultInput);
      //wait 1 second
      await new Promise(resolve => setTimeout(resolve, 3000));
      fetchAllData();
      setCreateVaultModalOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to create vault");
    }
    setLoader(false);
  };

  return (
    <div>
      {!isVault ? (
        <EmptyVault openModal={setCreateVaultModalOpen} />
      ) : (
        <div className="text-xl rounded-md bg-white">
          <div className="px-6 py-2 bg-gradient-to-r from-blue-400 to-blue-200">
            <h2 className="text-xl font-bold">Vault</h2>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-8 py-4">
            <div className="flex justify-between w-full flex-row md:flex-col">
              <div className="font-medium mb-1">Collateral Ratio</div>
              <div className="text-base md:text-lg">{collRatio} %</div>
            </div>
            <div className="flex justify-between w-full flex-row md:flex-col">
              <div className="font-medium mb-1">Collateral Value</div>
              <div className="text-base md:text-lg">{coll} WBTC</div>
            </div>
            <div className="flex justify-between w-full flex-row md:flex-col">
              <div className="font-medium mb-1">Debt</div>
              <div className="text-base md:text-lg">{debt} pUSD</div>
            </div>
            <div className="flex justify-between w-full flex-row md:flex-col">
              <div className="font-medium mb-1">Liquidation at</div>
              <div className="text-base md:text-lg">$ {liquidationAt}</div>
            </div>
          </div>
          <div className="h-0.5 "></div>
          <div className="flex flex-col md:flex-row gap-2 px-8 py-3">
            <Button onClick={() => setAddCollateralModalOpen(true)}>
              <div className="text-sm px-3 py-2.5">Add Collateral</div>
            </Button>
            <Button onClick={() => setWithdrawCollateralModalOpen(true)}>
              <div className="text-sm px-3 py-2.5">Withdraw Collateral</div>
            </Button>
            <Button onClick={() => setMintDebtModalOpen(true)}>
              <div className="text-sm px-3 py-2.5">Mint Debt</div>
            </Button>
            <Button onClick={() => setReturnDebtModalOpen(true)}>
              <div className="text-sm px-3 py-2.5">Return Debt</div>
            </Button>
          </div>
        </div>
      )}

      <Modal
        show={addCollateralModalOpen}
        heading="Add Collateral"
        label="Collateral to add"
        placeholder="WBTC amount"
        error={addCollateralError}
        value={addCollateralInput}
        onClose={() => setAddCollateralModalOpen(false)}
        onSubmit={onAddCollateral}
        onChange={v => setAddCollateralInput(v)}
      />
      <Modal
        show={withdrawCollateralModalOpen}
        heading="Withdraw Collateral"
        label="Collateral to withdraw"
        placeholder="WBTC amount"
        error={withdrawCollateralError}
        value={withdrawCollateralInput}
        onClose={() => setWithdrawCollateralModalOpen(false)}
        onSubmit={onWithdrawCollateral}
        onChange={v => setWithdrawCollateralInput(v)}
      />
      <Modal
        show={mintDebtModalOpen}
        heading="Mint Debt"
        label="Debt to mint"
        placeholder="pUSD amount"
        error={mintDebtError}
        value={mintDebtInput}
        onClose={() => setMintDebtModalOpen(false)}
        onSubmit={onMintDebt}
        onChange={v => setMintDebtInput(v)}
      />
      <Modal
        show={returnDebtModalOpen}
        heading="Return Debt"
        label="Debt to return"
        placeholder="pUSD amount"
        error={returnDebtError}
        value={returnDebtInput}
        onClose={() => setReturnDebtModalOpen(false)}
        onSubmit={onReturnDebt}
        onChange={v => setReturnDebtInput(v)}
      />
      <Modal
        show={createVaultModalOpen}
        heading="Create Vault"
        label="Initial collateral amount"
        placeholder="WBTC amount"
        error={createVaultError}
        value={createVaultInput}
        onClose={() => setCreateVaultModalOpen(false)}
        onSubmit={() => onCreateVault()}
        onChange={v => setCreateVaultInput(v)}
      />
    </div>
  );
};

export default Vault;
