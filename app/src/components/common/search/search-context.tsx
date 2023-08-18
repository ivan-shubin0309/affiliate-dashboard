import React, { useMemo, useRef, useState } from "react";
import { format, parse, startOfDay, sub } from "date-fns";

interface SearchContextInterface {
  values: Record<string, string>;
  controlValue: Record<string, string>;
  setControlValue: (key: string, value: string) => void;
  apply: () => void;
}

export const SearchContext = React.createContext<SearchContextInterface>({
  values: {},
  controlValue: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setControlValue: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  apply: () => {},
});

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [values, setValues] = useState<SearchContextInterface["values"]>({});
  const valueRef = useRef<SearchContextInterface["values"]>({});

  const setControlValue = (key: string, value: string) => {
    valueRef.current[key] = value;
  };

  const apply = () => {
    setValues({ ...valueRef.current });
  };

  console.log(`muly:SearchProvider`, { values, valuesRef: valueRef.current });
  return (
    <SearchContext.Provider
      value={{ values, controlValue: valueRef.current, setControlValue, apply }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = React.useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
};

export const getDateParam = (value?: string) =>
  parse(value || "", "yyyyMMdd", new Date());

export const getNumberParam = (value?: string) =>
  value ? Number(value) : undefined;
