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
  const { isLoading } = useTypedSelector(state => state.contract);

  const { vault, stats,  } = useAppContext();

  return (
    <>
      <Navbar />
      <Loader />
      <div className="flex flex-col md:flex-row justify-between mt-8 px-8 md:px-28 gap-10">
        <div className="flex-1">
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
          baseRate={stats.baseRate}
          pUSDInStabilityPool={stats.pUSDInStabilityPool}
        />

        <Toaster />
      </div>
    </>
  );
}

export default HomePage;
