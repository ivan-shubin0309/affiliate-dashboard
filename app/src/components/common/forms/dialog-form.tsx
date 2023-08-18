import type { DialogProps } from "@/components/common/dialog";
import { Dialog } from "@/components/common/dialog";
import { mapping } from "@/components/common/forms/mapping";
import { useSubmitAction } from "@/components/common/forms/useSubmitAction";
import { createTsForm } from "@/components/libs/react-ts-form";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { map } from "rambda";
import * as React from "react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import type { FormContext } from "@/components/libs/react-ts-form/FieldContext";

interface Props extends Omit<DialogProps, "isOpen" | "setIsOpen"> {
  onSubmit: (values: unknown) => Promise<void>;
  actionName: string;
  actions?: React.ReactNode;

  className?: string;

  formContext?: FormContext;
}

export const DialogFormControl = ({
  trigger,
  title,
  description,
  children,
  actions,
  actionName,
  className,
  onSubmit,
  formContext,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { reset, formState, getValues } = useFormContext();
  const { handleSubmit, isLoading, formError } = useSubmitAction({
    onSubmit: async (values: unknown) => {
      await onSubmit(values);
      console.log(`muly:onSubmit`, {
        reset,
        values,
        formState,
        getValues: getValues(),
      });
      reset(map(() => null, getValues()));
      setIsOpen(false);
    },
  });

  if (!formContext) {
    throw new Error("FormContext is not provided");
  }

  return (
    <Dialog
      trigger={trigger}
      title={title}
      description={description}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col items-center">
          <div className={cn("mb-6 flex w-full flex-col gap-4", className)}>
            {children}
          </div>
          <DialogFooter className="flex flex-row justify-between gap-2">
            {actions}
            <Button type="submit" variant="primary" isLoading={isLoading}>
              {actionName}
            </Button>
          </DialogFooter>
          {!formError ? null : (
            <label className="mt-4">
              <p className="text-sm text-red-500">{formContext.t(formError)}</p>
            </label>
          )}
        </div>
      </form>
    </Dialog>
  );
};

export const DialogForm = createTsForm(mapping, {
  FormComponent: DialogFormControl,
});
