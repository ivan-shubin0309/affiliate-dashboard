import { createColumnHelper } from "@tanstack/react-table";
import type { PaymentsPaidType } from "../../../server/db-types";
import { api } from "../../../utils/api";
import { DataTable } from "../../common/data-table/DataTable";

import { Loading } from "@/components/common/Loading";
import { PageHeader } from "@/components/common/page/page-header";
import { SearchApply } from "@/components/common/search/saerch-apply-button";
import { useSearchContext } from "@/components/common/search/search-context";
import { SearchText } from "@/components/common/search/search-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/format";
import { ViewIcon } from "lucide-react";
import { useRouter } from "next/router";

const columnHelper = createColumnHelper<PaymentsPaidType>();

const createColumn = (
  id: keyof PaymentsPaidType,
  header: string,
  isNumeric?: boolean
) =>
  columnHelper.accessor(id, {
    cell: (info) => info.getValue(),
    header,
    meta: { isNumeric },
  });

export const Billings = () => {
  const router = useRouter();
  const {
    values: { billing: search },
  } = useSearchContext();

  const { data, isLoading, isRefetching } =
    api.affiliates.getPaymentsPaid.useQuery(
      {
        search,
      },
      { keepPreviousData: true, refetchOnWindowFocus: false }
    );

  const columns = [
    createColumn("id", "#"),
    createColumn("paymentID", "Payment ID"),
    createColumn("month", "Month"),
    createColumn("totalFTD", "Total FTD", true),
    columnHelper.accessor("total", {
      cell: (info) => formatPrice(info.getValue()),
      header: "Amount",
      meta: { isNumeric: true, isCurrency: true },
    }),
    columnHelper.accessor("paid", {
      cell: (info) =>
        info.getValue() ? (
          <Badge variant="green">Paid</Badge>
        ) : (
          <Badge variant="red">Pending</Badge>
        ),
      header: "Status",
    }),
    columnHelper.accessor("edit-button" as any, {
      cell: (info) => (
        <Button
          variant="ghost"
          onClick={() =>
            window.open(
              `/affiliates/payment-view/${info?.row.original.paymentID}`,
              "_blank"
            )
          }
        >
          <ViewIcon className="mr-2 h-4 w-4" />
          View
        </Button>
      ),
      header: "",
    }),
  ];

  return data ? (
    <>
      <PageHeader title="Billing">
        <SearchText varName="billing" />
        <SearchApply isLoading={isRefetching} />
      </PageHeader>
      <DataTable data={data} columns={columns} />
    </>
  ) : (
    <Loading />
  );
};
