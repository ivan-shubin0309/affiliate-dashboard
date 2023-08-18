import { usePrepareSchema } from "@/components/common/forms/usePrepareSchema";
import { useTranslation } from "next-i18next";
import type { z } from "zod";
import type { AffiliateAccountType } from "../../../server/db-types";
import { contactSchema } from "../../../shared-types/forms/contact";
import { Form } from "../../common/forms/Form";

interface Props {
  onSubmit: (values: z.infer<typeof contactSchema>) => Promise<void>;
  account: AffiliateAccountType;
}

export const FormContact = ({ account, onSubmit }: Props) => {
  const { t } = useTranslation("affiliate");
  const formContext = usePrepareSchema(t, contactSchema);

  return (
    <Form
      formContext={formContext}
      schema={contactSchema}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={onSubmit}
      defaultValues={account}
    ></Form>
  );
};
