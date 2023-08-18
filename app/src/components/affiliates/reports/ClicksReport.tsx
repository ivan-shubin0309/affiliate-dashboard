import { ReportControl } from "@/components/affiliates/reports/report-control";
import { DateColumn } from "@/components/common/data-table/available-column";
import { usePagination } from "@/components/common/data-table/pagination-hook";
import { deserializeSorting } from "@/components/common/data-table/sorting";
import {
  getNumberParam,
  useSearchContext,
} from "@/components/common/search/search-context";
import { getDateRange } from "@/components/common/search/search-date-range";
import { SearchSelect } from "@/components/common/search/search-select";
import { SearchText } from "@/components/common/search/search-text";
import type { ExportType } from "@/server/api/routers/affiliates/reports/reports-utils";
import { createColumnHelper } from "@tanstack/react-table";
import type { ClicksReportType } from "../../../server/db-types";
import { api } from "../../../utils/api";
import { getColumns } from "./utils";

const columnHelper = createColumnHelper<ClicksReportType>();
const createColumn = (id: keyof ClicksReportType, header: string) =>
  columnHelper.accessor(id, {
    cell: (info) => info.getValue(),
    header,
  });

const columns = [
  createColumn("id", "ID"),
  createColumn("uid", "UID"),
  createColumn("views", "Impression"),
  createColumn("clicks", "Click"),
  columnHelper.accessor("rdate", {
    cell: (info) => DateColumn(info.getValue()),
    header: "Date",
  }),
  createColumn("type", "Type"),
  createColumn("merchant_name", "Merchant"),
  createColumn("banner_id", "Banner ID"),
  createColumn("profile_id", "Profile ID"),
  createColumn("profile_name", "Profile Name"),
  createColumn("param", "Param"),
  createColumn("param2", "Param 2"),
  createColumn("refer_url", "Refer URL"),
  createColumn("country", "Country"),
  createColumn("ip", "IP"),
  createColumn("platform", "Platform"),
  createColumn("os", "Operating System"),
  createColumn("osVersion", "OS Version"),
  createColumn("browser", "Browser"),
  createColumn("broswerVersion", "Browser Version"),
  createColumn("trader_id", "Trader ID"),
  createColumn("trader_name", "Trader Alias"),
  createColumn("leads", "Lead"),
  createColumn("demo", "Demo"),
  createColumn("sale_status", "Sales Status"),
  createColumn("real", "Accounts"),
  createColumn("ftd", "FTD"),
  createColumn("volume", "Volume"),
  createColumn("withdrawal", "Withdrawal Amount"),
  createColumn("chargeback", "ChargeBack Amount"),
  createColumn("Qftd", "Active Traders"),
];

const typeOptions = [
  {
    id: "clicks",
    title: "Clicks",
  },
  {
    id: "views",
    title: "Views",
  },
];

export const ClicksReport = () => {
  const {
    values: { merchant_id, dates, trader_id, unique_id, type },
  } = useSearchContext();
  const pagination = usePagination();
  const { name, ...dateRange } = getDateRange(dates);
  const _sorting = deserializeSorting(pagination.pageParams.sortInfo);

  console.log("sorting ---------->", _sorting);
  const { data, isRefetching, error } = api.affiliates.getClicksReport.useQuery(
    {
      ...dateRange,
      type: type === "all" ? undefined : type === "clicks" ? "clicks" : "views",
      merchant_id: getNumberParam(merchant_id),
      trader_id,
      unique_id,
      pageParams: pagination.pageParams,
      sortingParam: _sorting,
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  const { mutateAsync: reportExport } =
    api.affiliates.exportClicksReport.useMutation();

  const handleExport = async (exportType: ExportType) =>
    reportExport({
      ...dateRange,
      type: type === "all" ? undefined : type === "clicks" ? "clicks" : "views",
      merchant_id: getNumberParam(merchant_id),
      trader_id,
      unique_id,
      exportType,
      reportColumns: getColumns(columns),
    });
  // reportExport({
  //   type: type === "all" ? undefined : type === "clicks" ? "clicks" : "views",
  //   merchant_id: getNumberParam(merchant_id),
  //   trader_id,
  //   unique_id,
  //   exportType,
  // });

  const { data: merchants } = api.affiliates.getAllMerchants.useQuery(
    undefined,
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  console.log("data ---->", data);
  return (
    <ReportControl
      reportName="Clicks Report"
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
      <SearchSelect varName="type" label={"Type"} choices={typeOptions} />
    </ReportControl>
  );
};
