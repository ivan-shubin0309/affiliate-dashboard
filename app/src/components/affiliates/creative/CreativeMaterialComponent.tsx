import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import JsFileDownloader from "js-file-downloader";
import { Copy, Download, Image as ImageIcon } from "lucide-react";
import React from "react";
import { CreativeMaterialDialogComponent } from "./CreativeMaterialDialogComponent";

interface Props {
  values: valueProps[];
  file?: string;
  alt: string;
  url: string;
  gridView: boolean;
  creative_id: number;
}

interface valueProps {
  title: string;
  value: string | undefined;
}

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
}

export const CreativeMaterialComponent = ({
  values,
  file,
  alt,
  url,
  gridView,
  creative_id,
}: Props) => {
  const { toast } = useToast();

  const [imagePlaceHolder, setImagePlaceHolder] = React.useState(false);

  const ImageWithFallback = ({ src, alt }: ImageWithFallbackProps) => {
    const handleImageError = (): void => {
      setImagePlaceHolder(true);
    };

    return imagePlaceHolder || !src ? (
      <ImageIcon
        color="#2262C6"
        size={256}
        className="mx-auto my-0 max-h-64 w-full rounded-xl bg-cover opacity-40"
      />
    ) : (
      <img
        src={src}
        alt={alt}
        onError={handleImageError}
        className="mx-auto my-0 max-h-64 rounded-xl bg-cover"
      />
    );
  };

  const onCopyClickUrl = async () => {
    await window.navigator.clipboard.writeText(url ?? "");
    toast({
      title: "URL Copied to Clipboard",
      // description: "URL Copied to Clipboard! 📋",
      // status: "success",
      duration: 5000,
      // isClosable: true,
    });
  };

  const handleDownload = async () => {
    const imageUrl = file ? file : "";
    const download = new JsFileDownloader({
      url: imageUrl,
      autoStart: false,
    });
    await download.start();
  };

  return (
    <div className="mb-5 rounded-xl bg-white p-4 shadow">
      <div
        className={
          "items-start " +
          (gridView
            ? "md:grid md:grid-cols-1"
            : "md:grid md:grid-cols-3 md:gap-4")
        }
      >
        <div className="relative mx-auto mb-5 flex h-64 w-full items-center rounded-xl">
          <ImageWithFallback src={file} alt={alt} />
          {!imagePlaceHolder && file && (
            <div className="absolute right-0 top-0">
              <Button
                variant="primary-outline"
                className="bg-white"
                size="rec"
                onClick={handleDownload}
              >
                <Download className="w-4" />
              </Button>
            </div>
          )}
        </div>
        <div className="col-span-2 w-full rounded-xl">
          <div className=" bg-[#F5F8FA] p-4 md:px-8">
            <div className="justify-between md:flex">
              <div className="mt-2 flex justify-between truncate md:block">
                <label className="mb-1 block truncate text-sm font-bold text-gray-700">
                  {values[0]?.title}
                </label>
                <div className="truncate text-sm text-[#353535] md:text-base">
                  {values[0]?.value}
                </div>
              </div>
              <div className="mt-2 flex min-w-[48px] justify-between md:block">
                <div>
                  <label className="mb-1 block truncate text-sm font-bold text-gray-700">
                    {values[1]?.title}
                  </label>
                  <div className="truncate text-sm text-[#353535] md:text-base">
                    {values[1]?.value}
                  </div>
                </div>
                <div className="truncate md:hidden">
                  <label className="mb-1 block truncate text-sm font-bold text-gray-700">
                    {values[2]?.title}
                  </label>
                  <div className="truncate text-sm text-[#353535] md:text-base">
                    {values[2]?.value}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex md:pt-4">
              <div className="mt-2 truncate">
                <label className="mb-1 block text-sm font-bold text-gray-700">
                  URL
                </label>
                <div className="truncate text-sm text-[#353535] md:text-base">
                  {url}
                </div>
              </div>
              <div className="ml-5 mt-2">
                <Button
                  variant="primary-outline"
                  size="rec"
                  onClick={onCopyClickUrl}
                >
                  <Copy className="w-4" />
                </Button>
              </div>
            </div>

            <div
              className={
                "justify-between pt-1 md:pt-4 " +
                (gridView ? "grid grid-cols-1" : " lg:flex ")
              }
            >
              <div className="mt-2 hidden truncate md:block">
                <label className="mb-1 block truncate text-sm font-bold text-gray-700">
                  {values[2]?.title}
                </label>
                <div className="truncate text-sm text-[#353535] md:text-base">
                  {values[2]?.value}
                </div>
              </div>
              <div className="mt-2 truncate">
                <label className="mb-1 block truncate text-sm font-bold text-gray-700">
                  {values[3]?.title}
                </label>
                <div className="truncate text-sm text-[#353535] md:text-base">
                  {values[3]?.value}
                </div>
              </div>
              <div className="mt-2 flex justify-between truncate md:block">
                <div>
                  <label className="mb-1 block truncate text-sm font-bold text-gray-700">
                    {values[4]?.title}
                  </label>
                  <div className="truncate text-sm text-[#353535] md:text-base">
                    {!values[4]?.value ? values[4]?.value : 0}
                  </div>
                </div>
                <div className="truncate md:hidden">
                  <label className="mb-1 block truncate text-sm font-bold text-gray-700">
                    {values[5]?.title}
                  </label>
                  <div className="truncate text-sm text-[#353535] md:text-base">
                    {values[5]?.value}
                  </div>
                </div>
              </div>
              <div className="mt-2 hidden truncate md:block">
                <label className="mb-1 block truncate text-sm font-bold text-gray-700">
                  {values[5]?.title}
                </label>
                <div className="truncate text-sm text-[#353535] md:text-base">
                  {values[5]?.value}
                </div>
              </div>
            </div>
          </div>
          <CreativeMaterialDialogComponent
            values={values}
            url={url}
            creative_id={creative_id}
            gridView={gridView}
          />
        </div>
      </div>

      {/*<div className="mt-1 items-end md:mt-3 md:hidden">*/}
      {/*  <div className="">*/}
      {/*    <div className="mb-1 ml-2 text-xs font-medium text-[#525252]">*/}
      {/*      Click URL*/}
      {/*    </div>*/}
      {/*    <div className="rounded border border-[#D7D7D7] bg-[#F9F9FF] px-3 py-2 text-sm font-medium text-[#666666] lg:w-96">*/}
      {/*      {url}*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className="mt-5 flex items-end justify-center md:justify-end">*/}
      {/*    <div className="">*/}
      {/*      <div>*/}
      {/*        <Button*/}
      {/*          className="text-xs"*/}
      {/*          variant="primary"*/}
      {/*          size="sm"*/}
      {/*          onClick={() => window.navigator.clipboard.writeText(url ?? "")}*/}
      {/*        >*/}
      {/*          Copy Click Url*/}
      {/*          <div className="ml-2 items-center">*/}
      {/*            <Copy className="h-4 w-4" />*/}
      {/*          </div>*/}
      {/*        </Button>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*    <div className="ml-2">*/}
      {/*      <div>*/}
      {/*        <Button variant="primary-outline" size="sm" className="text-xs">*/}
      {/*          Get HTML Code*/}
      {/*          <div className="ml-2 items-center">*/}
      {/*            <Code2Icon className="h-4  w-4 text-[#282560]" />*/}
      {/*          </div>*/}
      {/*        </Button>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
};
