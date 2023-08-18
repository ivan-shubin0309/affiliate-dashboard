import { createColumnHelper } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import AccountManager from "./AccountManager";
import { DashboardCountryReport } from "./DashboradCountryReport";
import DeviceReport from "./DeviceReport";

import type { TopMerchantCreativeType } from "../../../server/db-types";
import { api } from "../../../utils/api";

import { ColumnSelect } from "@/components/common/data-table/column-select";
import { ColumnSelectButton } from "@/components/common/data-table/column-select-button";
import { PageHeader } from "@/components/common/page/page-header";
import { SearchApply } from "@/components/common/search/saerch-apply-button";
import { useSearchContext } from "@/components/common/search/search-context";
import {
  getDateRange,
  SearchDateRange,
} from "@/components/common/search/search-date-range";
import {
  differenceInDays,
  endOfMonth,
  endOfToday,
  startOfMonth,
  sub,
} from "date-fns";
import Affiliates from "../../../layouts/AffiliatesLayout";
import DashboardCards from "./DashboardCards";
import DashboardCharts from "./DashboardCharts";
import { valueFormat } from "@/utils/format";
import { Loading } from "@/components/common/Loading";
import { useTranslation } from "next-i18next";
import { toKey } from "@/components/affiliates/reports/utils";

interface CardInfo {
  id: string;
  title: string;
  link: string;
  value_format?: string;
}

const _allColumns: CardInfo[] = [
  { id: "Impressions", title: "Impressions", link: "reports/creative-report" },
  { id: "Clicks", title: "Clicks", link: "reports/clicks-report" },
  { id: "Install", title: "Install", link: "reports/install-reports" },
  { id: "Leads", title: "Leads", link: "reports/trader-report" },
  { id: "Demo", title: "Demo", link: "reports/clicks-report" },
  { id: "RealAccount", title: "Real Account", link: "reports/trader-report" },
  { id: "FTD", title: "FTD", link: "reports/trader-report" },
  {
    id: "Withdrawal",
    title: "Withdrawal",
    link: "reports/trader-report",
    value_format: valueFormat.CURRENCY,
  },
  {
    id: "ChargeBack",
    title: "Chargeback",
    link: "reports/clicks-report",
    value_format: valueFormat.CURRENCY,
  },
  { id: "ActiveTrader", title: "Active Trader", link: "reports/trader-report" },
  {
    id: "Commission",
    title: "Commission",
    link: "reports/quick-summary",
    value_format: valueFormat.CURRENCY,
  },
  {
    id: "NetDeposit",
    title: "Deposit",
    link: "reports/quick-summary",
    value_format: valueFormat.CURRENCY,
  },
];

const columnHelper = createColumnHelper<TopMerchantCreativeType>();
export interface ItemType {
  id: number;
  title: string;
  value: string;
  isChecked: boolean;
}
export const Dashboard = () => {
  const { t } = useTranslation("affiliate");
  const allColumns = useMemo(
    () =>
      _allColumns.map(({ title, id, ...rest }) => ({
        title: t(`dashboard.cards.${toKey(id)}`, title),
        id,
        ...rest,
      })),
    [t]
  );
  const today = endOfToday();
  const {
    values: { dates },
  } = useSearchContext();
  const { name, ...dateRange } = getDateRange(dates);

  // Current time frame weight compared to last six month
  const timeFrameFactor =
    (differenceInDays(dateRange.to, dateRange.from) + 1) /
    (differenceInDays(
      endOfMonth(sub(today, { months: 1 })),
      startOfMonth(sub(today, { months: 6 }))
    ) +
      1);

  const sixMonth = {
    from: startOfMonth(sub(today, { months: 6 })),
    to: endOfMonth(sub(today, { months: 1 })),
  };

  const { values: context } = useSearchContext();

  const [selectColumnsMode, setSelectColumnsMode] = useState<{
    [name: string]: boolean;
  } | null>(null);

  const { data, isRefetching: isRefetchingData } =
    api.affiliates.getDashboard.useQuery(
      {
        ...dateRange,
      },
      { keepPreviousData: true, refetchOnWindowFocus: false }
    );

  const { data: lastMonthData } = api.affiliates.getDashboard.useQuery(
    {
      from: startOfMonth(sub(today, { months: 1 })),
      to: endOfMonth(sub(today, { months: 1 })),
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  const { data: thisMonthData } = api.affiliates.getDashboard.useQuery(
    {
      from: startOfMonth(today),
      to: today,
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  const { data: performanceChart, isRefetching: isRefetchingPerformanceChart } =
    api.affiliates.getPerformanceChart.useQuery(sixMonth, {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    });

  const {
    data: allPerformanceChart,
    isRefetching: isRefetchingAllPerformanceChart,
  } = api.affiliates.getAllPerformanceChart.useQuery(sixMonth, {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const { data: conversionChart, isRefetching: isRefetchingConversionChart } =
    api.affiliates.getConversionChart.useQuery(sixMonth, {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    });

  // const { data: creative } = api.affiliates.getTopMerchantCreative.useQuery(
  //   undefined,
  //   { keepPreviousData: true, refetchOnWindowFocus: false }
  // );

  const { data: account } = api.affiliates.getAccount.useQuery(undefined, {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  // console.log("TT: ", adminInfo);

  const { data: reportsColumns } = api.affiliates.getReportsColumns.useQuery(
    { level: "affiliate", report: "dashStatCols" },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  console.log("reportsColumns1: " + JSON.stringify(reportsColumns));

  const isRefetching =
    isRefetchingData ||
    isRefetchingPerformanceChart ||
    isRefetchingAllPerformanceChart ||
    isRefetchingConversionChart;
  // !data ||
  // !creative ||
  // !reportsColumns ||
  // !performanceChart ||
  // !allPerformanceChart ||
  // !conversionChart ||
  // !lastMonthData ||
  // !thisMonthData;

  const drawDashboardCard = (
    { id, title, link, value_format }: CardInfo,
    idx: number
  ) => {
    interface Sum {
      [index: string]: number;
    }

    const sumObject = (data ? data[0]?._sum : {}) as Sum;
    const value: number = sumObject ? Number(sumObject[id]) : 0;
    const lastMonthObject = (
      lastMonthData ? lastMonthData[0]?._sum : {}
    ) as Sum;
    const lastMonth = lastMonthObject ? lastMonthObject[id] : 0;

    const thisMonthObject = (
      thisMonthData ? thisMonthData[0]?._sum : {}
    ) as Sum;
    const thisMonth = thisMonthObject ? thisMonthObject[id] : 0;

    let total = 0;
    const chartValues: number[] =
      allPerformanceChart?.map((field, i) => {
        interface Sum {
          [index: string]: number;
        }

        const fieldObject = field as unknown as Sum;
        const fieldValue = fieldObject ? fieldObject[id] || 0 : 0;

        total += fieldValue;
        return fieldValue;
      }) || [];

    const upDown = timeFrameFactor < 1 ? value > total * timeFrameFactor : null;

    return (
      <DashboardCards
        key={idx}
        idx={idx}
        title={title}
        link={link}
        lastMonth={lastMonth}
        thisMonth={thisMonth}
        value={value}
        upDown={upDown}
        chartValues={chartValues}
        value_format={value_format}
      />
    );
  };

  if (!reportsColumns) {
    return <Loading />;
  }

  return (
    <>
      <PageHeader title="Dashboard">
        <SearchDateRange />
        <SearchApply isLoading={isRefetching} />
        <ColumnSelectButton
          columns={allColumns}
          reportName={"dashStatCols"}
          reportsColumns={reportsColumns}
          selectColumnsMode={selectColumnsMode}
          setSelectColumnsMode={setSelectColumnsMode}
        />
      </PageHeader>
      <div>
        <ColumnSelect
          columns={allColumns}
          reportName={"dashStatCols"}
          reportsColumns={reportsColumns}
          selectColumnsMode={selectColumnsMode}
          setSelectColumnsMode={setSelectColumnsMode}
          btnText="Save"
        />
        <div className="mt-4 grid gap-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
          {!!reportsColumns &&
            allColumns
              .filter(
                ({ id, title, link }) =>
                  selectColumnsMode || !reportsColumns.includes(id)
              )
              .map(drawDashboardCard)}
        </div>

        <div className="my-6 rounded-2xl bg-white px-2 py-5 shadow-sm md:px-6">
          <DashboardCharts
            performanceChart={performanceChart || []}
            conversionChart={conversionChart || []}
          />
        </div>
      </div>

      <div className="my-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <DeviceReport />
        <DashboardCountryReport />
        <AccountManager />
      </div>
    </>
  );
};

Dashboard.getLayout = Affiliates;
