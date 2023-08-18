import { maybeConvertChild } from "@/components/common/wizard/useWizardFlow";
import { FormControl } from "./FormControl";
import { clsx } from "clsx";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import type { Props } from "./TextField";
import {
  useTsController,
  useMetaEx,
} from "@/components/libs/react-ts-form/FieldContext";

export const CheckboxField = ({}: Props) => {
  const { field, error, formContext } = useTsController<boolean>();
  const meta = useMetaEx();
  const { label, className } = meta || {
    label: "",
  };

  const controlName = meta?.control;

  let control;
  if (controlName === "Switch") {
    control = (
      <div className="flex items-center space-x-2">
        <Switch
          className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
          id={field.name}
          name={field.name}
          checked={field.value}
          onCheckedChange={(checked) => {
            field.onChange(Boolean(checked));
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
      <div className="flex items-center space-x-2">
        <Checkbox
          className={clsx(["checkbox", { error: "checkbox-error" }])}
          id={field.name}
          name={field.name}
          checked={field.value == true}
          onCheckedChange={(checked) => {
            field.onChange(Boolean(checked));
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
  }

  return <FormControl showLabel={false}>{control}</FormControl>;
};
