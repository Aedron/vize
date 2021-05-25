/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const {
  override,
  addWebpackModuleRule,
  addLessLoader,
  babelInclude,
  addWebpackExternals,
  adjustStyleLoaders,
} = require('customize-cra');

require('../../scripts/watcher');

module.exports = {
  webpack: override(
    // addWebpackResolve({ symlinks: false }),
    adjustStyleLoaders(({ use: [, css, postcss, resolve, processor] }) => {
      css.options.sourceMap = true;
      postcss.options.sourceMap = true;
      if (resolve) {
        resolve.options.sourceMap = true;
      }
      if (processor && processor.loader.includes('sass-loader')) {
        processor.options.sourceMap = true;
        processor.options.implementation = require('sass');
      }
    }),
    addWebpackModuleRule({
      test: /\.iframe\.(scss|sass|css)$/,
      use: [
        { loader: 'css-to-string-loader' },
        { loader: 'css-loader' },
        {
          loader: 'sass-loader',
          options: {
            implementation: require('sass'),
          },
        },
      ],
    }),
    addWebpackModuleRule({
      test: /\.raw\.svg$/,
      use: [{ loader: 'raw-loader' }],
    }),
    babelInclude([path.resolve(__dirname, './src'), path.resolve(__dirname, '../../node_modules/@vize/types')]),
    addLessLoader({
      strictMath: false,
      noIeCompat: true,
      javascriptEnabled: true,
    }),
    // setWebpackPublicPath('/editor/'),
    setOutputPublicPath('/editor/'),
    addWebpackExternals({
      react: 'React',
      'react-dom': 'ReactDom',
      'react-dom/server': 'ReactDomServer',
      antd: 'Antd',
      '@formily/core': 'FormilyCore',
      '@formily/react': 'FormilyReact',
      '@formily/antd': 'FormilyAntd',
    }),
  ),
};

function setOutputPublicPath(publicPath) {
  return function(config) {
    if (typeof config !== 'object') {
      return config;
    }

    config.output.publicPath = publicPath;
    return config;
  };
}
