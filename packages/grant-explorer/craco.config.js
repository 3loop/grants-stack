const webpack = require("webpack");
const CracoEsbuildPlugin = require("craco-esbuild");
const path = require("path");
const { VerifyEnvPlugin } = require("verify-env");
const { config } = require("dotenv");

config({
  path: path.join(__dirname, "../../.env"),
});

const plugins = [
  new webpack.ProvidePlugin({
    Buffer: ["buffer", "Buffer"],
    process: "process/browser",
  }),
];

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Handle ESM modules
      webpackConfig.module.rules.push({
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      });

      // Add fallbacks for node core modules
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        url: require.resolve('url'),
        buffer: require.resolve("buffer"),
        process: require.resolve("process/browser"),
      };

      // Add resolve aliases
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        process: "process/browser",
        axios: require.resolve('axios'),
      };

      // Source map generation must be turned on
      webpackConfig.devtool = "source-map";

      webpackConfig.module.rules.push({
        test: /\.wasm$/,
        type: "webassembly/async",
      });

      webpackConfig.module.rules.push({
        test: /\.tsx?$/,
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/preset-env",
            ["@babel/preset-react", { runtime: "automatic" }],
            "@babel/preset-typescript",
          ],
        },
      });

      webpackConfig.experiments = {
        asyncWebAssembly: true,
      };

      webpackConfig.ignoreWarnings = [
        // Ignore warnings raised by source-map-loader.
        // some third party packages may ship miss-configured sourcemaps, that interrupts the build
        // See: https://github.com/facebook/create-react-app/discussions/11278#discussioncomment-1780169
        /**
         *
         * @param {import("webpack").WebpackError} warning
         * @returns {boolean}
         */
        function ignoreSourcemapsloaderWarnings(warning) {
          return (
            warning.module &&
            warning.module.resource.includes("node_modules") &&
            warning.details &&
            warning.details.includes("source-map-loader")
          );
        },
      ];

      return webpackConfig;
    },
    plugins: {
      add: plugins,
    },
  },
  plugins: [
    {
      plugin: CracoEsbuildPlugin,
      options: {
        includePaths: [path.join(__dirname, `../common/src`)],
        skipEsbuildJest: true,
        esbuildLoaderOptions: {
          loader: "tsx", // Set the value to 'tsx' if you use typescript
          target: "es2020",
        },
        esbuildMinimizerOptions: {
          target: "es2020",
        },
      },
    },
  ],
};
