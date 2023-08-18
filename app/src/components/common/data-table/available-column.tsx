import { Check, X } from "lucide-react";
import { format } from "date-fns";

interface Props {
  value: boolean | null | undefined;
}

export const AvailableColumn = ({ value }: Props) => {
  return value ? (
    <div className="flex justify-center text-center">
      <Check className="h-5 w-5" color="#50B8B6" />
    </div>
  ) : (
    <div className="flex justify-center text-center">
      <X className="h-5 w-5" color="#FE6969" />
    </div>
  );
};

export const DateColumn = (date: Date | null | undefined) => {
  return date ? format(date, "yyyy-MM-dd kk:mm:ss") : "";
};
