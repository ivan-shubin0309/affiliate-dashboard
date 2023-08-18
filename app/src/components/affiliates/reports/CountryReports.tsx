import { ReportControl } from "@/components/affiliates/reports/report-control";
import { usePagination } from "@/components/common/data-table/pagination-hook";
import {
  getNumberParam,
  useSearchContext,
} from "@/components/common/search/search-context";
import { getDateRange } from "@/components/common/search/search-date-range";
import { SearchSelect } from "@/components/common/search/search-select";
import type { ExportType } from "@/server/api/routers/affiliates/reports/reports-utils";
import { api } from "@/utils/api";
import { createColumnHelper } from "@tanstack/react-table";
import "react-datepicker/dist/react-datepicker.css";
import type { CountryReportType } from "../../../server/db-types";
import { getColumns } from "./utils";

const columnHelper = createColumnHelper<CountryReportType>();
const createColumn = (id: keyof CountryReportType, header: string) =>
  columnHelper.accessor(id, {
    cell: (info) => info.getValue(),
    header,
  });

const columns = [
  createColumn("country", "Country"),
  createColumn("views", "Views"),
  createColumn("clicks", "Clicks"),
  createColumn("cpi", "CPI"),
  createColumn("merchant", "Merchant"),
  createColumn("volume", "Volume"),
  createColumn("withdrawal", "Withdrawal"),
  createColumn("leads", "Leads"),
  createColumn("demo", "Demo"),
  createColumn("real", "Account"),
  createColumn("depositingAccounts", "Depositing Accounts"),
  createColumn("real_ftd", "Real FTD"),
  createColumn("ftd", "FTD"),
  createColumn("ftd_amount", "FTD Amount"),
  createColumn("sumDeposits", "Sum Deposits"),
  createColumn("bonus", "Bonus"),
  createColumn("chargeback", "Chargeback"),
  createColumn("netRevenue", "Net Revenue"),
  createColumn("pnl", "PnL"),
  createColumn("totalCom", "Total Commission"),
  createColumn("Qftd", "QFTD"),
];

export const CountryReports = () => {
  const {
    values: { merchant_id, dates },
  } = useSearchContext();
  const pagination = usePagination();
  const { name, ...dateRange } = getDateRange(dates);

  const { data: merchants } = api.affiliates.getAllMerchants.useQuery(
    undefined,
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );
  const { data, isRefetching, error } =
    api.affiliates.getCountryReport.useQuery(
      {
        ...dateRange,
        merchant_id: getNumberParam(merchant_id),
        pageParams: pagination.pageParams,
      },
      { keepPreviousData: true, refetchOnWindowFocus: false }
    );

  const { mutateAsync: reportExport } =
    api.affiliates.exportClicksReport.useMutation();

  const handleExport = async (exportType: ExportType) =>
    reportExport({
      ...dateRange,
      merchant_id: getNumberParam(merchant_id),
      exportType,
      reportColumns: getColumns(columns),
    });

  console.log(`muly:CountryReports:render`, { data, error });

  return (
    <ReportControl
      reportName="Country Report"
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
    </ReportControl>
  );
};
