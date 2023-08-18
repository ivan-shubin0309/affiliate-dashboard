import * as z from "zod";
import type { PrismaClient } from "@prisma/client";
import { settingsModel } from "../../prisma/zod";
import { env } from "@/env.mjs";
import { isDev } from "@/utils/nextjs-utils";
import { serverStoragePath } from "@/server/utils";
import { imageProxy } from "@/components/utils";

export const settingFullModel = settingsModel.extend({
  dashboard_host: z.string(),
  legacy_host: z.string(),
});

type Settings = z.infer<typeof settingFullModel>;

let settings: Settings;

export const getConfig = async (prisma: PrismaClient): Promise<Settings> => {
  const dashboard_host = env.NEXTAUTH_URL;
  const legacy_host = env.LEGACY_PHP_URL;

  if (!settings) {
    const dev = isDev();
    const { logoPath, faviconPath, billingLogoPath, ...dbConfig } =
      await prisma.settings.findFirstOrThrow();

    settings = {
      ...dbConfig,
      dashboard_host,
      legacy_host,

      logoPath: dev
        ? "/img/logo.png"
        : imageProxy(serverStoragePath(logoPath) || ""),
      faviconPath: dev ? "/favicon.ico" : serverStoragePath(faviconPath) || "",
      billingLogoPath: dev
        ? "/img/logo.png"
        : serverStoragePath(billingLogoPath) || "",
    };
  }

  return settings;
};
