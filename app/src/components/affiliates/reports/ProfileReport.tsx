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
import type { ProfileReportType } from "../../../server/db-types";
import { api } from "../../../utils/api";
import { ReportControl } from "./report-control";
import { getColumns } from "./utils";

export const ProfileReport = () => {
  const {
    values: { dates, merchant_id, trader_id, banner_id, search_type },
  } = useSearchContext();
  const pagination = usePagination();
  const { name, ...dateRange } = getDateRange(dates);
  const _sorting = deserializeSorting(pagination.pageParams.sortInfo);

  const { data, isRefetching, error } =
    api.affiliates.getProfileReportData.useQuery(
      {
        ...dateRange,
        merchant_id: getNumberParam(merchant_id),
        search_type: search_type,
        pageParams: pagination.pageParams,
        sortingParam: _sorting,
      },
      { keepPreviousData: true, refetchOnWindowFocus: false }
    );
  const { data: merchants } = api.affiliates.getAllMerchants.useQuery();
  const columnHelper = createColumnHelper<ProfileReportType>();

  const createColumn = (id: keyof ProfileReportType, header: string) =>
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

  const divCol = (
    val: number | null | undefined,
    div: number | null | undefined
  ) => {
    return val && div ? (
      <span>{((val / div) * 100).toFixed(2)}%</span>
    ) : (
      <span>0%</span>
    );
  };

  const columns = [
    createColumn("id", "Profile ID"),
    createColumn("name", "Profile Name"),
    createColumn("url", "Profile URL"),
    createColumn("views", "Impressions"),
    createColumn("clicks", "Clicks"),
    createColumn("totalCPI", "Installations"),
    columnHelper.accessor("CTR" as any, {
      cell: ({ row }) => {
        return divCol(row?.original?.clicks, row?.original?.views);
      },
      header: "Click Through Ratio (CTR)",
    }),
    columnHelper.accessor("click-to-account" as any, {
      cell: ({ row }) =>
        divCol(row?.original?.totalReal, row?.original?.clicks),
      header: "Click to Account",
    }),
    columnHelper.accessor("click-to-sale" as any, {
      cell: ({ row }) => divCol(row?.original?.ftd, row?.original?.clicks),
      header: "Click to Sale",
    }),
    columnHelper.accessor("epc" as any, {
      cell: ({ row }) => divCol(row?.original?.totalCom, row?.original?.clicks),
      header: "EPC",
    }),
    createColumn("totalLeads", "Lead"),
    createColumn("totalDemo", "Demo"),
    createColumn("totalReal", "Accounts"),
    createColumn("ftd", "FTD"),
    createColumn("withdrawal", "Withdrawal Amount"),
    createColumn("chargeback", "ChargeBack Amount"),
    createColumn("volume", "Volume"),
    createColumn("totalPNL", "Group"),
  ];

  const searchType = [
    {
      id: "daily",
      title: "Daily",
    },
    {
      id: "weekly",
      title: "Weekly",
    },
    {
      id: "monthly",
      title: "Monthly",
    },
  ];

  const { mutateAsync: reportExport } =
    api.affiliates.exportProfileReportData.useMutation();

  const handleExport = async (exportType: ExportType) =>
    reportExport({
      ...dateRange,
      merchant_id: getNumberParam(merchant_id),
      exportType,
      reportColumns: getColumns(columns),
    });

  return (
    <ReportControl
      reportName="Profile Report"
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
    </ReportControl>
  );
};
