import { Loading } from "@/components/common/Loading";
import { DataTable } from "@/components/common/data-table/DataTable";
import { PageHeader } from "@/components/common/page/page-header";
import type { AffiliateCommissionType } from "@/server/db-types";
import { createColumnHelper } from "@tanstack/react-table";
import { api } from "../../../utils/api";

const columnHelper = createColumnHelper<AffiliateCommissionType>();
const createColumn = (id: keyof AffiliateCommissionType, header: string) =>
  columnHelper.accessor(id, {
    header,
  });

const findDealByType = (item: AffiliateCommissionType, dealType: string) => {
  const deal = item?.deals?.find((el) => el.dealType === dealType);
  return deal ? `${deal.amount}%` : "-";
};

export const Commissions = () => {
  const { data } = api.affiliates.getCommissions.useQuery();

  const columns = [
    createColumn("id", "#"),
    createColumn("name", "Merchant"),
    columnHelper.accessor((item) => findDealByType(item, "pnl"), { id: "PNL" }),
    columnHelper.accessor(() => "Passport", { id: "Deposit Charge" }),
    columnHelper.accessor((item) => findDealByType(item, "cpa"), { id: "CPA" }),
    columnHelper.accessor((item) => findDealByType(item, "dcpa"), {
      id: "DCPA",
    }),
  ];

  return data ? (
    <>
      <div className="w-full">
        <PageHeader title="My Account" subTitle="Commissions"></PageHeader>
        <DataTable data={data} columns={columns} />
      </div>
    </>
  ) : (
    <Loading />
  );
};
