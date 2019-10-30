const path = require('path')
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack');
const resolve = (input) => path.resolve(__dirname, './../../' + input)
const polyfills = resolve('scripts/webpack/utils/config/polyfills.js')
const modules = [
  resolve('project/'),
  resolve('project/server/'),
  resolve('project/text-plugin/'),
  resolve('project/vocabulary/'),
  resolve('.'),
]

module.exports = {
  target: 'node',
  node: {
    __dirname: true,
    __filename: false,
  },
  entry: {
    ylhyra_server: [polyfills, resolve('project/server/index.js')],
    // vocabulary_server: [polyfills, resolve('project/vocabulary/server/index.js')],
    // vocabulary_compiler: [polyfills, resolve('project/vocabulary/compiler/index.js')],
    // vocabulary_notifications_schedule: [polyfills, resolve('project/vocabulary/server/notifications/schedule/ScheduleAll.js')],
    // vocabulary_notifications_send: [polyfills, resolve('project/vocabulary/server/notifications/send/GetOverdue.js')],
  },
  output: {
    path: resolve('build'),
    filename: '[name].js'
  },
  resolve: {
    modules: modules,
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
    }, ],
  },
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
