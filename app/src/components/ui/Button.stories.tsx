import { SaveIcon } from "lucide-react";
import { Button } from "./button";

const Buttons = ({ variant }: any) => (
  <div className="flex flex-col items-start gap-8">
    <h3>Check for focus states</h3>
    <Button variant={variant}>Button {variant}</Button>
    <Button variant={variant} disabled>
      Disabled {variant}
    </Button>

    <Button variant={variant} isLoading={true}>
      Button No Width Change
    </Button>
    <Button variant={variant}>Button No Width Change</Button>
  </div>
);

const meta = {
  component: Buttons,
};

export default meta;

export const Primary = {
  args: {
    variant: "primary",
    pseudo: {
      hover: ["#button-hover"],
      focus: ["#button-focus"],
      active: ["#button-active"],
    },
  },
};

export const Text = {
  args: {
    variant: "text",
    pseudo: {
      hover: ["#button-hover"],
      focus: ["#button-focus"],
      active: ["#button-active"],
    },
  },
};

export const PrimaryOutline = {
  ...Primary,
  args: {
    ...Primary.args,
    variant: "primary-outline",
  },
};

export const Secondary = {
  ...Primary,
  args: { ...Primary.args, variant: "secondary" },
};

export const SecondaryOutline = {
  ...Primary,
  args: { ...Primary.args, variant: "secondary-outline" },
};

export const Alternate = {
  ...Primary,
  args: { ...Primary.args, variant: "alternate" },
};

export const Destructive = {
  ...Primary,
  args: { ...Primary.args, variant: "destructive" },
};

export const outline = {
  ...Primary,
  args: { ...Primary.args, variant: "outline" },
};

export const ghost = {
  ...Primary,
  args: { ...Primary.args, variant: "ghost" },
};

export const link = {
  ...Primary,
  args: { ...Primary.args, variant: "link" },
};

export const sizeRect = {
  render: () => (
    <div className="flex flex-row gap-2">
      <Button>Normal</Button>
      <Button size="rec">
        <SaveIcon className="w-4" />
      </Button>
      <Button size="rec" isLoading={true}>
        <SaveIcon className="w-4" />
      </Button>
      <Button size="rec" variant="secondary">
        <SaveIcon className="w-4" />
      </Button>
    </div>
  ),
};
