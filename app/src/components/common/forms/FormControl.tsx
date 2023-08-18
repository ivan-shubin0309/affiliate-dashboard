import { maybeConvertChild } from "@/components/common/wizard/useWizardFlow";
import { Label } from "@/components/ui/label";
import { clsx } from "clsx";
import React from "react";
import {
  useTsController,
  useMetaEx,
} from "@/components/libs/react-ts-form/FieldContext";

interface Props {
  showLabel?: boolean;
  children: React.ReactNode;
}

export const FormControl = ({ children, showLabel }: Props) => {
  const { field, error, formContext } = useTsController<string>();
  const meta = useMetaEx();
  const { label, className, optional } = meta || {
    label: "",
    placeholder: "",
  };

  return (
    <div className={clsx([{ "w-full": !className }, className])}>
      {showLabel !== false && (
        <Label htmlFor={field.name} className="mb-8">
          {maybeConvertChild(label)}
          {!optional && <span className="px-1 text-xl">*</span>}
        </Label>
      )}
      {children}
      <label className="label">
        {!error ? null : (
          <p className="mt-1.5 text-sm text-red-500">
            {formContext.t(error?.errorMessage)}
          </p>
        )}

        {/*<span className="label-text-alt">Bottom Left label</span>*/}
        {/*<span className="label-text-alt">Bottom Right label</span>*/}
      </label>
    </div>
  );
};
