import { CreativeMaterialComponent } from "./CreativeMaterialComponent";
import { CreativeMaterialDialogComponent } from "./CreativeMaterialDialogComponent";
const meta = {
  component: CreativeMaterialComponent,
};

export default meta;

const values = [
  { title: "Creative Name", value: "Logo_1" },
  { title: "Type", value: "image" },
  {
    title: "Promotion",
    value: "0",
  },
  {
    title: "Category",
    value: "Logos",
  },
  { title: "Size (WxH)", value: `301x93` },
  { title: "Language", value: "English" },
];

export const CreativeMaterial = {
  render: () => (
    <CreativeMaterialComponent
      key={1}
      values={values}
      file={
        "https://go.best-brokers-partners.com/files/banners/1497427063z63NI.png"
      }
      alt={"CKcasino Logo"}
      url={"https://ckcasino.com/#/lobby"}
      creative_id={1}
      gridView={true}
    />
  ),
};
export const MaterialDialog = {
  render: () => (
    <CreativeMaterialDialogComponent
      key={1}
      isOpen={true}
      values={values}
      creative_id={1}
      gridView={true}
    />
  ),
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/file/CHxJV6V2o7WVj1rsYmRRWe/Affiliate_client_Design?node-id=161-22504&t=Q2vhI3l6CTB7qwBh-0",
    },
  },
};
