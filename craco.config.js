module.exports = {
  module: [
    {
      test: /\.styl$/,
      use: [
        "style-loader",
        "css-loader?modules&camelCase&localIdentName=[path]__[name]__[local]--[hash:base64:5]",
        "stylus-loader",
      ],
    },
    {
      test: /\.css$/,
      use: ["style-loader", "css-loader"],
    },
  ],
};
