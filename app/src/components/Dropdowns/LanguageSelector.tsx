import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Flags from "country-flag-icons/react/3x2";

export interface LanguageOption {
  title: string;
  icon: string;
  language: string;
}

interface Props {
  options: LanguageOption[];
  language: string;
  onLanguageChange: (language: string) => void;
}

const renderSelectedOption = (selectedOption: LanguageOption) => {
  const SelectedFlag =
    Flags[(selectedOption.icon ?? "US").toUpperCase() as keyof typeof Flags];

  return (
    <>
      <SelectedFlag className="mr-2 h-7 w-7" />
      <span className="pl-2 font-semibold text-[#303134]">
        {selectedOption.title}
      </span>
    </>
  );
};

const renderDropdownMenu = (
  options: LanguageOption[],
  onLanguageChange: Props["onLanguageChange"]
) => {
  return options.map((option: LanguageOption, index: number) => {
    const FlagComponent =
      Flags[option.icon.toUpperCase() as keyof typeof Flags];

    return (
      <DropdownMenuItem
        key={index.toString()}
        onClick={() => onLanguageChange(option.language)}
      >
        <FlagComponent className="mr-2 h-5 w-5" />
        <span className="pl-2 font-semibold text-[#303134]">
          {option.title ?? ""}
        </span>
      </DropdownMenuItem>
    );
  });
};

export const LanguageSelector = ({
  options,
  language,
  onLanguageChange,
}: Props) => {
  const selected =
    options.find((item) => item.language === language) || options[0]!;

  return (
    <>
      <div className="text-blueGray-500 block md:pr-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"sm"} className="px-2 md:px-3" variant="ghost">
              {renderSelectedOption(selected)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            {renderDropdownMenu(options, onLanguageChange)}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
