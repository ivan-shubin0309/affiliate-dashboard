import { useState } from "react";
import { useSearchContext } from "@/components/common/search/search-context";
import { endOfDay, format, parse, startOfDay, sub } from "date-fns";
import type { DateRangeValue } from "@/components/common/DateRangeSelect";
import {
  DateRangeSelect,
  getPredefinedDateRange,
} from "@/components/common/DateRangeSelect";

const formatValueDateRange = (
  from: Date | null | undefined,
  to: Date | null | undefined
) => {
  return `${format(
    from || sub(new Date(), { months: 6 }),
    "yyyyMMdd"
  )}-${format(to || new Date(), "yyyyMMdd")}`;
};

export const getDateRange = (value?: string): DateRangeValue => {
  let range;
  const regex = /^(\d{8})-(\d{8})$/gm;

  if (value && regex.exec(value)) {
    // console.log(`muly:getDateRange parse dates, are they? ${value}`, {
    //   re: regex.exec(value),
    // });
    const [fromS, toS] = (value || "").split("-");

    const from = parse(fromS || "", "yyyyMMdd", new Date());
    const to = parse(toS || "", "yyyyMMdd", new Date());

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      range = getPredefinedDateRange("last-6-month");
    } else {
      range = {
        name: "custom",
        from,
        to,
      };
    }
  } else {
    range = getPredefinedDateRange(value);
  }

  return {
    name: range.name,
    from: startOfDay(range.from),
    to: endOfDay(range.to),
  };
};

interface Props {
  varName?: string;
  label?: string;
}

export const SearchDateRange = ({ varName = "dates", label }: Props) => {
  const { setControlValue, controlValue } = useSearchContext();
  const [value, setValue] = useState(controlValue[varName] || "last-6-month");

  const dateRangeValue = getDateRange(value);

  const handleChangeDateRange = (value: DateRangeValue) => {
    const textValue =
      value.name === "custom"
        ? formatValueDateRange(value.from, value.to)
        : value.name;

    console.log(`muly:handleChangeDateRange`, { textValue });

    setValue(textValue);
    setControlValue(varName, textValue);
  };

  return (
    <DateRangeSelect value={dateRangeValue} setValue={handleChangeDateRange} />
  );
};
