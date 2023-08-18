import { useMetaEx, useTsController } from "@/components/libs/react-ts-form";
import { RadioButtonGroup } from "./RadioButtonGroup";
import type { ChoiceType, ZodMetaDataItem } from "../../../utils/zod-meta";
import { maybeConvertChild } from "@/components/common/wizard/useWizardFlow";
import { FormControl } from "./FormControl";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

import { InputPassword } from "@/components/common/forms/InputPassword";
import { SelectField } from "@/components/common/forms/SelectField";
import type { ControlCallback } from "../../../utils/zod-meta";

export interface Props {
  choices?: ChoiceType[];
  // type?: string;
  // controlName?: ZodMetaDataItem["control"];
}

export const TextField = (
  // props: Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "value"> & {
  //   // label?: string;
  //   enumValues?: string[];
  // }
  {}: /* merged to meta */ Props
) => {
  const { field, error, formContext } = useTsController<string>();
  const {
    type,
    choices,
    disabled,
    label,
    placeholder,
    control: controlName,
  } = useMetaEx();

  // let extraMeta = undefined;
  // if (preprocess) {
  //   // @ts-ignore
  //   extraMeta = preprocess({ formContext });
  // }

  // const options = parseOptionsString(placeholder);
  // if (options.choices && !choices) {
  //   choices = parseChoices(String(options.choices));
  // }

  let control;
  if (typeof controlName === "function") {
    if (!formContext.flowContext) {
      throw new Error(
        `TextField: controlName is a function but flowContext is not defined`
      );
    }
    const controlFn: ControlCallback = controlName;
    control = controlFn(formContext.flowContext);
  } else if (!choices) {
    if (controlName === "Textarea") {
      control = (
        <Textarea
          className={cn({ error: "border-red-500" })}
          name={field.name}
          placeholder={placeholder}
          value={field.value ? field.value + "" : ""}
          onChange={(e) => {
            field.onChange(e.target.value);
          }}
          disabled={disabled}
        />
      );
    } else if (controlName === "File") {
      control = (
        <input
          // className={clsx([{ "tbd-error-style": error }])}
          type="file"
          name={field.name}
          disabled={disabled}
          onChange={(e) => {
            let file;

            if (e.target.files) {
              file = e.target.files[0];
            }

            console.log(`muly:set file value`, { file, v: e.target.value });
            // @ts-ignore
            field.onChange(file);
          }}
        />
      );
    } else if (type === "password") {
      control = <InputPassword />;
    } else {
      // console.log(`muly:TextField`, { error });
      control = (
        <Input
          error={error}
          name={field.name}
          id={field.name}
          type={type || undefined}
          placeholder={placeholder}
          value={field.value ? field.value + "" : ""}
          disabled={disabled}
          onChange={(e) => {
            field.onChange(e.target.value);
          }}
        />
      );
    }
  } else if (controlName === "Checkbox") {
    const [valueFalse, valueTrue] =
      typeof choices[0] === "string" ? choices : [false, true];

    control = (
      <div className="flex items-center space-x-2">
        <Checkbox
          // className={clsx(["checkbox", { error: "checkbox-error" }])}
          id={field.name}
          name={field.name}
          checked={field.value == valueTrue}
          disabled={disabled}
          onCheckedChange={(checked) => {
            field.onChange(checked ? String(valueTrue) : String(valueFalse));
          }}
        />
        <label
          htmlFor={field.name}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {maybeConvertChild(label, formContext.flowContext)}
        </label>
      </div>
    );
  } else if (controlName === "Switch") {
    const [valueFalse, valueTrue] =
      typeof choices[0] === "string" ? choices : [false, true];

    control = (
      <div className="flex items-center space-x-2">
        <Switch
          id={field.name}
          name={field.name}
          checked={field.value == valueTrue}
          disabled={disabled}
          onCheckedChange={(checked) => {
            field.onChange(checked ? String(valueTrue) : String(valueFalse));
          }}
        />
        <label
          htmlFor={field.name}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {maybeConvertChild(label, formContext.flowContext)}
        </label>
      </div>
    );
    // } else if (controlName === "CheckboxGroup") {
    //   control = (
    //     <CheckboxGroup
    //       value={(field.value || "").split(",")}
    //       choices={choices}
    //       onChange={(value) => {
    //         console.log(`muly:onCjange`, { value });
    //         field.onChange(value.join(","));
    //       }}
    //     />
    //   );
  } else if (controlName === "RadioGroup") {
    control = (
      <RadioButtonGroup
        name={field.name}
        value={field.value ? field.value + "" : ""}
        choices={choices}
        onChange={(value) => {
          field.onChange(value);
        }}
      />
    );
  } else {
    // console.log(`muly:Select Field ${disabled}`, { props });
    control = <SelectField />;
  }

  // console.log(`muly:TextField`, { formContext });

  return (
    <FormControl
      showLabel={controlName !== "Checkbox" && controlName !== "Switch"}
    >
      {control}
    </FormControl>
  );
};
