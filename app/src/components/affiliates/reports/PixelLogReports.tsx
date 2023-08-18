import { usePagination } from "@/components/common/data-table/pagination-hook";
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
import type { PixelLogsReportType } from "../../../server/db-types";
import { api } from "../../../utils/api";
import { ReportControl } from "./report-control";
import { getColumns } from "./utils";

export const PixelLogReports = () => {
  const router = useRouter();
  const pagination = usePagination();
  const {
    values: { merchant_id, dates, group_id, country },
  } = useSearchContext();
  const { name, ...dateRange } = getDateRange(dates);

  const { data, isRefetching, error } =
    api.affiliates.getPixelLogReport.useQuery(
      {
        ...dateRange,
        merchant_id: getNumberParam(merchant_id),
        country: country ? String(country) : "",
        group_id: group_id ? String(group_id) : "",
        pageParams: pagination.pageParams,
      },
      { keepPreviousData: true, refetchOnWindowFocus: false }
    );
  const { data: merchants } = api.affiliates.getAllMerchants.useQuery();
  const { data: countries } = api.affiliates.getLongCountries.useQuery({});
  const columnHelper = createColumnHelper<PixelLogsReportType>();
  const createColumn = (id: keyof PixelLogsReportType, header: string) =>
    columnHelper.accessor(id, {
      cell: (info) => info.getValue(),
      header,
    });

  // console.log("Clicks render", {
  // 	data,
  // 	merchants,
  // 	isLoading,
  // 	from,
  // 	to,
  // 	merchant_id,
  // });

  const divCol = (valid: number | null | undefined) => {
    return valid === 1 ? <span>Active</span> : <span>Blocked</span>;
  };

  const columns = [
    createColumn("id", "Pixel Fire ID"),
    createColumn("dateTime", "Date"),
    columnHelper.accessor("pixel_monitor_type", {
      cell: (info) => info.getValue(),
      header: "Type",
    }),
    columnHelper.accessor("pixel_monitor_method", {
      cell: (info) => info.getValue(),
      header: "Method",
    }),
    createColumn("firedUrl", "Fired URL"),
    createColumn("pixelResponse", "Response"),
    columnHelper.accessor("pixel_monitor_totalFired", {
      cell: (info) => info.getValue(),
      header: "All Time Fired",
    }),
    columnHelper.accessor("pixel-state" as any, {
      cell: ({ row }) => divCol(row?.original?.pixel_monitor_affiliate_valid),
      header: "Pixel State",
    }),
    columnHelper.accessor("pixel_monitor_affiliate_id", {
      cell: (info) => info.getValue() || "",
      header: "Affiliate ID",
    }),
    columnHelper.accessor("pixel_monitor_affiliate_username", {
      cell: (info) => info.getValue(),
      header: "Affiliate Username",
    }),
    columnHelper.accessor("pixel_monitor_merchant_id", {
      cell: (info) => info.getValue(),
      header: "Merchant ID",
    }),
    // columnHelper.accessor("pixel_monitor.merchant", {
    //   cell: (info) => info.getValue(),
    //   header: "Merchant",
    // }),
    createColumn("product_id", "Product ID"),
    // columnHelper.accessor("banner_id", {
    //   cell: (info) => info.getValue(),
    //   header: "Banner ID",
    // }),
    columnHelper.accessor("pixel_monitor_affiliate_group_id", {
      cell: (info) => info.getValue(),
      header: "Group ID",
    }),
  ];

  const country_options = countries?.map((country: any) => {
    return {
      id: country.id,
      title: country.title,
    };
  });

  const { mutateAsync: reportExport } =
    api.affiliates.exportPixelLogReportData.useMutation();

  const handleExport = async (exportType: ExportType) =>
    reportExport({
      ...dateRange,
      merchant_id: getNumberParam(merchant_id),
      country: country ? String(country) : "",
      group_id: group_id ? String(group_id) : "",
      exportType,
      reportColumns: getColumns(columns),
    });

  console.log(`muly:PixelLogReports`, { data });

  return (
    <ReportControl
      reportName="Pixel Log Report"
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
        label="Country"
        choices={country_options}
        varName="country"
      />
      <SearchText varName="unique_id" label="Unique ID" />
      <SearchText varName="trader_id" label="Trader ID" />
    </ReportControl>
  );
};
