//

import { usePagination } from "@/components/common/data-table/pagination-hook";
import { deserializeSorting } from "@/components/common/data-table/sorting";
import {
  getNumberParam,
  useSearchContext,
} from "@/components/common/search/search-context";
import { getDateRange } from "@/components/common/search/search-date-range";
import { SearchSelect } from "@/components/common/search/search-select";
import { SearchText } from "@/components/common/search/search-text";
import { type ExportType } from "@/server/api/routers/affiliates/reports/reports-utils";
import { createColumnHelper } from "@tanstack/react-table";
import { useRouter } from "next/router";
import type { CreativeReportType } from "../../../server/db-types";
import { api } from "../../../utils/api";
import { ReportControl } from "./report-control";
import { getColumns } from "./utils";

const columnHelper = createColumnHelper<CreativeReportType>();

const createColumn = (id: keyof CreativeReportType, header: string) =>
  columnHelper.accessor(id, {
    cell: (info) => info.getValue(),
    header,
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
  createColumn("BannerID", "Creative ID"),
  createColumn("title", "Creative Name"),
  columnHelper.accessor("merchant.name", {
    cell: (info) => info.getValue(),
    header: "Merchant",
  }),
  createColumn("type", "Type"),
  createColumn("Impressions", "Impressions"),
  createColumn("Clicks", "Clicks"),
  createColumn("totalCPI", "Installation"),
  columnHelper.accessor("ctr" as any, {
    cell: ({ row }) => divCol(row?.original?.Clicks, row.original.Impressions),
    header: "Click Through Ratio (CTR)",
  }),
  columnHelper.accessor("click-to-account" as any, {
    cell: ({ row }) => divCol(row?.original?.real, row.original.Clicks),
    header: "Click to Account",
  }),
  columnHelper.accessor("click-to-sale" as any, {
    cell: ({ row }) => divCol(row?.original?.ftd, row.original.Clicks),
    header: "Click to Sale",
  }),
  createColumn("leads", "Leads"),
  createColumn("demo", "Demo"),
  createColumn("real_ftd", "Accounts"),
  createColumn("ftd", "FTD"),
  createColumn("volume", "Volume"),
  createColumn("withdrawal", "Withdrawal Amount"),
  createColumn("chargeback", "ChargeBack Amount"),
];

export const CreativeReport = () => {
  const router = useRouter();
  const {
    values: {
      merchant_id,
      dates,
      banner_id,
      trader_id,
      unique_id,
      group_id,
      type,
    },
  } = useSearchContext();
  const pagination = usePagination();
  const { currentPage, itemsPerPage } = router.query;
  const { name, ...dateRange } = getDateRange(dates);
  const _sorting = deserializeSorting(pagination.pageParams.sortInfo);

  const { data, isRefetching, error } =
    api.affiliates.getCreativeReport.useQuery({
      ...dateRange,
      merchant_id: getNumberParam(merchant_id),
      trader_id: getNumberParam(trader_id),
      banner_id: getNumberParam(banner_id),
      unique_id: getNumberParam(unique_id),
      type: type === "all" ? undefined : type === "clicks" ? "clicks" : "views",
      group_id: getNumberParam(group_id),
      pageParams: pagination.pageParams,
      sortingParam: _sorting,
    });

  const { mutateAsync: reportExport } =
    api.affiliates.exportCreativeReport.useMutation();

  const handleExport = async (exportType: ExportType) =>
    reportExport({
      ...dateRange,
      merchant_id: getNumberParam(merchant_id),
      trader_id: getNumberParam(trader_id),
      unique_id: getNumberParam(unique_id),
      type: type === "all" ? undefined : type === "clicks" ? "clicks" : "views",
      group_id: getNumberParam(group_id),
      exportType,
      reportColumns: getColumns(columns),
    });

  const { data: merchants } = api.affiliates.getAllMerchants.useQuery();

  console.log("Install render", {
    data,
    merchants,
    merchant_id,
  });

  console.log("sorting info ----->", _sorting);

  const typeOptions = [
    {
      id: "image",
      title: "Image",
    },
    {
      id: "mobileleader",
      title: "Mobile Leader",
    },
    {
      id: "mobilesplash",
      title: "Mobile Splash",
    },
    {
      id: "flash",
      title: "Flash",
    },
    {
      id: "widget",
      title: "Widget",
    },
    {
      id: "link",
      title: "Text Link",
    },
    {
      id: "mail",
      title: "Email",
    },
    {
      id: "coupon",
      title: "Coupon",
    },
  ];

  return (
    <ReportControl
      reportName="Creative Report"
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
      <SearchText varName="unique_id" label="Unique ID" />
      <SearchText varName="banner_id" label="Banner ID" />
      <SearchText varName="trader_id" label="Trader ID" />
      <SearchSelect varName="type" label={"Type"} choices={typeOptions} />
    </ReportControl>
  );
};
