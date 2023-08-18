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
import { type LandingPageReportType } from "../../../server/db-types";
import { api } from "../../../utils/api";
import { ReportControl } from "./report-control";
import { getColumns } from "./utils";

export const LandingPageReport = () => {
  const router = useRouter();
  const {
    values: { merchant_id, dates, url, creative_type },
  } = useSearchContext();
  const pagination = usePagination();
  const { currentPage, itemsPerPage } = router.query;
  const { name, ...dateRange } = getDateRange(dates);
  const _sorting = deserializeSorting(pagination.pageParams.sortInfo);

  const { data, isRefetching, error } =
    api.affiliates.getLandingPageData.useQuery(
      {
        ...dateRange,
        merchant_id: getNumberParam(merchant_id),
        url: url,
        creative_type: creative_type,
        pageParams: pagination.pageParams,
        sortingParam: _sorting,
      },
      { keepPreviousData: true, refetchOnWindowFocus: false }
    );
  const { data: merchants } = api.affiliates.getAllMerchants.useQuery();
  const { data: countries } = api.affiliates.getLongCountries.useQuery({});
  const columnHelper = createColumnHelper<LandingPageReportType>();

  console.log("Landing Page render", {
    data,
    merchants,
    isRefetching,
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

  const createColumn = (id: keyof LandingPageReportType, header: string) =>
    columnHelper.accessor(id, {
      cell: (info) => info.getValue(),
      header,
    });

  const columns = [
    createColumn("url", "URL"),
    columnHelper.accessor("merchant.name", {
      cell: (info) => info.getValue(),
      header: "Merchant",
    }),
    createColumn("views", "Impressions"),
    createColumn("clicks", "Clicks"),
    createColumn("cpi", "Installation"),
    columnHelper.accessor("ctr" as any, {
      cell: ({ row }) => divCol(row?.original?.clicks, row.original.views),
      header: "Click Through Ratio (CTR)",
    }),
    columnHelper.accessor("click-to-account" as any, {
      cell: ({ row }) => divCol(row?.original?.real, row.original.clicks),
      header: "Click to Account",
    }),
    columnHelper.accessor("click-to-sale" as any, {
      cell: ({ row }) => divCol(row?.original?.ftd, row.original.clicks),
      header: "Click to Sale",
    }),
    createColumn("merchant_id", "EPC"),
    createColumn("lead", "Leads"),
    createColumn("demo", "Demo"),
    createColumn("accounts", "Accounts"),
    createColumn("ftd", "FTD"),
    createColumn("volume", "Volume"),
    createColumn("chargeback", "ChargeBack Amount"),
    createColumn("traderValue", "Active Traders"),
  ];

  const country_options = countries?.map((country: any) => {
    return {
      id: country.id,
      title: country.title,
    };
  });

  const { mutateAsync: reportExport } =
    api.affiliates.exportLandingPageData.useMutation();

  const handleExport = async (exportType: ExportType) =>
    reportExport({
      ...dateRange,
      merchant_id: getNumberParam(merchant_id),
      url: url,
      creative_type: creative_type,
      exportType,
      reportColumns: getColumns(columns),
    });

  return (
    <ReportControl
      reportName="Landing Page Report"
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
      <SearchText varName="trader_id" label="Trader ID" />
    </ReportControl>
  );
};
