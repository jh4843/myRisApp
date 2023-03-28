var webpack = require("webpack");
var path = require("path");
var fs = require("fs");

const nodeExternals = require("webpack-node-externals");
const NodemonPlugin = require("nodemon-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

var nodeModules = {};
fs.readdirSync("node_modules")
  .filter(function (x) {
    return [".bin"].indexOf(x) === -1;
  })
  .forEach(function (mod) {
    nodeModules[mod] = "ES6 " + mod;
  });

module.exports = {
  entry: "./src/index.ts",
  target: "node",
  externals: process.env.NODE_ENV == "production" ?  []: [nodeExternals()],
  externals: [],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "../dist"),
    // publicPath: "./",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
    ],
  },
  stats: "errors-warnings",
  plugins: [new NodemonPlugin(), new CleanWebpackPlugin()],
};
