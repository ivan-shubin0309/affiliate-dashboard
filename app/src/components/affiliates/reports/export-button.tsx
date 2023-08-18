import { CSVIcon, ExcelIcon, JSONIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ExportType } from "@/server/api/routers/affiliates/reports/reports-utils";
import JsFileDownloader from "js-file-downloader";
import { useState } from "react";

interface ExportOption {
  id: ExportType;
  title: string;
  icon?: any;
}

interface Props {
  onExport: (exportType: ExportType) => Promise<string | undefined>;
  reportName: string;
}

const exportOptions: { id: ExportType; title: string; icon: any }[] = [
  {
    id: "csv",
    title: "CSV",
    icon: <CSVIcon />,
  },
  {
    id: "xlsx",
    title: "Excel",
    icon: <ExcelIcon />,
  },
  {
    id: "json",
    title: "JSON",
    icon: <JSONIcon />,
  },
];

export const ExportButton = ({ onExport, reportName }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async (id: ExportType) => {
    setIsLoading(true);
    try {
      const link = await onExport(id); // selectedValue.id);
      console.log(`muly:handleExport`, { id, reportName, link });

      if (link) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const download = new JsFileDownloader({
          url: link,
          filename: `${reportName
            .toLocaleLowerCase()
            .replaceAll(" ", "-")}.${id}`,
          autoStart: false,
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await download.start();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderDropdownMenu = (
    options: ExportOption[],
    onExport: Props["onExport"]
  ) => {
    return options.map((option: ExportOption, index: number) => {
      return (
        <DropdownMenuItem
          key={index.toString()}
          onClick={() => handleExport(option.id)}
        >
          {option.icon ?? ""}
          <span className="ml-2">{option.title ?? ""}</span>
        </DropdownMenuItem>
      );
    });
  };

  return (
    <div className="flex flex-row">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button isLoading={isLoading}>Export</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-36">
          {renderDropdownMenu(exportOptions, onExport)}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
