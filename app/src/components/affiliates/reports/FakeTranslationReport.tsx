import { ReportControl } from "@/components/affiliates/reports/report-control";
import { DateColumn } from "@/components/common/data-table/available-column";
import { usePagination } from "@/components/common/data-table/pagination-hook";
import { deserializeSorting } from "@/components/common/data-table/sorting";
import { useSearchContext } from "@/components/common/search/search-context";
import { getDateRange } from "@/components/common/search/search-date-range";
import { SearchText } from "@/components/common/search/search-text";
import type { ExportType } from "@/server/api/routers/affiliates/reports/reports-utils";
import { api } from "@/utils/api";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "next-i18next";
import "react-datepicker/dist/react-datepicker.css";
import type { TranslateReportFakeType } from "../../../server/db-types";
import { getColumns } from "@/components/affiliates/reports/utils";

const columnHelper = createColumnHelper<TranslateReportFakeType>();
const createColumn = (id: keyof TranslateReportFakeType, header: string) =>
  columnHelper.accessor(id, {
    cell: (info) => info.getValue(),
    header,
  });

const columns = [
  createColumn("id", "ID"),
  columnHelper.accessor("rdate", {
    cell: (info) => DateColumn(info.getValue()),
    header: "Date",
  }),
  createColumn("source", "Source"),
  createColumn("langENG", "Lang ENG"),
  createColumn("langRUS", "Lang RUS"),
  createColumn("langGER", "Lang GER"),
  createColumn("langFRA", "Lang FRA"),
  createColumn("langITA", "Lang ITA"),
  createColumn("langESP", "Lang ESP"),
  createColumn("langHEB", "Lang HEB"),
  createColumn("langARA", "Lang ARA"),
  createColumn("langCHI", "Lang CHI"),
  createColumn("langPOR", "Lang POR"),
  createColumn("langJAP", "Lang JAP"),
];

export const FakeTranslationReport = () => {
  const { t } = useTranslation("affiliate");
  const {
    values: { search, dates },
  } = useSearchContext();
  const pagination = usePagination();
  const { name, ...dateRange } = getDateRange(dates);
  console.log("*************************PAGE INFO: ", pagination.pageParams);
  const _sorting = deserializeSorting(pagination.pageParams.sortInfo);

  const { data, isRefetching, error } =
    api.affiliates.getTranslateReportFake.useQuery(
      {
        ...dateRange,
        search,
        pageParams: pagination.pageParams,
        sortingParam: _sorting,
      },
      { keepPreviousData: true, refetchOnWindowFocus: false }
    );

  const { mutateAsync: reportExport } =
    api.affiliates.exportTranslateReportFake.useMutation();

  const handleExport = async (exportType: ExportType) =>
    reportExport({
      ...dateRange,
      search,
      exportType,
      reportColumns: getColumns(columns),
    });

  console.log(`muly:FakeTranslationReport`, {
    data,
    pagination,
    _sorting,
    columns,
  });

  return (
    <ReportControl
      reportName="Fake Translation Report"
      // totalItems={data.length || 0}
      report={data}
      error={error}
      columns={columns}
      pagination={pagination}
      isRefetching={isRefetching}
      handleExport={async (exportType: ExportType) => handleExport(exportType)}
    >
      <SearchText label={t("Search")} varName="search" />
    </ReportControl>
  );
};
