const path = require("path");

module.exports = (paths) => ({
  entry: {
    main: path.resolve(__dirname, paths.scripts.src),
  },
  output: {
    path: path.resolve(__dirname, paths.dest),
    filename: "bundle.js",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[hash].[ext]",
              outputPath: "images/", 
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [],
});
