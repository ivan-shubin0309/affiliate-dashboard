import { Bell } from "lucide-react";
import React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const NotificationDropDown = () => {
  return (
    <>
      <div className="border-blueGray-100 h-10 border border-solid md:mx-1" />

      <Popover>
        <PopoverTrigger>
          <a className="text-blueGray-500 block px-1 md:px-4" href="#pablo">
            <div className="flex items-center">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm text-white">
                <Bell className="h-6 w-6" color="#303134" />
              </span>
            </div>
          </a>
        </PopoverTrigger>
        <PopoverContent
          className={
            "min-w-56 z-50 float-left list-none rounded bg-white py-2 text-left text-base shadow-lg"
          }
        >
          <div className="w-60 px-4 py-2 text-sm font-normal">
            <p className="text-black">
              You got comission{" "}
              <span className="font-medium text-[#2262C6]">$ 1,521</span>
            </p>
            <p className="mt-1 text-[#757575]">22 Feb 2023</p>
          </div>
          <div className="w-60 px-4 py-2 text-sm font-normal">
            <p className="text-black">
              You got comission{" "}
              <span className="font-medium text-[#2262C6]">$ 1,521</span>
            </p>
            <p className="mt-1 text-[#757575]">22 Feb 2023</p>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default NotificationDropDown;
