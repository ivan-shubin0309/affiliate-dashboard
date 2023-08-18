import type { AffiliateAccountType } from "../../../server/db-types";
import type { z } from "zod";
import { Form } from "../../common/forms/Form";
import { accountSchema } from "../../../shared-types/forms/account";
import { useTranslation } from "next-i18next";
import { usePrepareSchema } from "@/components/common/forms/usePrepareSchema";
import { useState } from "react";
import { Button } from "../../ui/button";

interface Props {
  onSubmit: (values: z.infer<typeof accountSchema>) => Promise<void>;
  account: AffiliateAccountType;
}

export const FormAccount = ({ account, onSubmit }: Props) => {
  const { t } = useTranslation("affiliate");
  const formContext = usePrepareSchema(t, accountSchema);

  return (
    <Form
      formContext={formContext}
      schema={accountSchema}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={onSubmit}
      defaultValues={account}
    ></Form>
  );
};
