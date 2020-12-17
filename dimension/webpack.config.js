const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    LuckyDraw: "./src/LuckyDraw/index.js",
    Airdrop: "./src/Airdrop/index.js",
    NFTSlot: "./src/NFTSlot/index.js"
  },
  output: {
    path: path.resolve(__dirname, "../public/dimension"),
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/preset-env",
            "@babel/preset-react",
          ],
          plugins: [
            "@babel/plugin-proposal-optional-chaining"
          ]
        }
      },
      {
        test: /\.css?$/,
        use: [ "style-loader", "css-loader" ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader"
          }
        ]
      }
    ]
  },
  watch: true,
}