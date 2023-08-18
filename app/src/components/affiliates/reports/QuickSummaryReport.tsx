import { createColumnHelper } from "@tanstack/react-table";
import { useRouter } from "next/router";
import { useState } from "react";
import { type QuickReportSummaryType } from "../../../server/db-types";
import { api } from "../../../utils/api";

import { usePagination } from "@/components/common/data-table/pagination-hook";
import { deserializeSorting } from "@/components/common/data-table/sorting";
import { useSearchContext } from "@/components/common/search/search-context";
import { getDateRange } from "@/components/common/search/search-date-range";
import { SearchSelect } from "@/components/common/search/search-select";
import { type ExportType } from "@/server/api/routers/affiliates/reports/reports-utils";
import { ReportControl } from "./report-control";
import { getColumns } from "./utils";

// const fields = [
//   "Impressions",
//   "Clicks",
//   "Install",
//   "Leads",
//   "Demo",
//   "Real Account",
//   "FTD",
//   "Withdrawal",
//   "ChargeBack",
//   "Active Trader",
//   "Commission",
// ];

export interface ItemProps {
  id?: ExportType;
  title?: string;
}

export const QuickSummaryReport = () => {
  const pagination = usePagination();
  const {
    values: { display, dates },
  } = useSearchContext();
  const [reportFields, setReportFields] = useState<
    { id: number; title: string; value: string; isChecked: boolean }[]
  >([]);
  const { name, ...dateRange } = getDateRange(dates);
  const _sorting = deserializeSorting(pagination.pageParams.sortInfo);

  const { data, isRefetching, error } =
    api.affiliates.getQuickReportSummary.useQuery(
      {
        ...dateRange,
        display: display ? String(display) : undefined,
        pageParams: pagination.pageParams,
        sortingParam: _sorting,
      },
      { keepPreviousData: true, refetchOnWindowFocus: false }
    );

  const { mutateAsync: reportExport } =
    api.affiliates.exportQuickSummaryReport.useMutation();

  const { data: merchants } = api.affiliates.getAllMerchants.useQuery();
  const columnHelper = createColumnHelper<QuickReportSummaryType>();

  const createColumn = (id: keyof QuickReportSummaryType, header: string) =>
    columnHelper.accessor(id, {
      cell: (info) => info.getValue(),
      header,
    });

  const columns = [
    createColumn("merchant_id", "Merchant"),
    createColumn("Impressions", "Impressions"),
    createColumn("Clicks", "Clicks"),
    createColumn("Install", "Installation"),
    createColumn("Leads", "Leads"),
    createColumn("Demo", "Demo"),
    createColumn("RealAccount", "Accounts"),
    createColumn("FTD", "FTD"),
    createColumn("Withdrawal", "Withdrawal Amount"),
    createColumn("ChargeBack", "ChargeBack Amount"),
    createColumn("ActiveTrader", "Active Traders"),
    columnHelper.accessor("Commission", {
      cell: ({ row }) => {
        // console.log("row ---->", row);
        return <span>{row?.original?.Commission?.toFixed(2)}</span>;
      },
      header: "Commission",
    }),
    columnHelper.accessor("click-through-ratio" as any, {
      cell: ({ row }) =>
        divCol(row?.original?.Clicks, row.original.Impressions),
      header: "Click Through Ratio(CTR)",
    }),
    columnHelper.accessor("click-to-account" as any, {
      cell: ({ row }) =>
        divCol(row?.original?.RealAccount, row.original.Clicks),
      header: "Click to Account",
    }),
    columnHelper.accessor("click-to-sale" as any, {
      cell: ({ row }) => divCol(row?.original?.FTD, row.original.Clicks),
      header: "Click to Sale",
    }),
    createColumn("Volume", "Volume"),
  ];

  const handleExport = async (exportType: ExportType) =>
    reportExport({
      ...dateRange,
      display: display ? String(display) : undefined,
      exportType,
      reportColumns: getColumns(columns),
    });

  console.log("QuickSummaryReport render", {
    data,
    merchants,
    isRefetching,
  });

  const divCol = (
    val: number | null | undefined,
    div: number | null | undefined
  ) => {
    return val && div ? (
      <span>{((val / div) * 100).toFixed(2)}%</span>
    ) : (
      <span>N/A</span>
    );
  };

  const displayOptions = [
    {
      id: "monthly",
      title: "monthly",
    },
    {
      id: "weekly",
      title: "weekly",
    },
    {
      id: "daily",
      title: "daily",
    },
  ];

  return (
    <ReportControl
      reportName="Quick Summary Report"
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

      <SearchSelect
        label="Search Type"
        choices={displayOptions}
        varName="display"
      />
    </ReportControl>
  );
};
