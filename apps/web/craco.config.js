const path = require('path');

const sharedSrc = path.resolve(__dirname, '../../packages/shared/src');

module.exports = {
  webpack: {
    alias: {
      app: path.resolve(__dirname, 'src/app'),
      components: path.resolve(__dirname, 'src/components'),
      constants: path.resolve(__dirname, 'src/constants'),
      features: path.resolve(__dirname, 'src/features'),
      services: path.resolve(__dirname, 'src/services'),
      utils: path.resolve(__dirname, 'src/utils'),
      '@shared': sharedSrc,
    },
    configure: (webpackConfig) => {
      webpackConfig.resolve.plugins = (webpackConfig.resolve.plugins || []).filter(
        (plugin) => plugin.constructor.name !== 'ModuleScopePlugin'
      );

      return webpackConfig;
    },
  },
};