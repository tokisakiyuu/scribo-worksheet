"use client";
import { FC } from "react";

interface Props {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const Checkbox: FC<Props> = ({ checked, onChange }) => {
  return (
    <label className="rounded-[50%] size-[18px] border-[2px] border-solid border-white select-none inline-flex">
      <input
        type="checkbox"
        className="hidden peer"
        onChange={(e) => onChange?.(e.target.checked)}
        checked={checked}
      />
      <div className="bg-white rounded-[50%] size-[10px] m-auto peer-checked:visible invisible" />
    </label>
  );
};

export default Checkbox;
