import { usePrepareSchema } from "@/components/common/forms/usePrepareSchema";
import { useTranslation } from "next-i18next";
import { z } from "zod";
import type { AffiliateAccountType } from "../../../server/db-types";
import { Form } from "../../common/forms/Form";

export const schemaWebSite = z.object({
  website: z.string().url().optional().describe("WebSite 1"),
  website2: z.string().url().optional().describe("WebSite 2"),
  website3: z.string().url().optional().describe("WebSite 3"),
});

interface Props {
  onSubmit: (values: z.infer<typeof schemaWebSite>) => Promise<void>;
  account: AffiliateAccountType;
}

export const FormWebSites = ({ account, onSubmit }: Props) => {
  const { t } = useTranslation("affiliate");
  const formContext = usePrepareSchema(t, schemaWebSite);

  return (
    <Form
      formContext={formContext}
      schema={schemaWebSite}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={onSubmit}
      defaultValues={account}
    ></Form>
  );
};
