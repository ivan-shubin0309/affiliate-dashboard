import { LoadingIcon } from "@/components/icons";
export const Loading = () => {
  return (
    <div className="absolute left-0 right-0 top-0 flex h-full items-center justify-center md:ml-72">
      <LoadingIcon />
    </div>
  );
};
