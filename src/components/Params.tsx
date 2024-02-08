import BigNumber from "bignumber.js";
import { Params as ParamsType } from "../utils/types";

type ParamsProps = {
  mcr: string;
  baseRate: string;
  totalColl: string;
  totalDebt: string;
  vaultCount: string;
  pUSDInStabilityPool: string;
};

const Params = ({
  mcr,
  baseRate,
  totalColl,
  totalDebt,
  vaultCount,
  pUSDInStabilityPool
}: ParamsProps) => {
  return (
    <div className="text-[#797979] shadow-lg rounded-lg p-6 bg-[#131313] w-full md:w-[45%]">
      <h3 className="text-xl mb-2 font-semibold border-b pb-2 text-white">Neper statistics</h3>
      <div className="mb-6">
        <ul>
          <li className="flex justify-between py-1">
            <span>Current MCR</span>
            <span className="font-medium text-white">{mcr}%</span>
          </li>
          <li className="flex justify-between py-1">
            <span>Total Collateral Ratio</span>
            <span className="font-medium text-white">
              {((parseFloat(totalColl) * 41000 * 100) / parseFloat(totalDebt)).toFixed(2)}%
            </span>
          </li>
          <li className="flex justify-between py-1">
            <span>Total Collateral</span>
            <span className="font-medium text-white">{totalColl} WBTC</span>
          </li>
          <li className="flex justify-between py-1">
            <span>Total Debt</span>
            <span className="font-medium text-white">{totalDebt} pUSD</span>
          </li>
          <li className="flex justify-between py-1">
            <span>Borrowing Fee</span>
            <span className="font-medium text-white">
              {(parseFloat(baseRate) + 0.5).toFixed(3)} %
            </span>
          </li>
          <li className="flex justify-between py-1">
            <span>Vaults</span>
            <span className="font-medium text-white">{vaultCount}</span>
          </li>
          <li className="flex justify-between py-1">
            <span>pUSD in Stability Pool</span>
            <span className="font-medium text-white">
              {pUSDInStabilityPool} pUSD (
              {BigNumber(pUSDInStabilityPool)
                .dividedBy(BigNumber(totalDebt))
                .multipliedBy(100)
                .toFixed(2)}
              %)
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Params;
