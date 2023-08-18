import { type ExportType } from "@/server/api/routers/affiliates/reports/reports-utils";

export const exportOptions: { id: ExportType; title: string }[] = [
  {
    id: "xlsx",
    title: "Excel",
  },
  {
    id: "csv",
    title: "CSV",
  },
  {
    id: "json",
    title: "JSON",
  },
];

export type OnExport = (exportType: ExportType) => Promise<string | undefined>;

// @ts-ignore
export const getColumns = (columns: any[]) =>
  columns.map(({ header, accessorKey }) => ({
    header: String(header),
    accessorKey,
  }));

export const toKey = (key: string) => key.toLowerCase().split(" ").join("_");
