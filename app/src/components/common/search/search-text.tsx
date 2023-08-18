import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useSearchContext } from "@/components/common/search/search-context";

interface Props {
  varName: string;
  label?: string | null;
}

export const SearchText = ({ varName, label }: Props) => {
  const { setControlValue, controlValue } = useSearchContext();
  const [value, setValue] = useState(controlValue[varName] || "");

  return (
    <Input
      className="w-full md:w-40"
      id={varName}
      type="search"
      placeholder={label === undefined || label === null ? "Search..." : label}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        setControlValue(varName, e.target.value);
      }}
    />
  );
};
