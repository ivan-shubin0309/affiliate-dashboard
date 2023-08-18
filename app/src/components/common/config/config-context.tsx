import React from "react";
import { Loading } from "@/components/common/Loading";
import type { AppFlags } from "@/flags/config";
import { config } from "@/flags/config";

interface ConfigContextInterface {
  flags: AppFlags;
  config: Record<string, any>;
  permissions: {
    reports: Record<string, boolean>;
    fields: Record<string, boolean>;
  };
}

export const ConfigContext = React.createContext<ConfigContextInterface>({
  flags: config.defaultFlags!,
  config: {},
  permissions: {
    reports: {},
    fields: {},
  },
});

export const ConfigProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ConfigContextInterface;
}) => {
  return value ? (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  ) : (
    <Loading />
  );
};

export const useConfigContext = () => {
  const context = React.useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfigContext must be used within a ConfigProvider");
  }
  return context;
};
