import path from "path";

/** @type {import("next-i18next").UserConfig} */
export const i18nConfig = {
  debug: process.env.NODE_ENV === "development",
  reloadOnPrerender: process.env.NODE_ENV === "development",
  i18n: {
    locales: ["en", "ru", "nl", "es", "fr", "it", "ar", "zh", "pt", "he", "ja"],
    defaultLocale: "en",
  },
  ns: ["affiliate"],
  localePath: path.resolve("./public/locales"),
  updateMissing: true,
  saveMissing: true,
  saveMissingTo: "all",
  // missingKeyHandler: (lngs, ns, key, fallbackValue, updateMissing, options) => {
  //   console.log(`muly:missingKeyHandler`, {
  //     lngs,
  //     ns,
  //     key,
  //     fallbackValue,
  //     updateMissing,
  //     options,
  //   });
  // },
  fallbackLng: false,
  serializeConfig: false,
};
