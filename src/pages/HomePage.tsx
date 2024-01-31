import React from "react";
import Navbar from "../components/Navbar";
import Params from "../components/Params";
import Vault from "../components/Vault";

import Loader from "../components/Loader";
import Spinner from "../components/Spinner";

import { useTypedSelector } from "../hooks/useTypedSelector";

import { Toaster } from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import StabilityPool from "../components/StabilityPool";

function HomePage() {
  const { isLoading } = useTypedSelector((state) => state.contract);

  const { vault, stats } = useAppContext();

  return (
    <>
      <Navbar />
      <Loader />
      <div className="flex flex-row justify-between mt-8 px-28 gap-10">
        <div className="flex-1">
          {/*        <div className="flex justify-between mb-4">
            <div className="text-2xl font-medium">Your Vaults</div>
            <Button onClick={() => setCreateVaultModalOpen(true)}>
              <div className="flex items-center justify-center gap-x-3 px-3 py-2.5 text-sm">
                <i className="bi bi-plus-circle" />
                <span>Create Vault</span>
              </div>
            </Button>
          </div> */}
          {!isLoading ? (
            <div className="w-full text-center mt-20">
              <Spinner />
            </div>
          ) : (
            <div className="mb-4">
              <Vault
                id={vault.id}
                coll={vault.coll}
                debt={vault.debt}
                collRatio={vault.collRatio}
                liquidationAt={vault.liquidationAt}
                isVault={vault.isVault}
              />
            </div>
          )}
          <StabilityPool />
        </div>
        <Params
          mcr={stats.mcr}
          totalColl={stats.totalColl}
          totalDebt={stats.totalDebt}
          vaultCount={stats.vaultCount}
          borrowRate={stats.borrowRate}
        />

        <Toaster />
      </div>
    </>
  );
}

export default HomePage;
