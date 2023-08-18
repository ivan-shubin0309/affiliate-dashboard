import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useMetaEx,
  useTsController,
} from "@/components/libs/react-ts-form/FieldContext";
import { ChoiceType } from "@/utils/zod-meta";
import { languageDropDown } from "@/components/Dropdowns/languages-list";
import Flags from "country-flag-icons/react/3x2";

const renderChoice = (
  { title, icon }: { title: string; icon: string },
  idx: number
) => {
  const FlagComponent = Flags[icon.toUpperCase() as keyof typeof Flags];

  return (
    <SelectItem key={idx} value={icon} id={icon}>
      <div className="flex flex-row">
        <FlagComponent className="mr-2 h-5 w-5" />
        {title}
      </div>
    </SelectItem>
  );
};

export const LanguageSelectList = () => {
  const { field } = useTsController<string>();
  const { disabled, placeholder } = useMetaEx();

  return (
    <Select
      name={field.name}
      value={field.value ? field.value + "" : ""}
      disabled={disabled}
      onValueChange={(value) => {
        field.onChange(value);
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>{languageDropDown.map(renderChoice)}</SelectContent>
    </Select>
  );
};
