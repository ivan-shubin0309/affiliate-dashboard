import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import React, { useRef, useState } from "react";

interface Props {
  inputValues: string[];
  setInputValues: (values: string[]) => void;
}

export function AddDynamicParameter({ inputValues, setInputValues }: Props) {
  const [dynamicParameterDisabled, setDynamicParameterDisabled] =
    useState<boolean>(false);

  const inputValuesCount = inputValues.length;

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    inputRefs.current[inputValuesCount - 1]?.focus();
  }, [inputValuesCount]);

  const addInput = () => {
    // Check if there is any empty field
    const emptyIndex = inputValues.findIndex((value) => value === "");

    // If there is an empty field, focus on it and return
    if (emptyIndex !== -1) {
      inputRefs.current[emptyIndex]?.focus();
      return;
    }

    // Add a new input field if there are no empty fields
    const newInputValues = [...inputValues, ""];
    setInputValues(newInputValues);

    // Disable adding more fields if the maximum limit is reached
    if (newInputValues.length === 9) {
      setDynamicParameterDisabled(true);
    }
  };

  const removeInput = (index: number) => {
    const newInputValues = inputValues.filter((_, i) => i !== index);
    setInputValues(newInputValues);
    if (dynamicParameterDisabled && newInputValues.length < 9) {
      setDynamicParameterDisabled(false);
    }
  };

  const editInput = (index: number, value: string) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
  };

  const inputFieldElements = inputValues.map((value, index) => (
    <div key={`input_${index}`} className="mb-2 flex w-full">
      <Input
        ref={(el) => (inputRefs.current[index] = el)}
        className="w-full"
        id={`input_${index}`}
        type="text"
        placeholder="Add parameter"
        value={value}
        onChange={(e) => editInput(index, e.target.value)}
      />
      {index >= 1 && (
        <Button
          variant="outline"
          className="ml-2 h-10 w-10"
          size="rec"
          onClick={() => removeInput(index)}
        >
          <Minus className="h-4 w-4" />
        </Button>
      )}
      {index === 0 && (
        <Button
          disabled={dynamicParameterDisabled}
          variant="outline"
          className="ml-2 h-10 w-10"
          size="rec"
          onClick={addInput}
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}
    </div>
  ));

  return <>{inputFieldElements}</>;
}
