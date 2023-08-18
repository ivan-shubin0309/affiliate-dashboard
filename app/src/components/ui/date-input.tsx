import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface IProps {
  allowTyping?: boolean;
  showIcon?: boolean;
  selected?: Date;
  handleDateChange?: (date: Date) => void;
}

export function CalendarDatePicker({
  allowTyping,
  showIcon = true,
  selected = new Date(),
  handleDateChange,
}: IProps) {
  // const [date, setDate] = React.useState<Date>(selected);
  const date = selected;
  const setDate = (value: Date) => {
    if (handleDateChange) {
      handleDateChange(value);
    }
  };

  const [inputValue, setInputValue] = React.useState<string>(
    formatDate(selected)
  );

  useEffect(() => {
    if (formatDate(date) !== inputValue) {
      setInputValue(formatDate(date));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    let value = event.target.value;
    if (/\D\/$/.test(value)) value = value.substring(0, value.length - 3);
    const values = value.split("/").map(function (v) {
      return v.replace(/\D/g, "");
    });
    if (values[0]) values[0] = checkValue(values[0], 12);
    if (values[1]) values[1] = checkValue(values[1], 31);
    const output = values.map(function (v: string, i) {
      const d = new Date().getFullYear() % 100;
      if (i == 0 && v.length == 2) {
        return v + " / ";
      } else if (i == 1 && v.length == 2) {
        return v + " / ";
      } else if (i == 2 && v.length == 2 && Number(v) > d + 5) {
        return "19" + v;
      } else if (i == 2 && v.length == 2 && Number(v) < d + 5 && v !== "20") {
        return "20" + v;
      } else if (i == 2 && v.length == 4 && Number(v?.slice(2, 4)) > d + 5) {
        return String(new Date().getFullYear() + 5);
      } else {
        return v;
      }
    });

    if (output[2]?.length === 3 && output[2]?.slice(0, 2) !== "20") {
      value = output.join("").substring(0, 10);
    } else {
      value = output.join("").substring(0, 14);
    }
    setInputValue(value);
    if (value.length > 9) {
      const checkDate = new Date(value);
      setDate(checkDate);
      handleDateChange && handleDateChange(checkDate);
    } else {
      console.log("Invalid input value format");
    }
  }

  function checkValue(str: string, max: number) {
    if (str.charAt(0) !== "0" || str == "00") {
      let num = parseInt(str);
      if (isNaN(num) || num <= 0 || num > max) num = 1;
      str =
        num > parseInt(max.toString().charAt(0)) && num.toString().length == 1
          ? "0" + num.toString()
          : num.toString();
    }
    return str;
  }

  function formatDate(date: Date) {
    const d = new Date(date),
      month = "" + (d.getMonth() + 1).toString(),
      year = d.getFullYear();
    let day = "" + d.getDate().toString();

    if (day.length < 2) day = "0" + day;

    return [month, day, year].join("/");
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const element = document.getElementById("day-picker-input");
    if (event.key === " ") {
      element?.click();
    }
  }

  // React.useEffect(() => {
  //   console.log("inputValue: " + inputValue);
  //   setDate(selected);
  //   setInputValue(formatDate(selected));
  // }, [selected]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        {!allowTyping ? (
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start border border-[#e5e7eb] text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            {showIcon && <CalendarIcon className="mr-2 h-4 w-4" />}
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        ) : (
          <div className="relative w-fit">
            <Input
              type="text"
              id="day-picker-input"
              placeholder="MM/DD/YYYY"
              className={cn(
                " w-[280px] justify-start border border-[#e5e7eb] text-left font-normal"
              )}
              style={{ wordSpacing: "-3px" }}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            {showIcon && (
              <CalendarIcon
                className="mr-2 h-4 w-4"
                style={{
                  position: "absolute",
                  right: "0",
                  top: "11px",
                  cursor: "pointer",
                }}
              />
            )}
          </div>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          showOutsideDays={true}
          today={date}
          onSelect={(event: any) => {
            const d = formatDate(event);
            event ? setInputValue(d) : setInputValue("");
            handleDateChange && handleDateChange(event);
            setDate(event);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
