import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ChoiceType } from "@/utils/zod-meta";
import type { ReactElement } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;

  placeholder?: string;

  choices: ChoiceType[];
  icon?: ReactElement;
}

export const SelectInput = ({
  onChange,
  value,
  placeholder,
  choices,
  icon,
}: Props) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className="bg-white py-3 pr-2 text-sm font-light text-black"
        icon={icon}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="pr-2 text-xs font-light text-black">
        <SelectGroup>
          {choices.map((choice) => {
            const { id, title } =
              typeof choice === "string"
                ? { id: choice, title: choice }
                : choice;

            return (
              <SelectItem value={String(id)} key={id}>
                {title}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
