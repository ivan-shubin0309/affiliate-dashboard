import { Button } from "@/components/ui/button";
import { useSearchContext } from "@/components/common/search/search-context";

interface Props {
  isLoading: boolean;
}

export const SearchApply = ({ isLoading }: Props) => {
  return (
    <Button
      type="submit"
      variant="primary"
      // onClick={apply}
      isLoading={isLoading}
    >
      Search
    </Button>
  );
};
