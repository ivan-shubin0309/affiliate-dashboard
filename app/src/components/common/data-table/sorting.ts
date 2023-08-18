import type { ColumnSort } from "@tanstack/react-table";

export const serializeSorting = (sorting: ColumnSort[]) => {
  return sorting.map(({ id, desc }) => `${desc ? "-" : ""}${id}`).join(",");
};
export const deserializeSorting = (sort_string?: string): ColumnSort[] => {
  const sortingArray = sort_string?.split(",").map((sortInfo) => {
    const [desc, id] = sortInfo.startsWith("-")
      ? [true, sortInfo.substring(1)]
      : [false, sortInfo];

    return { id, desc };
  });

  return (
    (sortingArray
      ?.filter(({ id }) => id !== "")
      .filter(Boolean) as ColumnSort[]) || []
  );
};
