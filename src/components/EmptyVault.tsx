import React from "react";

const EmptyVault = ({ openModal }: { openModal: Function }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-md bg-white">
      <div className="px-6 py-2 bg-gradient-to-r from-blue-400 to-blue-200">
        <h2 className="text-xl font-bold">Vault</h2>
      </div>
      <div className="flex items-center mb-4 px-6 pt-3">
        <p className="text-xl font-semibold text-gray-700">
          You haven't borrowed any pUSD yet.
        </p>
      </div>
      <p className="text-large text-gray-700 px-6 pb-6">
        You can borrow pUSD by opening a Vault.
      </p>
      <div className="flex flex-row-reverse">
        <button
          className="right-0 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mx-6 mb-3"
          onClick={() => {
            openModal(true);
            console.log("Open modal");
          }}
        >
          Open Vault
        </button>
      </div>
    </div>
  );
};

export default EmptyVault;
