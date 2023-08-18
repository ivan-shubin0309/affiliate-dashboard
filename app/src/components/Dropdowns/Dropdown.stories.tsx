import React from "react";
import type { LanguageOption } from "./LanguageSelector";
import { LanguageSelector } from "./LanguageSelector";
import { languageDropDown } from "@/components/Dropdowns/languages-list";
import SelectUserDropdown from "@/components/Dropdowns/SelectUserDropdown";

const DropdownComponent = () => {
  const [selectLanguageItem, setSelectLanguageItem] =
    React.useState<string>("en");

  return (
    <div className="mt-4 flex">
      <LanguageSelector
        onLanguageChange={(val) => setSelectLanguageItem(val)}
        language={selectLanguageItem}
        options={languageDropDown}
      />
    </div>
  );
};

const meta = {
  component: DropdownComponent,
};

export default meta;

export const Language = {
  render: (args: any) => {
    return (
      <div className="mt-4 flex">
        <DropdownComponent />
      </div>
    );
  },
};

export const User = {
  render: (args: any) => {
    return (
      <div className="mt-4 flex">
        <SelectUserDropdown />
      </div>
    );
  },
};
