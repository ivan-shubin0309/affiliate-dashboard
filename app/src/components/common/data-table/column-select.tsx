import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import type { ColumnDef } from "@tanstack/react-table";
import { SaveIcon } from "lucide-react";
import { useRef, useState } from "react";
export type SelectedColumnList = Record<string, boolean>;

type ExtendedColumnDef<T, U> = ColumnDef<T, U> & {
  title?: string;
};

interface Props<Data extends object> {
  reportsColumns?: string[];
  reportName: string;
  columns: ExtendedColumnDef<any, any>[];
  selectColumnsMode: SelectedColumnList | null;
  setSelectColumnsMode: (selectedStatus: SelectedColumnList | null) => void;
  btnText?: string;
}

export const ColumnSelect = <Data extends object>({
  reportsColumns,
  columns,
  setSelectColumnsMode,
  reportName,
  selectColumnsMode,
  btnText,
}: Props<Data>) => {
  // console.log(`muly:ColumnSelect`, {
  //   reportsColumns,
  //   columns,
  //   setSelectColumnsMode,
  //   reportName,
  //   selectColumnsMode,
  //   btnText,
  // });

  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const upsertReportsColumns =
    api.affiliates.upsertReportsColumns.useMutation();

  const apiContext = api.useContext();

  const handleSelectMode = async () => {
    if (!selectColumnsMode) {
      /// reverse logic
      const selected: SelectedColumnList = {};
      columns.forEach((item) => {
        const name = String(item.id);
        const exclude = reportsColumns?.includes(name);
        selected[name] = !exclude;
      });
      setSelectColumnsMode(selected);
    } else {
      setIsLoading(true);
      try {
        const excludedFields: string[] = [];
        Object.keys(selectColumnsMode).forEach((name) => {
          if (!selectColumnsMode[name]) {
            excludedFields.push(name);
          }
        });
        const columns = await upsertReportsColumns.mutateAsync({
          level: "affiliate",
          report: reportName,
          fields: excludedFields,
        });

        apiContext.affiliates.getReportsColumns.setData(
          { level: "affiliate", report: reportName },
          columns
        );
        setSelectColumnsMode(null);
        toast({
          title: "Saved " + reportName + " Setup",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleColumnChange = (fieldName: string, checked: boolean) => {
    console.log(`muly:handleColumnChange , ${fieldName}`, {});
    if (selectColumnsMode) {
      setSelectColumnsMode({
        ...(selectColumnsMode ?? {}),
        [fieldName]: checked,
      });
    }
  };

  console.log(`muly:ColumnSelect`, {
    selectColumnsMode,
    reportsColumns,
    columns,
  });

  return (
    <div
      ref={elementRef}
      className={cn(
        "mt-4 overflow-auto bg-white shadow-md transition-all duration-500",
        { "p-4": !!selectColumnsMode },
        { "h-0": !selectColumnsMode }
      )}
    >
      <div className="grid auto-cols-min grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {columns.map((item) => {
          const name = String(item.id);
          return (
            <div key={name}>
              <div className="flex items-center space-x-2">
                <Checkbox
                  className="h-[18px] w-[18px] whitespace-nowrap"
                  id={name}
                  name={name}
                  checked={!!selectColumnsMode && !!selectColumnsMode[name]}
                  onCheckedChange={(checked: boolean) => {
                    handleColumnChange(name, checked);
                  }}
                />
                <label
                  htmlFor={name}
                  className="cursor-pointer whitespace-nowrap text-sm font-medium leading-none"
                >
                  {item?.title ? item.title : name}
                </label>
              </div>
            </div>
          );
        })}
      </div>
      <div className={"mt-8 items-end justify-end md:flex"}>
        <div className="flex items-end justify-center md:justify-end">
          <div className="ml-2">
            <Button
              variant="primary"
              size="rec"
              onClick={handleSelectMode}
              isLoading={isLoading}
            >
              {btnText && <span className="mr-2">{btnText}</span>}
              <SaveIcon className="w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getColumnsBySetup = <Data,>(
  columns: ColumnDef<Data, any>[],
  reportsColumns?: string[]
): ColumnDef<Data, any>[] => {
  if (!columns || !columns.length || !columns[0]) return [];

  const filteredColumns = columns.filter(
    ({ id }) => !reportsColumns?.includes(String(id || ""))
  );

  return filteredColumns.length ? filteredColumns : [columns[0]];
};
