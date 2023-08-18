import { useRouter } from "next/router";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface Props {
  setFrom: React.Dispatch<React.SetStateAction<Date>>;
  setTo: React.Dispatch<React.SetStateAction<Date>>;
}

export const DateRangeSelect = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [userDate, setuserDate] = useState("");

  const handleUserDateChange = (userDate: string) => {
    const date = new Date();
    switch (userDate) {
      case "today":
        setStartDate(date);
        setEndDate(date);
        break;
      case "yesterday":
        date.setDate(date.getDate() - 1);
        setStartDate(date);
        setEndDate(date);
        break;
      case "this_week":
        const firstDay = new Date(date.setDate(date.getDate() - date.getDay()));
        const lastDay = new Date(
          date.setDate(date.getDate() - date.getDay() + 6)
        );
        setStartDate(firstDay);
        setEndDate(lastDay);
        break;
      case "this_month":
        const firstDayOfMonth = new Date(
          date.getFullYear(),
          date.getMonth(),
          1
        );
        const lastDayOfMonth = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0
        );
        setStartDate(firstDayOfMonth);
        setEndDate(lastDayOfMonth);
        break;
      case "last_month":
        const prevMonthLastDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          0
        );
        const prevMonthFirstDate = new Date(
          date.getFullYear() - (date.getMonth() > 0 ? 0 : 1),
          (date.getMonth() - 1 + 12) % 12,
          1
        );
        setStartDate(prevMonthFirstDate);
        setEndDate(prevMonthLastDate);
        break;
      case "this_year":
        const first_date_of_the_year = new Date(new Date().getFullYear(), 0, 1);
        setStartDate(first_date_of_the_year);
        setEndDate(date);
        break;
      case "last_year":
        const firstDateOfLastYear = new Date(
          new Date().getFullYear() - 1,
          0,
          1
        );
        const lastDateOfLastYear = new Date(
          new Date().getFullYear() - 1,
          11,
          31
        );
        setStartDate(firstDateOfLastYear);
        setEndDate(lastDateOfLastYear);
        break;
      default:
        setStartDate(date);
        setEndDate(date);
        break;
    }
  };

  // useEffect(() => {
  //   setFrom(startDate);
  //   setTo(endDate);
  // }, [startDate, endDate]);

  const dates = [
    {
      id: "today",
      title: "Today",
    },
    {
      id: "yesterday",
      title: "Yesterday",
    },
    {
      id: "this_week",
      title: "This Week",
    },
    {
      id: "this_month",
      title: "This Month",
    },
    {
      id: "last_month",
      title: "Last Month",
    },
    {
      id: "this_year",
      title: "This Year",
    },
    {
      id: "last_year",
      title: "Last Year",
    },
    {
      id: "custom",
      title: "Custom",
    },
  ];

  return (
    <div className="flex space-x-2">
      <div>
        <Label>Select Date: </Label>
        <Select onValueChange={handleUserDateChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">YesterDay</SelectItem>
            <SelectItem value="this_week">This Week</SelectItem>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="last_month">Last Month</SelectItem>
            <SelectItem value="this_year">This Year</SelectItem>
            <SelectItem value="last_year">Last Year</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>

        {/* <QuerySelect
          label="Select Date:"
          choices={dates}
          varName="merchant_id"
        /> */}
      </div>
      <div>
        <Label>From: </Label>
        <DatePicker
          selected={startDate}
          onChange={(date: Date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          className="flex h-9 w-max rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
        />
      </div>
      <div>
        <Label>To: </Label>
        <DatePicker
          selected={endDate}
          onChange={(date: Date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          className="flex h-9 w-max rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
        />
      </div>
    </div>
  );
};

// TODO remove
export const useDateRange = () => {
  return {
    from: new Date("2023-01-01"),
    to: new Date("2023-05-01"),
  };
};
