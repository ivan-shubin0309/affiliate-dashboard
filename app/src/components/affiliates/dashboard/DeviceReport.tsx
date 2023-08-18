import { ChevronUp } from "lucide-react";
import DeviceReportChart from "../../common/chart/DeviceReportChart";
import DoughnutChart from "../../common/chart/DoughnutChart";
import { SelectInput } from "@/components/common/select-input";
import { daysBackChoices } from "@/components/affiliates/dashboard/DashboradCountryReport";
import { useState } from "react";

const reportInfo = [
  {
    title: "Desktop",
    percentValue: 72,
    increaseValue: 7,
    color: "#2262C6",
    amount: 600,
  },
  {
    title: "Tablet",
    percentValue: 18,
    increaseValue: 7,
    color: "#F76F2C",
    amount: 500,
  },
  {
    title: "Mobile",
    percentValue: 10,
    increaseValue: 7,
    color: "#FF001B",
    amount: 300,
  },
];

const reportDropDown = [
  { id: "Clicks", title: "Clicks" },
  { id: "SignUp", title: "SignUp" },
];

const DeviceReport = () => {
  const [selectedReport, setSelectedReport] = useState<string>("Clicks");
  const [lastDays, setLastDays] = useState<string>("90");

  return (
    <div className="rounded-2xl bg-white px-2 py-5 shadow-sm md:px-5">
      <div className="mb-3 text-xl font-bold text-primary">Device Report</div>
      <div className="mb-5 flex items-center justify-between">
        <div className="text-base font-light">Session by device</div>
        <div className="flex items-center justify-center text-xs font-light">
          <SelectInput
            choices={daysBackChoices}
            value={lastDays}
            onChange={setLastDays}
            placeholder="Select days"
          />
        </div>
      </div>
      <div className="align-center mb-5">
        <DeviceReportChart />
      </div>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-base font-medium text-[#2262C6]">Report</div>
        <div className="flex w-48 items-center justify-center text-xs">
          <SelectInput
            value={selectedReport}
            onChange={setSelectedReport}
            choices={reportDropDown}
          />
        </div>
      </div>

      {reportInfo.map((report, index) => {
        return (
          <div
            className={
              "flex items-center justify-between" + (index == 2 ? "" : " mb-7")
            }
            key={report.title}
          >
            <div className="flex items-center justify-center">
              <div className="h-10 w-10 ">
                <DoughnutChart
                  value={report.percentValue}
                  color={report.color}
                />
              </div>
              <div className="ml-3 text-base">
                <div className="text-black">{report.title}</div>
                <div className="text-[#717579]">{report.percentValue}</div>
              </div>
              <div className="ml-2.5">
                <ChevronUp fill="#04B042" color="#04B042" className="h-5 w-5" />
              </div>
              <div className="ml-1 text-base text-[#04B042]">
                {report.increaseValue}%
              </div>
            </div>
            <div className="text-base font-bold text-black">
              {report.amount}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DeviceReport;
