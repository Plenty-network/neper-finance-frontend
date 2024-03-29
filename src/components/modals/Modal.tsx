import React from "react";

import Button from "../Button";

interface ModalProps {
  show: boolean;
  heading: string;
  label: string;
  subLabel?: string;
  value: string;
  error: boolean;
  placeholder: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const Modal = ({
  show,
  heading,
  label,
  value,
  error,
  subLabel,
  placeholder,
  onChange,
  onClose,
  onSubmit
}: ModalProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center text-white z-400">
      <div className="p-4 bg-[#131313] rounded-md w-3/4 md:w-1/3 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-white">{heading}</h2>
          <i onClick={onClose} className="hover:cursor-pointer bi bi-x text-2xl" />
        </div>
        <div className="mb-4">
          <label htmlFor="input1" className="block text-[#797979] text-sm font-bold mb-2">
            {label}
          </label>
          <input
            type="number"
            id="input1"
            placeholder={placeholder}
            onChange={e => onChange(e.target.value)}
            value={value}
            className="appearance-none border border-[#797979] text-white rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none bg-[#222222]"
          />
          {subLabel && <span className="text-xs">{subLabel}</span>}
          {error && <div className="text-base mt-3 text-red-600">Invalid amount</div>}
        </div>
        <Button onClick={onSubmit}>
          <div className="px-3 py-2.5 text-sm">{heading}</div>
        </Button>
      </div>
    </div>
  );
};

export default Modal;
