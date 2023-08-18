import { usePagination } from "@/components/common/data-table/pagination-hook";
import { useSearchContext } from "@/components/common/search/search-context";
import { getDateRange } from "@/components/common/search/search-date-range";
import { SearchSelect } from "@/components/common/search/search-select";
import { SearchText } from "@/components/common/search/search-text";
import { type ExportType } from "@/server/api/routers/affiliates/reports/reports-utils";
import { createColumnHelper } from "@tanstack/react-table";
import { useRouter } from "next/router";
import type { SubAffiliateReportType } from "../../../server/db-types";
import { api } from "../../../utils/api";
import { ReportControl } from "./report-control";
import { getColumns } from "./utils";

export const SubAffiliateReport = () => {
  const router = useRouter();
  const {
    values: { merchant_id, dates, trader_id, unique_id, type },
  } = useSearchContext();
  const pagination = usePagination();
  const { name, ...dateRange } = getDateRange(dates);

  const { data, isRefetching, error } =
    api.affiliates.getSubAffiliateReport.useQuery(
      {
        ...dateRange,
        user_level: "admin",
        pageParams: pagination.pageParams,
      },
      { keepPreviousData: true, refetchOnWindowFocus: false }
    );
  const { data: merchants } = api.affiliates.getAllMerchants.useQuery();
  const columnHelper = createColumnHelper<SubAffiliateReportType>();

  console.log("sub affiliate render", {
    data,
    merchants,
    isRefetching,
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
  const createColumn = (id: keyof SubAffiliateReportType, header: string) =>
    columnHelper.accessor(id, {
      cell: (info) => info.getValue(),
      header,
    });

  const columns = [
    createColumn("id", "Affiliate ID"),
    createColumn("mail", "Affiliate Username"),
    createColumn("merchant_name", "Tier Level"),
    createColumn("Clicks", "Clicks"),
    createColumn("Install", "Installation"),
    createColumn("Leads", "Leads"),
    createColumn("Demo", "Demo"),
    createColumn("RealAccount", "Accounts"),
    createColumn("Volume", "Volume"),
    createColumn("Withdrawal", "Withdrawal Amount"),
    createColumn("ChargeBack", "ChargeBack Amount"),
  ];
  const { mutateAsync: reportExport } =
    api.affiliates.exportSubAffiliateReport.useMutation();

  const handleExport = async (exportType: ExportType) =>
    reportExport({
      ...dateRange,
      user_level: "admin",
      exportType,
      reportColumns: getColumns(columns),
    });

  return (
    <ReportControl
      reportName="Sub Affiliate Report"
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
