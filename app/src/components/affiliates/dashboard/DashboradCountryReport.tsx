import { useState } from "react";
import { api } from "../../../utils/api";
import CountryChart from "../../common/chart/CountryChart";
import { SelectInput } from "@/components/common/select-input";
import type { DashboardCountryReportType } from "../../../server/db-types";
import type { DashboardCountryReportInputType } from "../../../server/db-types";

export const reportDropDown = ["Accounts", "FTD", "Clicks"];

export const daysBackChoices = [
  { id: "90", title: "Last 90 Days" },
  { id: "30", title: "Last 30 Days" },
  { id: "1", title: "Last 1 Day" },
];

type ValueType = DashboardCountryReportInputType["value"];

export const DashboardCountryReport = () => {
  const [selectedReport, setSelectedReport] = useState<ValueType>("Accounts");
  const [lastDays, setLastDays] = useState<string>("90");
  const { data: reportData } =
    api.affiliates.getCountryReportDashboard.useQuery(
      {
        lastDays: Number(lastDays),
        value: selectedReport,
      },
      { keepPreviousData: true, refetchOnWindowFocus: false }
    );

  const labels: string[] = reportData?.map((item) => item.country) ?? [];
  const values: number[] =
    reportData?.map((item: DashboardCountryReportType) => item.value) ?? [];

  return (
    <div className="rounded-2xl bg-white px-2 py-5 shadow-sm md:px-5">
      <div className="mb-3 text-xl font-bold text-[#2262C6]">
        Country Report
      </div>
      <div className="mb-7 flex items-center justify-between">
        <div className="text-base font-light">Session by country</div>
        <div className="flex items-center justify-center text-xs font-light">
          <SelectInput
            choices={daysBackChoices}
            value={lastDays}
            onChange={setLastDays}
            placeholder="Select days"
          />
        </div>
      </div>
      <div className="align-center mb-5 flex justify-center">
        <img width="243" src="/img/worldMap.png" alt="worldmap" />
      </div>

      <div className="mb-3 flex items-center justify-between">
        <div className="text-base font-medium text-[#2262C6]">Report</div>
        <div className="flex w-48 items-center justify-center text-xs">
          <SelectInput
            value={selectedReport}
            onChange={(value) => setSelectedReport(value as ValueType)}
            choices={reportDropDown}
          />
        </div>
      </div>

      <div className="flex h-48 items-center justify-between">
        <CountryChart label={selectedReport} labels={labels} data={values} />
      </div>
    </div>
  );
};
