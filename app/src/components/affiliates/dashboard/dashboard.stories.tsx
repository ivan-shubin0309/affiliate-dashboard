import DashboardCharts from "./DashboardCharts";
import { DashboardCountryReport } from "./DashboradCountryReport";
import DeviceReport from "./DeviceReport";

const performanceChart = [
  {
    date: "Dec, 2022",
    Accounts: 5,
    ActiveTraders: 1,
  },
  {
    date: "Jan, 2023",
    Accounts: 3,
    ActiveTraders: 1,
  },
  {
    date: "Feb, 2023",
    Accounts: 6,
    ActiveTraders: 1,
  },
  {
    date: "Mar, 2023",
    Accounts: 4,
    ActiveTraders: 1,
  },
];

const conversionChart = [
  {
    date: "Dec, 2022",
    Conversions: 16.666666666666664,
  },
  {
    date: "Jan, 2023",
    Conversions: 14,
  },
  {
    date: "Feb, 2023",
    Conversions: 18,
  },
  {
    date: "Mar, 2023",
    Conversions: 19,
  },
  {
    date: "Apr, 2023",
    Conversions: 11,
  },
];
const meta = {
  component: DeviceReport,
};

const report = {
  first_name: "ner",
  last_name: "cohen",
  mail: "aridantang@gmail.com",
};

export default meta;

export const DeviceReports = {
  render: () => <DeviceReport />,
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/file/0JFoPEDsqew7pF100tiCOT/affiliate-dashboard-v2?node-id=1210-28142&t=ljE9QCN43WSsoBp3-0",
    },
  },
};

export const CountryReport = {
  render: () => <DashboardCountryReport />,
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/file/0JFoPEDsqew7pF100tiCOT/affiliate-dashboard-v2?node-id=1210-28142&t=ljE9QCN43WSsoBp3-0",
    },
  },
};

// export const AccountManagers = {
//   render: () => (
//     <AccountManager
//       first_name={report.first_name}
//       last_name={report.last_name}
//       mail={report.mail}
//     />
//   ),
//   parameters: {
//     design: {
//       type: "figma",
//       url: "https://www.figma.com/file/0JFoPEDsqew7pF100tiCOT/affiliate-dashboard-v2?node-id=1210-28142&t=ljE9QCN43WSsoBp3-0",
//     },
//   },
// };
export const Charts = {
  render: () => (
    <DashboardCharts
      performanceChart={performanceChart}
      conversionChart={conversionChart}
    />
  ),
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/file/0JFoPEDsqew7pF100tiCOT/affiliate-dashboard-v2?node-id=1210-28142&t=ljE9QCN43WSsoBp3-0",
    },
  },
};
