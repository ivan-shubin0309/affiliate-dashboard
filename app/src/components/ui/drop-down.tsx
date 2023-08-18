import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "./button";

import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

export interface ItemProps {
  id?: string;
  title?: string;
}

const DropdownButton = () => {
  const [selectedValue, setSelectedItem] = useState<ItemProps>({});

  const options = [
    {
      id: "excel",
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

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="primary-outline">
          Export{" "}
          {Object.keys(selectedValue).length > 0
            ? ` ${selectedValue.title}`
            : ``}{" "}
          <ChevronDownIcon className="ml-10" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade min-w-[220px] rounded-md bg-white p-[10px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform]"
          sideOffset={5}
          onChange={(event) => {
            console.log(event);
          }}
        >
          {options.map((item) => {
            return (
              <DropdownMenu.Item
                key={item.id}
                onSelect={() => setSelectedItem(item)}
                className="text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[2px] py-5 pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none"
              >
                {item.title}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export { DropdownButton };
