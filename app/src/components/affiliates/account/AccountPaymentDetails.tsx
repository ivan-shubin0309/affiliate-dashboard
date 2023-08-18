import { usePrepareSchema } from "@/components/common/forms/usePrepareSchema";
import { PageHeader } from "@/components/common/page/page-header";
import { useTranslation } from "next-i18next";
import type { z } from "zod";
import { paymentSchema } from "../../../shared-types/forms/payment-details";
import { api } from "../../../utils/api";
import { Form } from "../../common/forms/Form";

export const AccountPaymentDetails = () => {
  const { t } = useTranslation("affiliate");
  const { data: account, refetch } = api.affiliates.getAccount.useQuery();
  const { data: countries } = api.misc.getCountries.useQuery();
  const updateAccount = api.affiliates.updateAccount.useMutation();
  const formContext = usePrepareSchema(t, paymentSchema);

  if (!account) {
    return null;
  }

  const handleSubmit = async (values: z.infer<typeof paymentSchema>) => {
    await updateAccount.mutateAsync(values);
    await refetch();
  };

  return (
    <div className="w-full">
      <PageHeader title="My Account" subTitle="Payment"></PageHeader>
      <div className="h-auto rounded-2xl bg-white px-4 pb-20 pt-4 shadow-[4px_3px_33px_0_rgba(0,0,0,0.05)] md:mb-10">
        <Form
          formContext={formContext}
          schema={paymentSchema}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={handleSubmit}
          defaultValues={account}
          formProps={{}}
        ></Form>
      </div>
    </div>
  );
};
