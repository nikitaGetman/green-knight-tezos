const CracoStylusPlugin = require('craco-stylus');
const path = require('path');

const resolvePath = (p) => path.resolve(__dirname, p);

module.exports = {
  plugins: [
    {
      plugin: CracoStylusPlugin,
    },
  ],
  webpack: {
    alias: {
      '@': resolvePath('./src/'),
    },
  },
};
