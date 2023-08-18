import { usePagination } from "@/components/common/data-table/pagination-hook";
import { deserializeSorting } from "@/components/common/data-table/sorting";
import { useSearchContext } from "@/components/common/search/search-context";
import { getDateRange } from "@/components/common/search/search-date-range";
import { SearchSelect } from "@/components/common/search/search-select";
import { SearchText } from "@/components/common/search/search-text";
import type { ExportType } from "@/server/api/routers/affiliates/reports/reports-utils";
import { createColumnHelper } from "@tanstack/react-table";
import { useRouter } from "next/router";
import type { ChangeEvent } from "react";
import { useState } from "react";
import type { CommissionReportType } from "../../../server/db-types";
import { api } from "../../../utils/api";
import { ReportControl } from "./report-control";
import { getColumns } from "./utils";

export const CommissionReport = () => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const pagination = usePagination();
  const {
    values: { commission, trader_id, merchant_id, dates },
  } = useSearchContext();
  const { name, ...dateRange } = getDateRange(dates);
  const [traderID, setTraderID] = useState<string>("");
  const [reportFields, setReportFields] = useState<
    { id: number; title: string; value: string; isChecked: boolean }[]
  >([]);
  const _sorting = deserializeSorting(pagination.pageParams.sortInfo);

  const { currentPage, itemsPerPage } = router.query;

  const { data, isRefetching, error } =
    api.affiliates.getCommissionReport.useQuery(
      {
        ...dateRange,
        commission: commission ? String(commission) : "",
        trader_id: traderID,
        pageParams: pagination.pageParams,
        sortingParam: _sorting,
      },
      { keepPreviousData: true, refetchOnWindowFocus: false }
    );
  const { mutateAsync: reportExport } =
    api.affiliates.exportCommissionReport.useMutation();
  const { data: merchants } = api.affiliates.getAllMerchants.useQuery();
  const columnHelper = createColumnHelper<CommissionReportType>();

  console.log("Commission render", {
    data,
    merchants,
    merchant_id,
  });

  const divCol = (
    val: number | null | undefined,
    div: number | null | undefined
  ) => {
    return val ? (
      <span>{((val / (div || 1)) * 100).toFixed(2)}%</span>
    ) : (
      <span></span>
    );
  };

  const columns = [
    columnHelper.accessor("merchant.name" as any, {
      cell: (info) => info.getValue() as string,
      header: "Merchant Name",
    }),
    columnHelper.accessor("merchant_id" as any, {
      cell: (info) => info.getValue() as number,
      header: "Merchant ID",
    }),
    columnHelper.accessor("traderID" as any, {
      cell: (info) => info.getValue() as number,
      header: "Trader ID",
    }),
    columnHelper.accessor("transactionID" as any, {
      cell: (info) => info.getValue() as number,
      header: "Transaction ID",
      // meta: {
      //   isNumeric: true,
      // },
    }),
    columnHelper.accessor("Type" as any, {
      cell: (info) => info.getValue() as string,
      header: "Type",
    }),
    columnHelper.accessor("Amount" as any, {
      cell: (info) => info.getValue() as number,
      header: "Amount",
    }),
    columnHelper.accessor("level" as any, {
      cell: (info) => info.getValue() as string,
      header: "Location",
    }),
    columnHelper.accessor("Commission" as any, {
      cell: (info) => info.getValue() as number,
      header: "Commission",
    }),
  ];

  const handleReportField = (event: ChangeEvent<HTMLInputElement>) => {
    const value = reportFields.map((item) => {
      const temp = Object.assign({}, item);
      if (temp.id === parseInt(event.target.value)) {
        temp.isChecked = event.target.checked;
      }
      return temp;
    });
    setReportFields(value);
    const hiddenCols = value.filter((item) => item.isChecked === false);
    const remove_fields = hiddenCols
      .map((item) => {
        return item.value;
      })
      .join("|");
    // await upsertReportsField.mutateAsync({
    //   remove_fields,
    // });
  };

  const handleSelectAll = () => {
    const value = reportFields.map((item) => {
      const temp = Object.assign({}, item);
      temp.isChecked = true;
      return temp;
    });
    setReportFields(value);
    const hiddenCols = value.filter((item) => item.isChecked === false);
    const remove_fields = hiddenCols
      .map((item) => {
        return item.value;
      })
      .join("|");
    // await upsertReportsField.mutateAsync({
    //   remove_fields,
    // });
  };

  const handleUnSelectAll = () => {
    const value = reportFields.map((item) => {
      const temp = Object.assign({}, item);
      temp.isChecked = false;
      return temp;
    });
    setReportFields(value);
    const hiddenCols = value.filter((item) => item.isChecked === false);
    const remove_fields = hiddenCols
      .map((item) => {
        return item.value;
      })
      .join("|");
    // await upsertReportsField.mutateAsync({
    //   remove_fields,
    // });
  };

  interface Commission {
    totalAmount: number;
    Commission: number;
  }

  let totalAmount = 0;
  let totalCommission = 0;
  const totalData = [];
  data ||
    [].forEach((item: any) => {
      totalAmount += item?.Amount || 0;
      totalCommission += item?.Commission || 0;
    });
  totalData.push({
    merchant_id: "",
    traderID: "",
    transactionID: "",
    type: "",
    totalAmount: totalAmount.toFixed(2),
    location: "",
    totalCommission: totalCommission.toFixed(2),
  });

  console.log("data", totalData);

  const commissionOption = [
    {
      id: "CPA",
      title: "CPA / TierCPA / DCPA",
    },
  ];

  // eslint-disable-next-line @typescript-eslint/require-await
  const handleExport = async (exportType: ExportType) =>
    reportExport({
      ...dateRange,
      commission: commission ? String(commission) : "",
      trader_id: traderID,
      reportColumns: getColumns(columns),
      exportType,
    });

  return (
    <ReportControl
      reportName="Commission Report"
      report={data}
      error={error}
      columns={columns}
      pagination={pagination}
      isRefetching={isRefetching}
      handleExport={async (exportType: ExportType) => handleExport(exportType)}
    >
      <SearchSelect
        label="Merchant"
        choices={merchants}
        varName="merchant_id"
      />
      <SearchText varName="trader_id" label="Trader ID" />

      <SearchSelect
        label="Search Type"
        choices={commissionOption}
        varName="commission"
      />
    </ReportControl>
  );
};
