import React from "react";
import Button from "./Button";

const EmptyVault = ({ openModal }: { openModal: Function }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-md bg-[#131313] text-[#797979]">
      <div className="px-6 py-2 bg-gradient-to-r from-purple-800 to-purple-600">
        <h2 className="text-xl font-bold text-white">Vault</h2>
      </div>
      <div className="flex items-center mb-4 px-6 pt-3">
        <p className="text-xl font-semibold text-white">You haven't borrowed any pUSD yet.</p>
      </div>
      <p className="text-large text-[#797979] px-6 pb-6">You can borrow pUSD by opening a Vault.</p>
      <div className="flex flex-row-reverse">
        <div className="right-0 text-white mx-6 mb-3">
          <Button
            onClick={() => {
              openModal(true);
              console.log("Open modal");
            }}
          >
            <div className="text-sm px-3 py-2.5">Open Vault</div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyVault;
