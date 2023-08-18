import { CalendarDatePicker } from "@/components/ui/date-input";
import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfWeek,
  startOfYear,
  sub,
} from "date-fns";
import { SelectInput } from "@/components/common/select-input";
import { Calendar } from "lucide-react";

export type DateRange =
  | "today"
  | "yesterday"
  | "this-week"
  | "month-to-date"
  | "last-month"
  | "last-6-month"
  | "year-to-date"
  | "last-year";

type CustomDateRange = DateRange | "custom";

export const dateRangeChoices = [
  { id: "today", title: "Today" },
  { id: "yesterday", title: "Yesterday" },
  { id: "this-week", title: "This Week" },
  { id: "month-to-date", title: "Month to Date" },
  { id: "last-month", title: "Last Month" },
  { id: "last-6-month", title: "Last 6 Month" },
  { id: "year-to-date", title: "Year to Date" },
  { id: "last-year", title: "Last Year" },
  { id: "custom", title: "Custom" },
];

export const getPredefinedDateRange = (
  value?: string | null
): DateRangeValue => {
  const setRange = (value: CustomDateRange, from: Date, to: Date) => ({
    name: value,
    from,
    to,
  });

  // console.log(`muly:handleSelectDateRange ${value}`, {});
  const today = new Date();
  let range;
  if (value === "today") {
    range = setRange(value, today, today);
  } else if (value === "yesterday") {
    const yesterday = sub(today, { days: 1 });
    range = setRange(value, yesterday, yesterday);
  } else if (value === "this-week") {
    range = setRange(value, startOfWeek(today), today);
  } else if (value === "month-to-date") {
    range = setRange(value, startOfMonth(today), today);
  } else if (value === "last-month") {
    range = setRange(
      value,
      startOfMonth(sub(today, { months: 1 })),
      endOfMonth(sub(today, { months: 1 }))
    );
  } else if (value === "year-to-date") {
    range = setRange(value, startOfYear(today), today);
  } else if (value === "last-year") {
    range = setRange(
      value,
      startOfYear(sub(today, { years: 1 })),
      endOfYear(sub(today, { years: 1 }))
    );
  } /* if (value === "last-6-month") */ else {
    range = setRange(
      "last-6-month",
      startOfMonth(sub(today, { months: 6 })),
      endOfMonth(sub(today, { months: 1 }))
    );
  }

  return range;
};

export type DateRangeValue = {
  from: Date;
  to: Date;
  name: string;
};

interface Props {
  value: DateRangeValue;
  setValue: (value: DateRangeValue) => void;
}

export const DateRangeSelect = ({ value, setValue }: Props) => {
  console.log(`muly:DateRangeSelect`, { value });
  return (
    <div>
      <div className="relative my-1 mr-2 inline-block lg:my-0">
        <SelectInput
          choices={dateRangeChoices}
          value={value.name}
          onChange={(value) => {
            setValue(getPredefinedDateRange(value as DateRange));
          }}
          placeholder="Select date range"
          icon={<Calendar className="ml-2 h-4 w-4 opacity-50" />}
        />
      </div>

      <div className="inline-block">
        <div className="inline-block">
          <div className="customDatePickerStyling my-1 flex cursor-pointer items-center justify-center rounded bg-white p-0 text-xs md:text-sm lg:my-0">
            <CalendarDatePicker
              selected={value.from}
              handleDateChange={(date: Date) => {
                console.log(`muly:handleDateChange`, { date, value });
                setValue({ ...value, from: date, name: "custom" });
              }}
              allowTyping={true}
              showIcon={false}
            ></CalendarDatePicker>
          </div>
        </div>
        <label className="px-1 text-sm text-[#525252]">To</label>
        <div className="inline-block">
          <div className="customDatePickerStyling my-1 flex cursor-pointer items-center justify-center rounded bg-white p-0 text-xs md:text-sm lg:my-0">
            <CalendarDatePicker
              selected={value.to}
              handleDateChange={(date: Date) => {
                console.log(`muly:date picker change`, { date });
                setValue({ ...value, to: date, name: "custom" });
              }}
              allowTyping={true}
              showIcon={false}
            ></CalendarDatePicker>
          </div>
        </div>
      </div>
    </div>
  );
};
