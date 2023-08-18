import { ExportButton } from "@/components/affiliates/reports/export-button";
import type { OnExport } from "@/components/affiliates/reports/utils";
import { toKey } from "@/components/affiliates/reports/utils";
import { Loading } from "@/components/common/Loading";
import type { ReportDataTableProps } from "@/components/common/data-table/ReportDataTable";
import { ReportDataTable } from "@/components/common/data-table/ReportDataTable";
import {
  ColumnSelect,
  getColumnsBySetup,
} from "@/components/common/data-table/column-select";
import { ColumnSelectButton } from "@/components/common/data-table/column-select-button";
import type { usePagination } from "@/components/common/data-table/pagination-hook";
import { PageHeader } from "@/components/common/page/page-header";
import { SearchApply } from "@/components/common/search/saerch-apply-button";
import { SearchDateRange } from "@/components/common/search/search-date-range";
import { Pagination } from "@/components/ui/pagination";
import { api } from "@/utils/api";
import { useTranslation } from "next-i18next";
import React, { useMemo, useState } from "react";

interface Props<Data extends object> extends ReportDataTableProps<Data> {
  error: any;
  reportName: string;
  isRefetching: boolean;
  children: React.ReactNode;
  handleExport: OnExport;
  pagination: ReturnType<typeof usePagination>;
}

export const ReportControl = <Data extends object>({
  children,
  reportName,
  isRefetching,
  report,
  error,
  columns,
  pagination,
  footerData,
  handleExport,
}: Props<Data>) => {
  const { t } = useTranslation("affiliate");
  const allColumns = useMemo(
    () =>
      columns.map(({ header, ...rest }) => {
        const id = toKey(String(header));
        return {
          title: t(`${toKey(reportName)}.${id}`, String(header)),
          id,
          ...rest,
        };
      }),
    [t, reportName, columns]
  );

  const [selectColumnsMode, setSelectColumnsMode] = useState<{
    [name: string]: boolean;
  } | null>(null);

  const { data: reportsColumns } = api.affiliates.getReportsColumns.useQuery(
    { level: "affiliate", report: reportName },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  // console.log(`muly:ReportControl`, { reportsColumns });
  if (error) {
    console.log(`Error:ReportControl`, { error });
    return (
      <div className="max-w-full text-red-500">
        <pre>{error.data.code}</pre>
        <pre>{error.data.path}</pre>
        <pre>{error.message}</pre>
        <pre>{error.stack}</pre>
      </div>
    );
  }

  return report ? (
    <div className="flex w-full flex-col gap-2">
      <PageHeader
        title="Reports"
        subTitle={reportName}
        searchComponent={
          <div className="flex flex-row flex-wrap items-end gap-2 pb-3">
            <SearchDateRange />
            {children}
            <div className="flex-grow" />
            <SearchApply isLoading={isRefetching} />
          </div>
        }
      >
        <div className="flex flex-row gap-2">
          <ExportButton onExport={handleExport} reportName={reportName} />
          <ColumnSelectButton
            columns={allColumns}
            reportName={reportName}
            reportsColumns={reportsColumns}
            selectColumnsMode={selectColumnsMode}
            setSelectColumnsMode={setSelectColumnsMode}
          />
        </div>
      </PageHeader>

      <ColumnSelect
        columns={allColumns}
        reportName={reportName}
        reportsColumns={reportsColumns}
        selectColumnsMode={selectColumnsMode}
        setSelectColumnsMode={setSelectColumnsMode}
        btnText="Save"
      />

      {report?.pageInfo?.totalItems > 0 ? (
        <ReportDataTable
          report={report}
          columns={getColumnsBySetup(allColumns, reportsColumns)}
          footerData={footerData}
          pagination={pagination}
        />
      ) : (
        <div className="flex h-40 items-center justify-center">
          No results to display.
        </div>
      )}
      <Pagination
        pagination={pagination}
        totalItems={report.pageInfo.totalItems}
      />
    </div>
  ) : (
    <Loading />
  );
};
