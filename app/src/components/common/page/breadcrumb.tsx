import { Home } from "lucide-react";

interface Props {
  title: string;
  subTitle?: string;
}

export const Breadcrumb = ({ title, subTitle }: Props) => {
  return (
    <div className="mb-3 flex items-center text-base font-medium">
      <Home />
      <span>&nbsp;/&nbsp;{title}</span>
      {!!subTitle && <span>&nbsp;/&nbsp;{subTitle}</span>}
    </div>
  );
};
