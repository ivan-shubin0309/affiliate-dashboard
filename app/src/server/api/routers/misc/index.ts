import { createTRPCRouter } from "../../trpc";
import { getCountries } from "./countries";
import { getLanguages } from "./languages";
import { missingLanguageTranslation } from "./missing-language-translation";
import { runAdminCommand, simulateServerError } from "./system";
import { sampleQuery } from "@/server/api/routers/misc/samples";
import { getConfig } from "@/server/api/routers/misc/config";

export const miscRouter = createTRPCRouter({
  getCountries,
  getLanguages,
  missingLanguageTranslation,
  runAdminCommand,
  simulateServerError,
  sampleQuery,
  getConfig,
});
