//@ts-check

"use strict";

const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

/**@type {import('webpack').Configuration}*/
const config = {
  target: "node", // vscode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
  node: false,
  entry: "./src/extension.ts", // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
  output: {
    // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
    path: path.resolve(__dirname, "bundled"),
    filename: "extension.js",
    libraryTarget: "commonjs2",
    devtoolModuleFilenameTemplate: "../[resource-path]",
  },
  devtool: "source-map",
  externals: {
    vscode: "commonjs vscode", // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
  },
  resolve: {
    // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        // exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        path.resolve(__dirname, "parsers/tree-sitter.wasm"),
        path.resolve(__dirname, "parsers/tree-sitter-agda.wasm"),
        path.resolve(__dirname, "parsers/tree-sitter-bash.wasm"),
        path.resolve(__dirname, "parsers/tree-sitter-c.wasm"),
        path.resolve(__dirname, "parsers/tree-sitter-csharp.wasm"),
        path.resolve(__dirname, "parsers/tree-sitter-cli.wasm"),
        path.resolve(__dirname, "parsers/tree-sitter-cpp.wasm"),
        path.resolve(__dirname, "parsers/tree-sitter-css.wasm"),
        path.resolve(__dirname, "parsers/tree-sitter-elm.wasm"),
        path.resolve(__dirname, "parsers/tree-sitter-embedded_template.wasm"),
        path.resolve(__dirname, "parsers/tree-sitter-go.wasm"),
        path.resolve(__dirname, "parsers/tree-sitter-haiku.wasm"),
        path.resolve(__dirname, "parsers/tree-sitter-html.wasm"),
        path.resolve(__dirname, "parsers/tree-sitter-java.wasm"),
        path.resolve(__dirname, "parsers/tree-sitter-javascript.wasm"),
        path.resolve(__dirname, "parsers/tree-sitter-json.wasm"),
        path.resolve(__dirname, "parsers/tree-sitter-lua.wasm"),
        path.resolve(__dirname, "parsers/tree-sitter-kotlin.wasm"),
        path.resolve(__dirname, "parsers/tree-sitter-markdown.wasm"),
        path.resolve(__dirname, "parsers/tree-sitter-php.wasm"),
        path.resolve(__dirname, "parsers/tree-sitter-python.wasm"),
        path.resolve(__dirname, "parsers/tree-sitter-ruby.wasm"),
        path.resolve(__dirname, "parsers/tree-sitter-rust.wasm"),
        path.resolve(__dirname, "parsers/tree-sitter-systemrdl.wasm"),
        path.resolve(__dirname, "parsers/tree-sitter-toml.wasm"),
        path.resolve(__dirname, "parsers/tree-sitter-vue.wasm"),
        path.resolve(__dirname, "parsers/tree-sitter-yaml.wasm"),
      ],
    }),
  ],
};
module.exports = config;
