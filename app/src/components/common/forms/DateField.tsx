import { maybeConvertChild } from "../wizard/useWizardFlow";
import { Checkbox } from "@/components/ui/checkbox";
import { clsx } from "clsx";
import { FormControl } from "@/components/common/forms/FormControl";
import DatePicker from "react-datepicker";
import {
  useMetaEx,
  useTsController,
} from "@/components/libs/react-ts-form/FieldContext";

export const DateField = () => {
  const { field } = useTsController<Date>();
  const { label, placeholder, control: controlName } = useMetaEx();

  let control;
  if (controlName === "Checkbox") {
    control = (
      <div className="flex items-center space-x-2">
        <Checkbox
          className={clsx(["checkbox", { error: "checkbox-error" }])}
          id={field.name}
          name={field.name}
          checked={!!field.value?.getTime()}
          onCheckedChange={(checked) => {
            field.onChange(checked ? new Date() : undefined);
          }}
        />
        <label
          htmlFor={field.name}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {maybeConvertChild(label)}
        </label>
      </div>
    );
  } else {
    control = (
      <DatePicker
        name={field.name}
        onChange={(date: Date | null) => field.onChange(date || undefined)}
        selected={field.value}
      />
    );
  }

  return (
    <FormControl
      showLabel={controlName !== "Checkbox" && controlName !== "Switch"}
    >
      {control}
    </FormControl>
  );
};
