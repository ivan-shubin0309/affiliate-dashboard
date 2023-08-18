import { Loading } from "./Loading";
import {
  DateRange,
  dateRangeChoices,
  DateRangeSelect,
} from "./DateRangeSelect";
import { Dialog } from "@/components/common/dialog";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogForm as DialogFormComponent } from "@/components/common/forms/dialog-form";
import { profileSchema } from "@/components/affiliates/profiles/Profiles";
import { usePrepareSchema } from "@/components/common/forms/usePrepareSchema";
import { EditIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useTranslation } from "next-i18next";
import { SelectInput as SelectInputComponent } from "@/components/common/select-input";

const meta = {
  component: Loading,
};

export default meta;

export const Component = {
  render: () => <Loading />,
  name: "Loading",
};

const SampleDialog = (props: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen);
  return (
    <Dialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      trigger={
        <Button>
          <EditIcon className="mr-2 h-4 w-4" />
          Trigger
        </Button>
      }
      title="Dialog Title"
      description="Dialog Description"
    >
      Body
    </Dialog>
  );
};

export const Test3 = {
  render: () => <SampleDialog />,
  name: "Dialog",
};

export const Test4 = {
  render: () => <SampleDialog isOpen />,
  name: "Open Dialog",
};

export const DialogForm = () => {
  const { t } = useTranslation("affiliate");

  const formContext = usePrepareSchema(t, profileSchema);
  return (
    <DialogFormComponent
      formContext={formContext}
      schema={profileSchema}
      onSubmit={(newRec) => {
        console.log(`muly:Submit`, { newRec });
      }}
      formProps={{
        trigger: (
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add
          </Button>
        ),
        title: "Title",
        actionName: "Add",
      }}
    />
  );
};

const SelectInputTest = () => {
  const [value, setValue] = useState<string>("a");

  return (
    <div>
      <SelectInputComponent
        choices={["a", "b", "c"]}
        value={value}
        onChange={setValue}
        placeholder="Select date range"
      />
      <div
        className="h-96 w-96 bg-red-500"
        onClick={() => {
          console.log(`muly:click`, {});
        }}
      ></div>

      <Button onClick={() => setValue("b")}>Set B</Button>
    </div>
  );
};

export const SelectInput = {
  render: () => <SelectInputTest />,
};
