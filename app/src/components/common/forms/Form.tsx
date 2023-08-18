import { createTsForm } from "../../libs/react-ts-form";
import { mapping } from "./mapping";
import React from "react";
import { useSubmitAction } from "./useSubmitAction";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FormContext } from "@/components/libs/react-ts-form/FieldContext";

export interface CommonFormProps {
  onSubmit: (values: unknown) => Promise<void>;
  children: React.ReactNode;

  submit?: {
    className?: string;
    text?: string;
    notification?: boolean;
  };

  className?: string;

  formContext?: FormContext;
}

const CommonForm = ({
  onSubmit,
  children,
  submit,
  className,
  formContext,
}: CommonFormProps) => {
  const {
    text,
    notification,
    className: buttonClassName,
  } = submit || {
    text: "Save",
    notification: false,
  };
  const { handleSubmit, isLoading, formError } = useSubmitAction({
    onSubmit,
    notification,
  });

  console.log(`muly:Form:CommonForm`, { formContext });

  if (!formContext) {
    throw new Error("FormContext is not provided");
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col items-center">
        <div className={cn("mb-6 flex w-full flex-col gap-4", className)}>
          {children}
        </div>
        <Button
          variant="primary"
          className={buttonClassName}
          isLoading={isLoading}
          type="submit"
        >
          {text}
        </Button>
        {!formError ? null : (
          <label className="mt-4">
            <p className="text-sm text-red-500">{formContext.t(formError)}</p>
          </label>
        )}
      </div>
    </form>
  );
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const Form = createTsForm(mapping, {
  FormComponent: CommonForm,
});
