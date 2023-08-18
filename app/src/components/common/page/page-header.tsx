import { Breadcrumb } from "@/components/common/page/breadcrumb";
import React from "react";
import { useSearchContext } from "@/components/common/search/search-context";

interface Props {
  title: string;
  subTitle?: string;
  children?: React.ReactNode;
  searchComponent?: React.ReactNode;
}

export const PageHeader = ({
  children,
  title,
  subTitle,
  searchComponent,
}: Props) => {
  const { apply } = useSearchContext();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    apply();
  };

  if (searchComponent) {
    return (
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="mt-3 flex-row items-center justify-between md:flex">
          <Breadcrumb title={title} subTitle={subTitle} />
          <div className="mb-3 flex flex-row gap-2">{children}</div>
        </div>
        {searchComponent}
      </form>
    );
  } else {
    return (
      <form
        className="mt-3 flex-row items-center justify-between md:flex"
        onSubmit={handleSubmit}
      >
        <Breadcrumb title={title} subTitle={subTitle} />
        <div className="mb-3 flex flex-row gap-2">{children}</div>
      </form>
    );
  }
};
