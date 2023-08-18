import type { ZodTypeAny } from "zod/lib/types";
import type { TranslationFn } from "../../utils/i18n-utils";
import { translateSchemaInfo } from "../../utils/i18n-utils";
import type { WizardPagesDefinition } from "../../components/common/wizard/useWizardFlow";
import { getPagesZodMetaInfo } from "../../components/common/wizard/useWizardFlow";
import { getZodMetaInfo } from "../../utils/zod-meta";
import { schemaWebSite } from "@/components/affiliates/account/FormWebSites";
import { schemaDocument } from "@/components/affiliates/documents/Documents";
import { schemaPixelMonitor } from "@/components/affiliates/pixel/PixelMonitor";
import { profileSchema } from "@/components/affiliates/profiles/Profiles";
import { ticketSchema } from "@/components/affiliates/tickets/Tickets";
import { registerSchema } from "@/shared-types/forms/register";
import { paymentSchema } from "@/shared-types/forms/payment-details";
import { lostPasswordSchema } from "@/shared-types/forms/lost-password";
import { loginSchema } from "@/shared-types/forms/login";
import { invoiceSchema } from "@/shared-types/forms/invoice";
import { contactSchema } from "@/shared-types/forms/contact";
import { accountSchema } from "@/shared-types/forms/account";

export const extractRuntimeTranslation = (nsMap: {
  [ns: string]: TranslationFn;
}) => {
  let count = 0;
  let context = "";

  const translate: TranslationFn = (key: string, def?: string) => {
    // console.log(`translate ${ns} ${key}=${def}`);
    const map = nsMap[ns];
    if (!map) {
      throw new Error(
        `Missing translator for namespace ${ns} key ${key} def:${def} context ${context}`
      );
    }

    count++;
    return map(key, def);
  };

  const translateSchema = (schema: ZodTypeAny) => {
    context = `translateSchema ns:${ns} name:${schema.metadata()?.name}`;
    translateSchemaInfo(getZodMetaInfo(schema), translate, "");
    context = "";
  };

  const translateWizard = (pagesDefinition: WizardPagesDefinition) => {
    context = `translateWizard ns:${ns} name:${pagesDefinition.name}}`;
    const stepsRaw = getPagesZodMetaInfo(pagesDefinition);
    const steps = translateSchemaInfo(
      stepsRaw,
      translate,
      pagesDefinition.name
    );
    context = "";
  };

  const ns = "affiliate";
  [
    accountSchema,
    contactSchema,
    invoiceSchema,
    loginSchema,
    lostPasswordSchema,
    paymentSchema,
    registerSchema,
    schemaWebSite,
    schemaDocument,
    schemaPixelMonitor,
    profileSchema,
    ticketSchema,
  ].forEach(translateSchema);

  return { message: `done count:${count}` };
};
