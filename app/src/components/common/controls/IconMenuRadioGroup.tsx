/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import React from "react";
import type { ChoiceType } from "../../../utils/zod-meta";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { GridToggleIcon, TableToggleIcon } from "@/components/icons";

type IconMenuRadioGroupProps = {
  gridView: boolean;
  onGridViewChange: (value: boolean) => void;
};

const toggleGroupItemClasses =
  "rounded-sm flex h-[35px] w-[35px] items-center justify-center text-[#888888] leading-4 first:rounded-l last:rounded-r focus:z-10 focus:shadow-[0_0_0_0px] focus:shadow-black";

const activeToggleGroupItemClasses = "bg-[#eaeaea] text-[#000000]";

export const IconMenuRadioGroup = ({
  gridView,
  onGridViewChange,
}: IconMenuRadioGroupProps) => {
  return (
    <ToggleGroup.Root
      className="bg-mauve6 inline-flex space-x-px rounded-sm bg-white p-1"
      type="single"
      value={gridView ? "left" : "right"}
      onValueChange={(newValue) => onGridViewChange(newValue === "left")}
      aria-label="Text alignment"
    >
      <ToggleGroup.Item
        className={`${
          gridView ? activeToggleGroupItemClasses : ""
        } ${toggleGroupItemClasses} `}
        value="left"
        aria-label="Left aligned"
      >
        <GridToggleIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className={`${
          !gridView ? activeToggleGroupItemClasses : ""
        } ${toggleGroupItemClasses} `}
        value="right"
        aria-label="Right aligned"
      >
        <TableToggleIcon />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
};
