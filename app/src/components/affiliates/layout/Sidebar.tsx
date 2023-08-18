import {
  navigationData,
  type NavigationLinkData,
} from "@/components/affiliates/layout/navigation-data";
import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import {
  Menu,
  menuClasses,
  sidebarClasses,
  Sidebar as SideMenu,
} from "react-pro-sidebar";
import DropdownLink from "./DropdownLink";
import SingleLink from "./SingleLink";
import { useTranslation } from "next-i18next";
import { toKey } from "@/components/affiliates/reports/utils";
import { useConfigContext } from "@/components/common/config/config-context";

interface Props {
  isDesktop: boolean;
  collapseShow: boolean;
  tempCollapseShow: boolean;
  setTempCollapseShow: (value: boolean) => void;
}

const renderLink = (
  item: NavigationLinkData,
  index: number,
  isDesktop: boolean,
  setActiveName: React.Dispatch<React.SetStateAction<string>>,
  setDropdown: React.Dispatch<React.SetStateAction<string>>,
  activeName: string,
  dropdown: string,
  collapseShow: boolean,
  setCollapseShow: (value: boolean) => void
) => {
  if (item.type === "single") {
    return (
      <SingleLink
        key={index}
        isDesktop={isDesktop}
        setactiveName={setActiveName}
        setdropdown={setDropdown}
        activeName={activeName}
        collapseShow={collapseShow}
        setCollapseShow={setCollapseShow}
        link={item.link}
        linkName={item.linkName}
      />
    );
  } else if (item.type === "dropdown") {
    return (
      <DropdownLink
        key={index}
        isDesktop={isDesktop}
        setactiveName={setActiveName}
        setCollapseShow={setCollapseShow}
        setdropdown={setDropdown}
        dropdown={dropdown}
        activeName={activeName}
        collapseShow={collapseShow}
        linkName={item.links}
        defaultLink={item.defaultLink}
        dropdownName={item.dropdownName}
        navbarName={item.linkName}
        parentLink={item.parentLink || ""}
      />
    );
  }
};

const Sidebar: React.FC<Props> = ({
  isDesktop,
  collapseShow,
  tempCollapseShow,
  setTempCollapseShow,
}) => {
  const { t } = useTranslation("affiliate");
  const {
    flags: { localDev },
  } = useConfigContext();

  const {
    permissions: { reports },
  } = useConfigContext();

  console.log(`muly:Sidebar`, { reports });

  const navigation = useMemo(
    () =>
      navigationData.map((item) => {
        if (item.type === "dropdown") {
          return {
            ...item,
            linkName: t(`menu.${toKey(item.linkName)}.name`, item.linkName),
            links: item.links
              .filter(({ filter }) => localDev || !filter || reports[filter])
              .map(({ link, name }) => ({
                link,
                name: t(
                  `menu.${toKey(item.linkName)}.items.${toKey(name)}`,
                  name
                ),
              })),
          };
        } else {
          return {
            ...item,
            linkName: t(`menu.${toKey(item.linkName)}`, item.linkName),
          };
        }
      }),
    [t, reports, localDev]
  );

  const [activeName, setActiveName] = React.useState("dashboard");
  const [dropdown, setDropdown] = React.useState("");

  const sidebarClassName = cn(
    tempCollapseShow ? "md:rounded-none" : "",
    "sidebar fixed top-16 left-0 z-20 flex flex-col bg-white transition-all duration-300 dark:bg-gray-900 scrollbar-thin"
  );

  return (
    <div className={sidebarClassName} style={{ height: "calc(100% - 4rem)" }}>
      <div className="flex grow flex-col justify-between overflow-y-auto overflow-x-hidden">
        <div className="scrollbar-thin relative min-h-full space-y-1 overflow-y-auto">
          <SideMenu
            breakPoint="md"
            className="scrollbar-thin pt-16 md:pt-0"
            rootStyles={{
              [`.${sidebarClasses.container}`]: {
                backgroundColor: "#fff",
              },
              ["." + menuClasses.subMenuContent]: {
                width: "315px",
              },
            }}
            width="280px"
          >
            <Menu closeOnClick={true}>
              {navigation.map((item, index) =>
                renderLink(
                  item,
                  index,
                  isDesktop,
                  setActiveName,
                  setDropdown,
                  activeName,
                  dropdown,
                  tempCollapseShow,
                  setTempCollapseShow
                )
              )}
            </Menu>
          </SideMenu>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
