import AffiliateFooterComponent from "@/components/affiliates/layout/AffiliateFooter";
import AffiliatesNavbar from "@/components/affiliates/layout/AffiliatesNavbar";
import Sidebar from "@/components/affiliates/layout/Sidebar";
import AuthenticationFooterComponent from "@/components/common/footer/AuthenticationFooter";
import { useRef, useState } from "react";

const meta = {
  component: AuthenticationFooterComponent,
};

export default meta;

export const AuthenticationFooter = {
  render: () => <AuthenticationFooterComponent />,
};

export const AffiliateFooter = {
  render: () => <AffiliateFooterComponent />,
};

const SidebarTest = (props: any) => {
  const collapseShow = props.open;
  const [tempCollapseShow, setTempCollapseShow] = useState<boolean>(props.open);

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
    <Sidebar
      isDesktop={true}
      collapseShow={props.open}
      tempCollapseShow={tempCollapseShow}
      setTempCollapseShow={maybeSetTempCollapseShow}
    />
  );
};

export const SidebarOpen = {
  render: () => <SidebarTest open={true} />,
};

export const SidebarCollapse = {
  render: () => <SidebarTest open={false} />,
};

const NavbarTest = (props: any) => {
  const [collapseShow, setCollapseShow] = useState<boolean>(props.open);
  const navbarRef = useRef<HTMLDivElement>(null);
  return (
    <AffiliatesNavbar
      isDesktop={true}
      collapseShow={collapseShow}
      setCollapseShow={setCollapseShow}
    />
  );
};

export const NavbarOpen = {
  render: () => <NavbarTest open={true} />,
};

export const NavbarCollapse = {
  render: () => <NavbarTest open={false} />,
};
