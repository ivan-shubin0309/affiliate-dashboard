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
import type { ChoiceType } from "@/utils/zod-meta";

const renderChoice = (choice: ChoiceType, idx: number) => {
  const { id, title } =
    typeof choice === "string" ? { id: choice, title: choice } : choice;
  return (
    <SelectItem key={idx} value={String(id)} id={String(id)}>
      {title}
    </SelectItem>
  );
};

export const SelectField = () => {
  const { field } = useTsController<string>();
  const { disabled, choices, placeholder } = useMetaEx();

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

      <SelectContent>{choices?.map(renderChoice)}</SelectContent>
    </Select>
  );
};
