interface SingleLinkData {
  type: "single";
  link: string;
  linkName: string;
}

interface DropdownLinkData {
  type: "dropdown";
  linkName: string;
  dropdownName: string;
  defaultLink: string;
  parentLink?: string;
  links: Array<{ name: string; link: string; filter?: string }>;
}

export type NavigationLinkData = SingleLinkData | DropdownLinkData;

const dev = false;

export const navigationData: NavigationLinkData[] = [
  {
    type: "single",
    link: "dashboard",
    linkName: "Dashboard",
  },
  {
    type: "dropdown",
    linkName: "Marketing Tools",
    dropdownName: "marketing",
    defaultLink: "creative",
    links: [
      { name: "Creative Materials", link: "creative" },
      { name: "Sub Affiliates Creatives", link: "sub" },
    ],
  },
  {
    type: "dropdown",
    linkName: "Reports",
    dropdownName: "reports",
    defaultLink: "quick-summary",
    parentLink: "reports",
    links: [
      {
        name: "Quick Summary Report",
        link: "quick-summary",
        filter: "af-quick",
      },
      {
        name: "Commission Report",
        link: "commission-report",
        filter: "af-comm",
      },
      { name: "Clicks Report", link: "clicks-report" },
      {
        name: "Creative Report",
        link: "creative-report",
        filter: "af-creative",
      },
      { name: "Country Report", link: "country-report", filter: "af-country" },
      {
        name: "Landing Page Report",
        link: "landing-page",
        filter: "af-landing",
      },
      { name: "Users Report", link: "trader-report", filter: "af-trader" },
      {
        name: "Pixels Logs Report",
        link: "pixel-log-report",
        filter: "af-traffic",
      },
      { name: "Install Report", link: "install-reports", filter: "af-install" },
      { name: "Profile Report", link: "profile-report" },
      {
        name: "Sub Affiliates Report",
        link: "sub-affiliate-report",
      },
      ...(dev
        ? [
            {
              name: "Fake Report Server (Debug)",
              link: "fake-server-report",
            },
          ]
        : []),
    ],
  },
  {
    type: "single",
    link: "profiles",
    linkName: "Profiles",
  },
  {
    type: "dropdown",
    linkName: "My Account",
    dropdownName: "myAccount",
    defaultLink: "account",
    links: [
      { name: "Account Details", link: "account" },
      { name: "Payment Method Details", link: "account-payment" },
      { name: "Commission Structure", link: "commissions" },
      { name: "Documents", link: "documents" },
    ],
  },
  {
    type: "single",
    link: "billings",
    linkName: "Billings",
  },
  {
    type: "single",
    link: "pixel-monitor",
    linkName: "Pixel Monitor",
  },
  {
    type: "single",
    link: "support",
    linkName: "Support",
  },
  {
    type: "single",
    link: "announcements",
    linkName: "Announcements",
  },
  {
    type: "single",
    link: "privacy",
    linkName: "Privacy policy",
  },
  {
    type: "single",
    link: "terms",
    linkName: "Terms & Conditions",
  },
];
