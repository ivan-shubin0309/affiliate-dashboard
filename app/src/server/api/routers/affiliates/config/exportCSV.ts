import type { ColumnsType } from "@/server/api/routers/affiliates/reports/reports-utils";
import fs from "fs";
import { Parser } from "json2csv";

export const generateCSVReport = (
  columns: ColumnsType[],
  data: any[],
  fileName: string
) => {
  const parser = new Parser({
    fields: columns.map(({ header, accessorKey }) => ({
      label: header,
      value: accessorKey,
    })),
  });
  const csv = parser.parse(data);

  fs.writeFile(fileName, csv, function (err) {
    if (err) throw err;
    console.log("file saved");
  });
};
