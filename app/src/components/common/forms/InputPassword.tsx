import { useMetaEx, useTsController } from "@/components/libs/react-ts-form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface Props {
  type: string;
}

export const InputPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { field, error, formContext } = useTsController<string>();
  const { placeholder } = useMetaEx();

  return (
    <div className="flex flex-row items-center">
      <Input
        error={error}
        name={field.name}
        id={field.name}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={field.value ? field.value + "" : ""}
        onChange={(e) => {
          field.onChange(e.target.value);
        }}
        className="pr-10"
      />
      <label
        onClick={() => setShowPassword(!showPassword)}
        className="m-[-2rem]"
        htmlFor="toggle"
      >
        {showPassword ? (
          <Eye className="h-5 w-5" />
        ) : (
          <EyeOff className="h-5 w-5" />
        )}
      </label>
    </div>
  );
};
