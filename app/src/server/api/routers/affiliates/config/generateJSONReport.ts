import type { ColumnsType } from "@/server/api/routers/affiliates/reports/reports-utils";
import fs from "fs";

export const generateJSONReport = (
  columns: ColumnsType[],
  data: any[],
  localFileName: string
) => {
  data.forEach((row) => {
    fs.appendFileSync(localFileName, JSON.stringify(row));
    fs.appendFileSync(localFileName, "\n");
  });
};
