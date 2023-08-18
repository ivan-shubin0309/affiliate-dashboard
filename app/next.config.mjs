// @ts-check
import { i18nConfig } from "./next-i18next.config.mjs";
import { withSentryConfig } from "@sentry/nextjs";
import { withContentlayer } from "next-contentlayer";

import ReplaySourceMapUploadWebpackPlugin from "@replayio/sourcemap-upload-webpack-plugin";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  productionBrowserSourceMaps: true,
  webpack: (config, { buildId, dev, isServer }) => {
    if (!dev && !isServer && !!process.env.RECORD_REPLAY_API_KEY) {
      config.plugins.push(
        new ReplaySourceMapUploadWebpackPlugin({
          // If you've configured a custom build directory, this should
          // point to that directory.

          filepaths: [".next/"],
          // Potentially the 'buildId' argument here could be used.
          group: process.env.VERCEL_GIT_COMMIT_SHA,
        })
      );

      // 'productionBrowserSourceMaps' will output your sourcemaps
      // into the build directory, which can expose them from your
      // production server as well, so you will likely want to delete
      // the .map files once they have been uploaded.
      // config.plugins.push((compiler) =>
      //   compiler.hooks.afterEmit.tapPromise("DeleteSourceMaps", () =>
      //     findAndDeleteSourceMaps()
      //   )
      // );
    }
    return config;
  },

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: i18nConfig.i18n /*{
    locales: ["en"],
    defaultLocale: "en",
  },*/,
  sentry: {
    hideSourceMaps: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "go.*",
        pathname: "/files/**",
      },
      {
        protocol: "https",
        hostname: "partners.*",
        pathname: "/files/**",
      },
      {
        protocol: "https",
        hostname: "affiliate.*",
        pathname: "/files/**",
      },
    ],
  },
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  // debug: true,
  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.

  authToken: "d8bf21c6d4d344019e15bb6cc00d27950ba5b88c7154454d95f3c07a71e08130",
};

export default withContentlayer(
  withSentryConfig(config, sentryWebpackPluginOptions)
);
