const path = require('path')
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack');
const resolve = (input) => path.resolve(__dirname, './../' + input)
const NodemonPlugin = require('nodemon-webpack-plugin')

// const polyfills = resolve('scripts/webpack/utils/config/polyfills.js')
const modules = [
  resolve('src/'),
  // resolve('node_modules'),
]

new webpack.WatchIgnorePlugin(['src/.+'])
// new webpack.WatchIgnorePlugin({ paths: ['src/.+'] })

module.exports = {
  target: 'node',
  node: {
    __dirname: true,
    __filename: false,
  },
  mode: process.env.NODE_ENV,
  entry: {
    ylhyra_server: [ /*polyfills,*/ resolve('src/server/index.js')],
  },
  output: {
    path: resolve('build'),
    filename: '[name].js'
  },
  resolve: {
    modules: [
      ...modules,
      resolve('src/server/'),
      resolve('src/server/inflection/'),
      resolve('.'),
      // resolve('server/node_modules/'),
      // resolve('node_modules/'),
    ],
    extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
  },
  externals: [nodeExternals()],
  /*
    Virka ekki af einhverjum ástæðum. "source-map-support" í index.js ætti að láta þetta virka.
  */
  devtool: 'source-map',
  stats: {
    colors: true,
    hash: false,
    version: false,
    timings: false,
    assets: false,
    chunks: false,
    modules: false,
    reasons: false,
    children: false,
    source: false,
    errors: true,
    errorDetails: true,
    warnings: false,
    publicPath: false
  },
  bail: true,
  watchOptions: {
    ignored: ['node_modules/**', 'mediawiki/**', 'src/User/**', 'src/User/**/*.js']
  },
  module: {
    strictExportPresence: true,
    rules: [{
      oneOf: [{
        test: /\.(js|jsx|mjs)$/,
        include: modules,
        loader: require.resolve('babel-loader'),
        options: {
          cacheDirectory: true,
        },
      }, ],
    },
    // {
    //   oneOf: [{
    //     test: /\.(scss)$/,
    //     include: modules,
    //     loader: require.resolve('ignore-loader'),
    //   }, ],
    // },
  ],
  },
  plugins: [new NodemonPlugin()],
  // plugins: [
  //   new webpack.optimize.UglifyJsPlugin({
  //     compress: {
  //       warnings: false,
  //       comparisons: false,
  //     },
  //     mangle: {
  //       safari10: true,
  //     },
  //     output: {
  //       comments: false,
  //       ascii_only: true,
  //     },
  //     sourceMap: true,
  //   }),
  // ],
}
