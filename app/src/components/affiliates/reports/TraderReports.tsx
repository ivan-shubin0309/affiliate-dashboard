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
import type { TraderReportType } from "../../../server/db-types";
import { api } from "../../../utils/api";
import { ReportControl } from "./report-control";
import { getColumns } from "./utils";

export const creativeType = [
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

export const TraderReports = () => {
  const router = useRouter();
  const {
    values: { merchant_id, dates, trader_id, banner_id, country },
  } = useSearchContext();
  const pagination = usePagination();
  const { name, ...dateRange } = getDateRange(dates);
  const _sorting = deserializeSorting(pagination.pageParams.sortInfo);

  const { data, isRefetching, error } = api.affiliates.getTraderReport.useQuery(
    {
      ...dateRange,
      merchant_id: getNumberParam(merchant_id),
      trader_id: trader_id,
      country: country,
      banner_id: getNumberParam(banner_id),
      pageParams: pagination.pageParams,
      sortingParam: _sorting,
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  const { mutateAsync: reportExport } =
    api.affiliates.exportTraderReport.useMutation();

  const handleExport = async (exportType: ExportType) =>
    reportExport({
      ...dateRange,
      merchant_id: getNumberParam(merchant_id),
      trader_id: trader_id,
      country: country,
      banner_id: getNumberParam(banner_id),
      exportType,
      reportColumns: getColumns(columns),
    });
  const { data: merchants } = api.affiliates.getAllMerchants.useQuery();
  const { data: countries } = api.affiliates.getLongCountries.useQuery({});
  const columnHelper = createColumnHelper<TraderReportType>();
  const country_options = countries?.map((country: any) => {
    return {
      id: country.id,
      title: country.title,
    };
  });

  console.log("muly:trader render", {
    data,
    merchants,
    isRefetching,
    merchant_id,
    creativeType,
  });

  const createColumn = (id: keyof TraderReportType, header: string) =>
    columnHelper.accessor(id, {
      cell: (info) => info.getValue() as string,
      header,
    });

  // TODO: no match between columns here and what display on screen
  const columns = [
    createColumn("TraderID", "Trader ID"),
    // createColumn("sub_trader_count", "Trader Sub Accounts"),
    createColumn("RegistrationDate", "Registration Date"),
    createColumn("TraderStatus", "Trader Status"),
    createColumn("Country", "Country"),
    createColumn("affiliate_id", "Affiliate ID"),
    createColumn("AffiliateUsername", "Affiliate Username"),
    createColumn("merchant_id", "Merchant ID"),
    createColumn("MerchantName", "Merchant Name"),
    createColumn("CreativeID", "Creative ID"),
    createColumn("CreativeName", "Creative Name"),
    createColumn("Type", "Type"),
    createColumn("CreativeLanguage", "Creative Language"),
    createColumn("ProfileID", "Profile ID"),
    createColumn("ProfileName", "Profile Name"),
    createColumn("Param", "Param"),
    createColumn("Param2", "Param2"),
    createColumn("Param3", "Param3"),
    createColumn("Param4", "Param4"),
    createColumn("Param5", "Param5"),
    createColumn("FirstDeposit", "First Deposit"),
    createColumn("Volume", "Volume"),
    createColumn("WithdrawalAmount", "Withdrawal Amount"),
    createColumn("ChargeBackAmount", "ChargeBack Amount"),
    // createColumn("totalLots", "Lots"),
    createColumn("SaleStatus", "Sale Status"),
  ];

  return (
    <ReportControl
      reportName="Users Report"
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
      <SearchText varName="banner_id" label="Banner ID" />

      <SearchSelect label="Filter" choices={creativeType} varName="filter" />
    </ReportControl>
  );
};
