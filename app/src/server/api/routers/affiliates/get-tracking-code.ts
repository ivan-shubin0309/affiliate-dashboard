// NO  FocusOption/FocusOption-main/site/affiliate/common/getTrackingCode.php
// YES FocusOption/FocusOption-main/site/common/creatives/edit_banner.php

import type { PrismaClient } from "@prisma/client";
import { getConfig } from "@/server/get-config";
import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import QRCode from "qrcode";
import { checkIsUser } from "@/server/api/utils";

const Input = z.object({
  creative_id: z.number(),
  profile_id: z.number().nullish(),
  params: z.array(z.string()),
});

const BannerCode = z.object({
  htmlCode: z.string(),
  code: z.string(),
  // preview: z.string(),
  directLink: z.string(),
  // facebookCode: z.string(),
  qrCode: z.string(),
});

const _generateBannerCode = async (
  affiliate_id: number,
  creativeType: "product" | "creative",
  creative_id: number,
  profile_id: number | undefined,
  params: string[],
  // typeURL: number,
  prisma: PrismaClient
): Promise<z.infer<typeof BannerCode>> => {
  function getCodeTypeLink(link: string) {
    return `<!-- ${webTitle} Affiliate Code -->
<a href="${link}" target="_blank">${ww.title}</a>
<!-- // ${webTitle} Affiliate Code -->`;
  }

  function getCodeWidget() {
    return `<!-- ${webTitle} Affiliate Code -->
<iframe frameborder="0" src="${webAddress}view.php?ctag=${tag}" style="width: ${ww.width}px; height: ${ww.height}px;" scrolling="no"></iframe>
<!-- // ${webTitle} Affiliate Code -->`;
  }

  function getCodeScript(link: string) {
    return `<!-- ${webTitle} Affiliate Code -->
<iframe src="${link}" width="${ww.width}" height="${ww.height}" frameborder="0" scrolling="no"></iframe>
<!-- // ${webTitle} Affiliate Code -->`;
  }

  function getCodeEmail() {
    return `<!-- ${webTitle} Affiliate Code -->
<!-- // ${webTitle} Affiliate Code -->`;
  }

  function getCodeOther(link: string) {
    return `<!-- ${webTitle} Affiliate Code -->
<div id="containerSWF">
  <script type= "text/javascript" language="javascript" src="${link}"></script>
</div>
<script type="text/javascript">
  var _object = document.querySelector("#containerSWF OBJECT");
  _object.onmousedown = function() {
    document.location.href = "${webAddress}click.php?ctag=${tag}";
  };
</script>
<!-- // ${webTitle} Affiliate Code -->`;
  }

  function getPreviewOther() {
    return `
<div class="outerBox_preview">
  <div class="wrapper_preview">
    <img class="popupTrackingWindowImg" src="${ww.file}" alt="" />
  </div>
</div>
`;
  }

  const { legacy_host, webTitle } = await getConfig(prisma);
  const webAddress = `${legacy_host}/`;

  // const getFacebookPixel = async () => {
  //   let fullurl = `${webAddress}facebookshare.php?brand=${encodeURIComponent(
  //     merchantww.name
  //   )}&name=${encodeURIComponent(ww.title)}&image=${encodeURIComponent(
  //     ww.file
  //   )}&url=${encodeURIComponent(
  //     link.replace("ad.g", "click.php")
  //   )}&date=${encodeURIComponent(
  //     ww.last_update.getTime()
  //   )}&pta=${encodeURIComponent(Date.now())}`;
  //
  //   const url = await urlToShortCode(prisma, fullurl);
  //   let dispShorterLink = 0;
  //
  //   if (url.length > 0) {
  //     fullurl = `${
  //       env.LEGACY_PHP_URL
  //     }/facebookshare.php?q=${url}&pta=${encodeURIComponent(Date.now())}`;
  //     dispShorterLink = 1;
  //   }
  //
  //   const includeTmp = ww.file.includes("/tmp");
  //   let code = "";
  //   if (includeTmp) {
  //     code = "";
  //   } else if (dispShorterLink === 0) {
  //     code = `${webAddress}facebookshare.php?brand=${encodeURIComponent(
  //       merchantww.name
  //     )}&name=${encodeURIComponent(ww.title)}&image=${encodeURIComponent(
  //       ww.file
  //     )}&url=${encodeURIComponent(
  //       link.replace("ad.g", "click.php")
  //     )}&date=${encodeURIComponent(
  //       ww.last_update.getTime()
  //     )}&pta=${encodeURIComponent(Date.now())}`;
  //   } else {
  //     code = fullurl;
  //   }
  //
  //   return code;
  // };

  const generateQRCode = async (link: string): Promise<string> => {
    if (
      // set.qrcode &&
      (ww.type.includes("link") || ww.type.includes("image")) &&
      ww.file &&
      affiliate_id
    ) {
      // generateQRCode from link
      return await QRCode.toDataURL(link);
      // const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, "");
      //
      // fs.writeFileSync(qrCodeFilePath, base64Data, "base64");
      //
      // const file = `${webAddress}${qrImagePath}qrcode.png`;
      // this.set.content += `<br><div style="vertical-align:top">${lang(
      //   "QR Code"
      // )}:&nbsp;${
      //   ww.file.includes("/tmp") ? "" : `<img src="${file}" />`
      // }</div>`;
    }
    return "";
  };

  if (creativeType === "product") {
    // $appTable = 'products_items';
    // $creativetype = "product";
    // ww = await dbGet(creative_id, "merchants_creative");
    throw new Error("Not implemented");
  }

  const ww = await prisma.merchants_creative.findUniqueOrThrow({
    where: { id: creative_id },
  });

  const merchantww = await prisma.merchants.findUniqueOrThrow({
    where: { id: ww.merchant_id },
  });

  if (!ww.id || !ww.valid) {
    throw new Error("Invalid creative");
  }

  const productTagPart = ww["product_id"] > 0 ? `-g${ww["product_id"]}` : "";
  // const freeParam = fParam ? `&p1=${fParam}` : "";
  // const subidParam = subid ? `&p2=${subid}` : "";
  const freeParam = params
    .filter((p: string) => !!p)
    .map((p: string, index) => `&p${index + 1}=${p}`)
    .join("");

  const tag = `a${affiliate_id}-b${ww["id"]}${productTagPart}-p${
    profile_id ? profile_id : ""
  }${freeParam}`; // Creat CTag
  // const webAddress = typeURL === 2 ? webAddressHttps : webAddress;

  let htmlCode = "";
  let code: string;
  let preview: string;
  let srcFile = "";
  let link = "";
  let directLink = "";

  if (ww.type === "link") {
    link = `${webAddress}click.php?ctag=${tag}`;
    code = getCodeTypeLink(link);
    preview = `<a href="${link}" target="_blank">${ww.title}</a>`;
  } else if (ww.type === "widget") {
    link = `${webAddress}view.php?ctag=${tag}`;
    code = getCodeWidget();

    if (ww.iframe_url.indexOf("iframe") === 1) {
      preview = ww.iframe_url;
    } else {
      preview = `<iframe frameborder="0" src="${ww.iframe_url}?ctag=${tag}&width=${ww.width}&height=${ww.height}" style="width: 400px; height: 250px;" scrolling="yes"></iframe>`;
    }
  } else if (ww.type === "script") {
    link = `${webAddress}ad.g?ctag=${tag}`;
    code = getCodeScript(link);
    preview = ww.scriptCode;
  } else if (ww.type === "mail" || ww.type.toLowerCase() === "content") {
    code = getCodeEmail();

    const actType =
      ww.type.toLowerCase() === "content" ? "showContent" : "showMail";
    const previewURL = `${webAddress}affiliate/creative.php?act=${actType}&id=${ww.id}&ctag=${tag}`;

    preview = `<iframe src="${previewURL}" width="100%" height="500" frameborder="1" scrolling="no" zoom="50%"></iframe><br /><a href="${previewURL}" target="_blank" style="font-size: 20px; font-weight: bold; color: green;">Click here to open in new window</a>`;
  } else {
    link = `${webAddress}ad.g?ctag=${tag}`;
    code = getCodeOther(link);
    preview = getPreviewOther();
  }

  const rlink = link.replace("ad.g", "click.php");

  if (ww.type === "image") {
    srcFile = `<img border="0" src="${webAddress}view.php?ctag=${tag}" alt="${ww.title}" title="${ww.title}" />`;
  }

  if (ww.type === "link") {
    srcFile = ww.title;
  }

  if (ww.type !== "mobileleader" && ww.type !== "mobilesplash") {
    directLink = ww.file.indexOf("/tmp") !== -1 ? "" : rlink;

    htmlCode = `<a href="${rlink}">${srcFile}</a>`;
  }

  // const facebookCode = await getFacebookPixel();
  const qrCode = await generateQRCode(rlink);

  console.log(`muly:generateBannerCode`, {
    type: ww.type,
    htmlCode,
    link,
    code,
    preview,
    directLink,
    // facebookCode,
    qrCode,
  });

  return {
    htmlCode,
    code,
    //preview, link,
    qrCode,
    directLink,
  };
};

export const generateBannerCode = protectedProcedure
  .input(Input)
  .output(BannerCode)
  .query(async ({ ctx, input: { profile_id, params, creative_id } }) => {
    const affiliate_id = checkIsUser(ctx);
    return _generateBannerCode(
      affiliate_id,
      "creative",
      creative_id,
      profile_id || undefined,
      params,
      ctx.prisma
    );
  });
