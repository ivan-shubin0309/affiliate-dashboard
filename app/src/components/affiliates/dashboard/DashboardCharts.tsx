import ConversionChart from "../../common/chart/ConversionChart";
import PerformanceChart from "../../common/chart/PerformanceChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
interface Props {
  performanceChart?:
    | {
        date: string;
        Accounts: number | null;
        ActiveTraders: number | null;
      }[]
    | any;
  conversionChart?:
    | {
        date: string;
        Conversions: number;
      }[]
    | any;
}
const DashboardCharts = ({ performanceChart, conversionChart }: Props) => {
  return (
    <Tabs defaultValue="Performance">
      <TabsList>
        <TabsTrigger value="Performance">Performance Chart</TabsTrigger>
        <TabsTrigger value="conversion">Conversion Chart</TabsTrigger>
      </TabsList>
      <TabsContent value="Performance">
        <div className="mt-5 h-80 pb-5">
          <PerformanceChart performanceChartData={performanceChart} />
        </div>
      </TabsContent>
      <TabsContent value="conversion">
        <div className="mt-5 h-80  pb-5">
          <ConversionChart conversionChartData={conversionChart} />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardCharts;
