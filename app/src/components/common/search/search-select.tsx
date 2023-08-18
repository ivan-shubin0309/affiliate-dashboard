import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useSearchContext } from "@/components/common/search/search-context";
import type { ChoiceType } from "@/utils/zod-meta";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  varName: string;
  label: string;
  emptyTitle?: string;
  choices?: ChoiceType[];
}

const renderChoice = (choice: ChoiceType, idx: number) => {
  const { id, title } =
    typeof choice === "string" ? { id: choice, title: choice } : choice;
  return (
    <SelectItem key={idx} value={String(id)} id={String(id)}>
      {title}
    </SelectItem>
  );
};

export const SearchSelect = ({
  varName,
  label,
  choices,
  emptyTitle,
}: Props) => {
  const { setControlValue, controlValue } = useSearchContext();
  const [value, setValue] = useState(controlValue[varName] || "");

  const placeholder = label;

  // console.log(`muly:SearchSelect`, { placeholder, label });

  return (
    <div className="w-full min-w-fit md:w-40">
      <label className="mb-1 block text-sm font-bold text-gray-700">
        {label}
      </label>
      <Select
        value={value}
        name={varName}
        onValueChange={(value) => {
          setValue(value);
          setControlValue(varName, value);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value={""}>{emptyTitle || "All"}</SelectItem>
          {choices?.map(renderChoice)}
        </SelectContent>
      </Select>
    </div>
  );
};
