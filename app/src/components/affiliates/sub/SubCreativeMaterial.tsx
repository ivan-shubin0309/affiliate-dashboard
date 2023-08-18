import { Loading } from "@/components/common/Loading";
import { usePagination } from "@/components/common/data-table/pagination-hook";
import { PageHeader } from "@/components/common/page/page-header";
import { SearchApply } from "@/components/common/search/saerch-apply-button";
import { useSearchContext } from "@/components/common/search/search-context";
import { Pagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import type { MerchantSubCreativeType } from "@/server/db-types";
import React from "react";
import { api } from "../../../utils/api";
import { SearchSelect } from "../../common/search/search-select";
import { SearchText } from "../../common/search/search-text";
import { CreativeMaterialComponent } from "../creative/CreativeMaterialComponent";
import { IconMenuRadioGroup } from "../../common/controls/IconMenuRadioGroup";

const renderRow = (item: MerchantSubCreativeType, gridView: boolean) => {
  const values = [
    { title: "Creative Name", value: item.title },
    { title: "Format", value: item.type },
    {
      title: "Landing URL",
      value: String(item.promotion_id) || "General",
    },
    { title: "Size (WxH)", value: `${item.width}x${item.height}` },
    { title: "Impressions", value: `${String(item.views)}` },
    { title: "Clicks", value: `${String(item.clicks)}` },
  ];

  return (
    <CreativeMaterialComponent
      key={item.id}
      values={values}
      file={item.file}
      alt={item.alt}
      url={item.url}
      creative_id={item.id}
      gridView={gridView}
    />
  );
};

export const SubCreativeMaterial = () => {
  const {
    values: { creative: search, type },
  } = useSearchContext();
  const pagination = usePagination();

  const [gridView, setGridView] = React.useState(true);

  const { data: meta } = api.affiliates.getMerchantSubCreativeMeta.useQuery();

  const { data: subCreativeReport, isRefetching } =
    api.affiliates.getMerchantSubCreative.useQuery(
      {
        type: type ? String(type) : undefined,
        search: search ? String(search) : undefined,
        pageParams: pagination.pageParams,
      },
      { keepPreviousData: true }
    );

  const handleChangeGridView = () => {
    setGridView(!gridView);
  };
  console.log("********subCreativeReport: ", subCreativeReport);
  return subCreativeReport ? (
    <div className="w-full">
      <PageHeader
        title="Marketing Tools"
        subTitle="Sub Creative Materials"
        searchComponent={
          <div className="flex flex-row flex-wrap items-end gap-2 pb-3">
            <SearchSelect
              label="Creative Type"
              varName="type"
              choices={meta?.type}
            />
            <div className="flex-grow" />
            <SearchText varName="search" />
            <SearchApply isLoading={isRefetching} />
          </div>
        }
      >
        <IconMenuRadioGroup
          gridView={gridView}
          onGridViewChange={setGridView}
        />
      </PageHeader>
      <div
        className={cn("grid grid-cols-1 gap-4", {
          "md:grid-cols-2 lg:grid-cols-4": gridView,
        })}
      >
        {subCreativeReport.data.map((item) => renderRow(item, gridView))}
      </div>
      <Pagination
        pagination={pagination}
        totalItems={subCreativeReport.pageInfo.totalItems}
      />
    </div>
  ) : (
    <Loading />
  );
};
