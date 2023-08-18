import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../../ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

import { api } from "@/utils/api";
import { Code2Icon, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { AddDynamicParameter } from "./AddDynamicParameter";

interface Props {
  values: valueProps[];
  file?: string;
  alt?: string;
  url?: string;
  isOpen?: boolean;

  creative_id: number;
  gridView: boolean;
}

interface valueProps {
  title: string;
  value: string | undefined;
}
interface CodeProps {
  code: string;
  directLink: string;
  htmlCode: string;
  qrCode: string;
}

const initialCodeProps: CodeProps = {
  code: "",
  directLink: "",
  htmlCode: "",
  qrCode: "",
};

export const CreativeMaterialDialogComponent = ({
  values,
  file,
  alt,
  url,
  isOpen,
  creative_id,
  gridView,
}: Props) => {
  const { data: profiles } = api.affiliates.getProfiles.useQuery(undefined, {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
  const [params, setParams] = useState<string[]>([""]);
  const [profile_id, setProfile_id] = useState<number>(0);
  const [bannerQueryParams, setBannerQueryParams] = useState({
    creative_id,
    params,
    profile_id,
  });

  const { data: codesValues, isRefetching } =
    api.affiliates.generateBannerCode.useQuery(bannerQueryParams, {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    });

  const handleGetCode = () => {
    setBannerQueryParams({ creative_id, params, profile_id });
  };

  const downloadCode = (
    codesValues: CodeProps | undefined,
    fileType: string
  ): void => {
    let codeValue: string | undefined;
    let fileName: any;

    if (fileType === "html") {
      codeValue = codesValues?.htmlCode;
      fileName = "code.html";
    } else if (fileType === "js") {
      codeValue = codesValues?.code;
      fileName = "code.js";
    } else if (fileType === "directLink") {
      codeValue = codesValues?.directLink;
      fileName = "direct-link.txt";
    } else if (fileType === "qrCode") {
      codeValue = codesValues?.qrCode;
      fileName = "qrcode.png";
    }

    if (codeValue) {
      const link: HTMLAnchorElement = document.createElement("a");
      link.href =
        fileType === "qrCode"
          ? codeValue
          : `data:text/plain;charset=utf-8,${encodeURIComponent(codeValue)}`;
      link.download = fileName;
      link.click();
    }
  };

  return (
    <Dialog open={isOpen}>
      <div className={"mt-4 items-end justify-end md:flex"}>
        <div className="flex items-end justify-center md:justify-end">
          <div className="ml-2">
            <div className="">
              <DialogTrigger>
                <Button variant="primary-outline" className="md:px-4">
                  Get Tracking Code
                  <div className="ml-2 items-center">
                    <Code2Icon className="text-[#282560]" />
                  </div>
                </Button>
              </DialogTrigger>
            </div>
          </div>
        </div>
      </div>
      <DialogContent className="max-h-screen max-w-[90%] overflow-auto sm:max-w-sm md:max-w-6xl md:overflow-hidden">
        <DialogHeader className="text-left text-lg font-medium text-primary">
          Get Tracking Code
        </DialogHeader>
        <form className="w-full pt-5">
          <div className="justify-between md:flex md:space-x-4">
            <div className="w-full md:w-2/4 lg:w-1/4">
              <div className="mb-11 mb-12 h-[calc(100%-43px)] justify-between md:flex md:space-x-4">
                <div className="w-full">
                  <div className="mb-3">
                    <label
                      className="mb-2 block pt-3 text-sm font-medium tracking-wide text-[#525252]"
                      htmlFor="grid-first-name"
                    >
                      Profile
                    </label>
                    <div className="flex">
                      <div className="relative flex w-full items-center overflow-auto">
                        <Select
                          defaultValue={String(profile_id)}
                          onValueChange={(value) => {
                            setProfile_id(Number(value));
                          }}
                        >
                          <SelectTrigger className="border px-4 py-3  text-xs ">
                            <SelectValue placeholder="Select profile" />
                          </SelectTrigger>
                          <SelectContent className="border text-xs">
                            <SelectGroup>
                              {[
                                { name: "Global", url: "", id: 0 },
                                ...(profiles || []),
                              ].map(({ name, url, id }, index) => (
                                <SelectItem value={String(id)} key={id}>
                                  <div className="flex flex-col text-left">
                                    <div>
                                      <b>{name}</b>
                                    </div>
                                    <div>{url}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <label
                      className="mb-2 block text-sm font-medium tracking-wide text-[#525252]"
                      htmlFor="grid-first-name"
                    >
                      Dynamic Parameter
                    </label>
                    <div className="flex flex-wrap">
                      <div className="relative flex w-full flex-wrap items-center justify-between ">
                        <AddDynamicParameter
                          inputValues={params}
                          setInputValues={setParams}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative mb-6 rounded md:mb-0">
                <Button
                  onClick={handleGetCode}
                  variant="primary"
                  className="absolute bottom-0 w-full"
                  isLoading={isRefetching}
                >
                  Get Code
                </Button>
              </div>
            </div>
            <div className="w-full md:w-2/4 lg:w-3/4">
              <div className="h-full">
                <Tabs defaultValue="HtmlCode" className="h-full">
                  <TabsList className="flex-wrap justify-start whitespace-nowrap">
                    <TabsTrigger value="HtmlCode">HTML Code</TabsTrigger>
                    <TabsTrigger value="JSCode">JS Code</TabsTrigger>
                    <TabsTrigger value="QrCode">QR Code</TabsTrigger>
                    <TabsTrigger value="DirectLinkCode">
                      Direct Link Code
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent
                    className="h-full min-h-[380px] border-0 p-0"
                    value="HtmlCode"
                  >
                    <div className="-mx-3 flex h-full flex-wrap">
                      <div className="h-full w-full px-3">
                        <textarea
                          className="border-#D7D7D7 mb-3 h-48 w-full rounded-md border bg-[#F0F9FF] px-4 py-3 text-base font-medium text-[#1B48BB] md:mb-12 md:h-[calc(100%-100px)]"
                          value={codesValues?.htmlCode}
                          id="grid-textarea"
                        />
                      </div>
                      <div className="flex w-full flex-wrap justify-end px-3">
                        <Button
                          className="bottom-6 md:absolute"
                          variant="primary"
                          onClick={() => downloadCode(codesValues, "html")}
                        >
                          Download Html As Text
                          <div className="ml-2">
                            <ImageIcon className="h-4 w-4 text-white" />
                          </div>
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent
                    className="h-full min-h-[380px] border-0 p-0"
                    value="JSCode"
                  >
                    <div className="-mx-3 flex h-full flex-wrap">
                      <div className="h-full w-full px-3">
                        <textarea
                          className="border-#D7D7D7 mb-3 h-48 w-full rounded-md border bg-[#F0F9FF] px-4 py-3 text-base font-medium text-[#1B48BB] md:mb-12 md:h-[calc(100%-100px)]"
                          value={codesValues?.code}
                          id="grid-textarea"
                        />
                      </div>
                      <div className="flex w-full flex-wrap justify-end px-3">
                        <Button
                          className="bottom-6 md:absolute"
                          variant="primary"
                          onClick={() => downloadCode(codesValues, "js")}
                        >
                          Download Js Code As Text
                          <div className="ml-2">
                            <ImageIcon className="h-4 w-4 text-white" />
                          </div>
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent
                    className="h-full min-h-[380px] border-0 p-0"
                    value="QrCode"
                  >
                    <div className="-mx-3 flex h-full flex-wrap">
                      <div className="mb-3 mt-1.5 flex h-48 w-full items-center px-3 md:mb-12 md:h-[calc(100%-100px)]">
                        {codesValues?.qrCode && (
                          <Image
                            className="mx-auto my-0"
                            src={codesValues?.qrCode}
                            height={100}
                            width={200}
                            alt="..."
                          />
                        )}
                      </div>
                      <div className="flex w-full flex-wrap justify-end px-3">
                        <Button
                          className="bottom-6 md:absolute"
                          variant="primary"
                          onClick={() => downloadCode(codesValues, "qrCode")}
                        >
                          Download Qrcode As Image
                          <div className="ml-2">
                            <ImageIcon className="h-4 w-4 text-white" />
                          </div>
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent
                    className="h-full min-h-[380px] border-0 p-0"
                    value="DirectLinkCode"
                  >
                    <div className="-mx-3 flex h-full flex-wrap">
                      <div className="h-full w-full px-3">
                        <textarea
                          className="border-#D7D7D7 mb-3 h-48 w-full rounded-md border bg-[#F0F9FF] px-4 py-3 text-base font-medium text-[#1B48BB] md:mb-12 md:h-[calc(100%-100px)]"
                          value={codesValues?.directLink}
                          id="grid-textarea"
                        />
                      </div>
                      <div className="flex w-full flex-wrap justify-end px-3">
                        <Button
                          className="bottom-6 md:absolute"
                          variant="primary"
                          onClick={() =>
                            downloadCode(codesValues, "directLink")
                          }
                        >
                          Download Direct Link Code As Text
                          <div className="ml-2">
                            <ImageIcon className="h-4 w-4 text-white" />
                          </div>
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>{" "}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
