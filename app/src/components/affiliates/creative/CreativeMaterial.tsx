import { Loading } from "@/components/common/Loading";
import { usePagination } from "@/components/common/data-table/pagination-hook";
import { PageHeader } from "@/components/common/page/page-header";
import { SearchApply } from "@/components/common/search/saerch-apply-button";
import { useSearchContext } from "@/components/common/search/search-context";
import { SearchSelect } from "@/components/common/search/search-select";
import { SearchText } from "@/components/common/search/search-text";
import { Pagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import type { MerchantCreativeType } from "@/server/db-types";
import React from "react";
import { api } from "../../../utils/api";
import { CreativeMaterialComponent } from "./CreativeMaterialComponent";
import { IconMenuRadioGroup } from "../../common/controls/IconMenuRadioGroup";

const renderRow = (item: MerchantCreativeType, gridView: boolean) => {
  const values = [
    // { title: "Id", value: item.id },
    { title: "Creative Name", value: item.title },
    { title: "Type", value: item.type },
    {
      title: "Promotion",
      value: String(item.promotion_id) || "General",
    },
    {
      title: "Category",
      value: item.category?.categoryname,
    },
    { title: "Size (WxH)", value: `${item.width}x${item.height}` },
    { title: "Language", value: item.language?.title },
  ];
  return (
    <CreativeMaterialComponent
      key={item.id}
      values={values}
      file={item.file || undefined}
      alt={item.alt}
      url={item.directLink}
      creative_id={item.id}
      gridView={gridView}
    />
  );
};

export const CreativeMaterial = () => {
  const {
    values: { creative: search, type, category, language, size, promotion },
  } = useSearchContext();
  const pagination = usePagination(12);

  const [gridView, setGridView] = React.useState(true);

  const { data: meta } = api.affiliates.getMerchantCreativeMeta.useQuery(
    undefined,
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const { data: creativeReport, isRefetching } =
    api.affiliates.getMerchantCreative.useQuery(
      {
        type: type ? String(type) : undefined,
        category: category ? Number(category) : undefined,
        language: language ? Number(language) : undefined,
        size: size ? String(size) : undefined,
        promotion: promotion ? Number(promotion) : undefined,
        search: search ? String(search) : undefined,
        pageParams: pagination.pageParams,
      },
      { keepPreviousData: true, refetchOnWindowFocus: false }
    );

  console.log("creativeReport*********", creativeReport);

  const handleChangeGridView = () => {
    setGridView(!gridView);
  };

  return creativeReport ? (
    <div className="w-full">
      <PageHeader
        title="Marketing Tools"
        subTitle="Creative Materials"
        searchComponent={
          <div className="flex flex-row flex-wrap items-end gap-2 pb-3">
            <SearchSelect
              label="Creative Type"
              varName="type"
              choices={meta?.type}
            />
            <SearchSelect
              label="Category"
              varName="category"
              choices={meta?.merchants_creative_categories}
            />
            <SearchSelect
              label="Language"
              varName="language"
              choices={meta?.language}
            />
            <SearchSelect label="Size" varName="size" choices={meta?.size} />
            <SearchSelect
              label="Promotion"
              varName="promotion"
              emptyTitle="General"
              choices={meta?.merchants_promotions}
            />
            <div className="flex-grow" />
            <SearchText varName="creative" />
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
          "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ": gridView,
        })}
      >
        {creativeReport.data.map((item) => renderRow(item, gridView))}
      </div>
      <Pagination
        pagination={pagination}
        totalItems={creativeReport.pageInfo.totalItems}
      />
    </div>
  ) : (
    <Loading />
  );
};
