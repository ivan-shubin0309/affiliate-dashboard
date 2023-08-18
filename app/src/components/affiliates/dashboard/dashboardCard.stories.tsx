import DashboardCards from "./DashboardCards";

const meta = {
  component: DashboardCards,
};

export default meta;

export const Primary = {
  args: {
    idx: 0,
    item: {
      id: 0,
      title: "title",
      value: "RealAccount",
      isChecked: false,
    },
    title: "Title",
    thisMonth: 212000,
    lastMonth: 40000,
    value: 23000,
    upDown: true,
    chartValues: [10, 10, 4, 5, 2, 3],
    selectColumnsMode: false,
    isChecked: false,
    handleCheckboxChange: (id: any, checkedStatus: boolean) => {
      console.log(`muly:handleCheckboxChange`, {});
    },
  },
  render: (args: any) => (
    <div className="max-w-sm">
      <DashboardCards {...args} />
    </div>
  ),
};

export const LargeNumbers = {
  ...Primary,
  args: {
    ...Primary.args,
    thisMonth: 2_125_464,
    lastMonth: 12_125_464,
    upDown: false,
    value: 125_464,
  },
};

export const LargeNumbers2 = {
  ...Primary,
  args: {
    ...Primary.args,
    thisMonth: 200_125_464,
    lastMonth: 12_125_464,
    value: 125_464,
    upDown: null,
  },
};

export const test0 = {
  ...Primary,
  args: {
    ...Primary.args,
    thisMonth: 0.5,
    lastMonth: 0.46585,
    value: 0.513232,
  },
};

export const test1 = {
  ...Primary,
  args: {
    ...Primary.args,
    thisMonth: 1,
    lastMonth: 1.67667,
    value: 1.427474,
  },
};

export const test10 = {
  ...Primary,
  args: {
    ...Primary.args,
    thisMonth: 10.47328947239,
    lastMonth: 11.23636,
    value: 9.64646,
  },
};

export const test1000 = {
  ...Primary,
  args: {
    ...Primary.args,
    thisMonth: 999.747744,
    lastMonth: 1000,
    value: 1227.327732,
  },
};
