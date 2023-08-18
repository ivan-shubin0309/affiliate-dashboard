import { PageHeader } from "@/components/common/page/page-header";
import type { AffiliateAccountUpdateType } from "../../../server/db-types";
import { api } from "../../../utils/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { FormAccount } from "./FormAccount";
import { FormContact } from "./FormContact";
import { FormInvoice } from "./FormInvoice";
import { FormWebSites } from "./FormWebSites";

export const AccountDetails = () => {
  const { data: account, refetch } = api.affiliates.getAccount.useQuery();
  const { data: countries } = api.misc.getCountries.useQuery();
  const updateAccount = api.affiliates.updateAccount.useMutation();

  if (!account) {
    return null;
  }

  const handleSubmit = async (values: AffiliateAccountUpdateType) => {
    await updateAccount.mutateAsync(values);
    await refetch();
  };

  return (
    <div className="w-full">
      <PageHeader title="My Account" subTitle="Account"></PageHeader>
      <div className="h-auto rounded-2xl bg-white px-4 pb-20 pt-4 shadow-[4px_3px_33px_0_rgba(0,0,0,0.05)] md:mb-10">
        <div className="flex w-full">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="mt-2">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="contract">Contact</TabsTrigger>
              <TabsTrigger value="invoice">Invoice</TabsTrigger>
              <TabsTrigger value="website">Website</TabsTrigger>
            </TabsList>
            <TabsContent className="border-0" value="account">
              <div className="w-full max-w-xs">
                <FormAccount account={account} onSubmit={handleSubmit} />
              </div>
            </TabsContent>
            <TabsContent className="border-0" value="contract">
              <div className="w-full max-w-xs">
                <FormContact account={account} onSubmit={handleSubmit} />
              </div>
            </TabsContent>
            <TabsContent className="border-0" value="invoice">
              <div className="w-full max-w-xs">
                <FormInvoice
                  account={account}
                  onSubmit={handleSubmit}
                  countries={countries || []}
                />
              </div>
            </TabsContent>
            <TabsContent className="border-0" value="website">
              <div className="w-full max-w-xs">
                <FormWebSites account={account} onSubmit={handleSubmit} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        {/* <Flex direction="column" gap={2} maxW="4xl" width="100%">
          <Tabs>

            <TabPanels>
              <TabPanel>
                <FormAccount account={account} onSubmit={handleSubmit} />
              </TabPanel>
              <TabPanel>
                <FormContact account={account} onSubmit={handleSubmit} />
              </TabPanel>
              <TabPanel>
                <FormInvoice
                  account={account}
                  onSubmit={handleSubmit}
                  countries={countries || []}
                />
              </TabPanel>
              <TabPanel>
                <FormWebSites account={account} onSubmit={handleSubmit} />
              </TabPanel>
            </TabPanels>
          </Tabs>

        </Flex> */}
      </div>
    </div>
  );
};
