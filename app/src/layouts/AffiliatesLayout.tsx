import type { PropsWithChildren } from "react";
import React, { useState } from "react";
// components
import AffiliateFooter from "@/components/affiliates/layout/AffiliateFooter";
import { SearchProvider } from "@/components/common/search/search-context";
import { cn } from "@/lib/utils";
import AffiliatesNavbar from "../components/affiliates/layout/AffiliatesNavbar";
import Sidebar from "../components/affiliates/layout/Sidebar";
import { useMediaQuery } from "usehooks-ts";

const AffiliatesLayout = ({ children }: PropsWithChildren) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [collapseShow, setCollapseShow] = React.useState(true);
  const [tempCollapseShow, setTempCollapseShow] =
    useState<boolean>(collapseShow);

  const handleChangeCollapseShow = () => {
    //if (desktop) {
    setCollapseShow(!collapseShow);
    //}
    setTempCollapseShow(!collapseShow);
  };

  const maybeSetTempCollapseShow = (value: boolean) => {
    console.log(`muly:maybeSetTempCollapseShow`, {
      collapseShow,
      tempCollapseShow,
    });
    if (!collapseShow && tempCollapseShow !== value) {
      setTempCollapseShow(!tempCollapseShow);
    }
  };

  return (
    <div className="max-w-full">
      <div
        className={
          "bg-blueGray-100 sidebar relative z-10 transition-all duration-300"
        }
      >
        <Sidebar
          isDesktop={isDesktop}
          collapseShow={collapseShow}
          tempCollapseShow={tempCollapseShow}
          setTempCollapseShow={maybeSetTempCollapseShow}
        />
        <AffiliatesNavbar
          isDesktop={isDesktop}
          collapseShow={tempCollapseShow}
          setCollapseShow={handleChangeCollapseShow}
        />

        <SearchProvider>
          <main
            className={cn([
              { "md:ml-72": tempCollapseShow, "md:ml-20": !tempCollapseShow },
              "min-h-[calc(100vh-126px)] bg-[#F5F8FA] px-4 pb-4 md:px-10",
            ])}
          >
            {children}
          </main>
        </SearchProvider>
        <AffiliateFooter />
      </div>
    </div>
  );
};

export default AffiliatesLayout;
