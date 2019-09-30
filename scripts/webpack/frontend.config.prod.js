'use strict'

const autoprefixer = require('autoprefixer')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
// const eslintFormatter = require('react-dev-utils/eslintFormatter')
const paths = require('./paths')
const getClientEnvironment = require('./utils/config/env')
// const PrerenderSPAPlugin = require('prerender-spa-plugin')
// const version = process.env.npm_package_version

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = paths.servedPath
// // Some apps do not use client-side routing with pushState.
// // For these, "homepage" can be set to "." to enable relative asset paths.
// const shouldUseRelativeAssetPaths = publicPath === './'
// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
const publicUrl = publicPath.slice(0, -1)
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl)

if (env.stringified['process.env'].NODE_ENV !== '"production"') {
  throw new Error('Production builds must have NODE_ENV=production.')
}

// Note: defined here because it will be used more than once.
const cssFilename = '[name].[contenthash:8].css'

// // ExtractTextPlugin expects the build output to be flat.
// // (See https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/27)
// // However, our output is structured with css, js and media folders.
// // To have this structure working with relative paths, we have to use custom options.
// const extractTextPluginOptions = shouldUseRelativeAssetPaths ? // Making sure that the publicPath goes back to to build folder.
//   { publicPath: Array(cssFilename.split('/').length).join('../') } : {}

module.exports = {
  // Don't attempt to continue if there are any errors.
  bail: true,
  devtool: shouldUseSourceMap ? 'source-map' : false,
  entry: paths.entry,
  output: {
    path: paths.buildFolder,
    filename: `[name].js`,
    chunkFilename: `[name].[chunkhash:8].chunk.js`,
    publicPath: publicPath,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path
      .relative(paths.src, info.absoluteResourcePath)
      .replace(/\\/g, '/'),
  },
  resolve: {
    modules: paths.resolveModules,
    extensions: ['.js', '.json'],
    alias: {
      // 'react': 'preact-compat',
      // 'react-dom': 'preact-compat',
      // 'react-dom/server': 'preact-compat/server',
      // 'preact-compat': 'preact-compat/dist/preact-compat',
      // 'preact-compat/server': 'preact-compat/dist/preact-compat/server',
    },
    plugins: [],
  },
  module: {
    strictExportPresence: true,
    rules: [
      // // Linter
      // {
      //   test: /\.(js|jsx|mjs)$/,
      //   enforce: 'pre',
      //   use: [{
      //     options: {
      //       formatter: eslintFormatter,
      //       eslintPath: require.resolve('eslint'),
      //
      //     },
      //     loader: require.resolve('eslint-loader'),
      //   }, ],
      //   include: paths.src,
      // },
      {
        oneOf: [{
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.(js|jsx|mjs)$/,
            include: paths.babelPaths,
            // exclude: /node_modules\/(?!(runes)\/).*/,
            loader: require.resolve('babel-loader'),
            options: {
              compact: true,
            },
          },

          // Stylus stylesheet
          {
            test: /\.(styl|css)$/,
            loader: 'style-loader!css-loader!stylus-loader',

            // use: ExtractTextPlugin.extract({
            //   fallback: 'style-loader',
            //   // filename: 'app.css',
            //   use: [
            //   // {
            //   //   loader: 'css-loader',
            //   //   options: {
            //   //     modules: true,
            //   //     // importLoaders: 2,
            //   //     // localIdentName: '[name]__[local]___[hash:base64:5]',
            //   //     minimize: true,
            //   //     sourceMap: shouldUseSourceMap,
            //   //   }
            //   // },
            //   // {
            //   //   loader: 'postcss-loader',
            //   //   options: {
            //   //     // Necessary for external CSS imports to work
            //   //     // https://github.com/facebookincubator/create-react-app/issues/2677
            //   //     ident: 'postcss',
            //   //     plugins: () => [
            //   //       require('postcss-flexbugs-fixes'),
            //   //       autoprefixer({
            //   //         browsers: [
            //   //           '>1%',
            //   //           'last 4 versions',
            //   //           'Firefox ESR',
            //   //           'not ie < 9', // React doesn't support IE8 anyway
            //   //         ],
            //   //         flexbox: 'no-2009',
            //   //       }),
            //   //     ],
            //   //   },
            //   // },
            //   {
            //     loader: 'stylus-loader'
            //   }]
            // }),

          },


          // // The notation here is somewhat confusing.
          // // "postcss" loader applies autoprefixer to our CSS.
          // // "css" loader resolves paths in CSS and adds assets as dependencies.
          // // "style" loader normally turns CSS into JS modules injecting <style>,
          // // but unlike in development configuration, we do something different.
          // // `ExtractTextPlugin` first applies the "postcss" and "css" loaders
          // // (second argument), then grabs the result CSS and puts it into a
          // // separate file in our build process. This way we actually ship
          // // a single CSS file in production instead of JS code injecting <style>
          // // tags. If you use code splitting, however, any async bundles will still
          // // use the "style" loader inside the async code so CSS from them won't be
          // // in the main CSS file.
          // {
          //   test: /\.(css|styl)$/,
          //   loader: ExtractTextPlugin.extract(
          //     Object.assign({
          //         fallback: {
          //           loader: require.resolve('style-loader'),
          //           options: {
          //             hmr: false,
          //           },
          //         },
          //         use: [{
          //             loader: require.resolve('css-loader'), // require.resolve('stylus-loader'), //require.resolve('css-loader'),
          //             // loader: require.resolve('stylus-loader'),
          //             // loader: 'style-loader!css-loader!stylus-loader',
          //             // loader: ['css-loader', 'stylus-loader'],
          //             options: {
          //               importLoaders: 1,
          //               minimize: true,
          //               sourceMap: shouldUseSourceMap,
          //             },
          //           },
          //           {
          //             loader: require.resolve('postcss-loader'),
          //             options: {
          //               // Necessary for external CSS imports to work
          //               // https://github.com/facebookincubator/create-react-app/issues/2677
          //               ident: 'postcss',
          //               plugins: () => [
          //                 require('postcss-flexbugs-fixes'),
          //                 autoprefixer({
          //                   browsers: [
          //                     '>1%',
          //                     'last 4 versions',
          //                     'Firefox ESR',
          //                     'not ie < 9', // React doesn't support IE8 anyway
          //                   ],
          //                   flexbox: 'no-2009',
          //                 }),
          //               ],
          //             },
          //           },
          //         ],
          //       },
          //       extractTextPluginOptions
          //     )
          //   ),
          //   // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
          // },


          {
            loader: require.resolve('file-loader'),
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // new InterpolateHtmlPlugin(env.raw),
    // new HtmlWebpackPlugin({
    //   inject: true,
    //   hash: true,
    //   template: paths.htmlFile,
    //   minify: {
    //     removeComments: true,
    //     collapseWhitespace: true,
    //     removeRedundantAttributes: true,
    //     useShortDoctype: true,
    //     removeEmptyAttributes: true,
    //     removeStyleLinkTypeAttributes: true,
    //     keepClosingSlash: true,
    //     minifyJS: true,
    //     minifyCSS: true,
    //     minifyURLs: true,
    //   },
    //   excludeAssets: [/ylhyra.js/],
    // }),
    // new HtmlWebpackExcludeAssetsPlugin(),
    new webpack.DefinePlugin(env.stringified),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        comparisons: false,
      },
      mangle: {
        safari10: true,
      },
      output: {
        comments: false,
        ascii_only: true,
      },
      sourceMap: shouldUseSourceMap,
    }),
    new ExtractTextPlugin({
      filename: cssFilename,
    }),
    // new ManifestPlugin({
    //   fileName: 'asset-manifest.json',
    // }),
    // new SWPrecacheWebpackPlugin({
    //   dontCacheBustUrlsMatching: /\.\w{8}\./,
    //   filename: 'service-worker.js',
    //   logger(message) {
    //     if (message && message.indexOf('Total precache size is') === 0) {
    //       return
    //     }
    //     if (message && message.indexOf('Skipping static resource') === 0) {
    //       // This message obscures real errors so we ignore it.
    //       // https://github.com/facebookincubator/create-react-app/issues/2612
    //       return
    //     }
    //     console.log(message)
    //   },
    //   minify: true,
    //   // // For unknown URLs, fallback to the index page
    //   // navigateFallback: publicUrl + '/index.html',
    //   // Ignores URLs starting from /__ (useful for Firebase):
    //   // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
    //   navigateFallbackWhitelist: [/^(?!\/__).*/],
    //   // Don't precache sourcemaps (they're large) and build asset manifest:
    //   staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
    // }),




    // new PrerenderSPAPlugin({
    //   staticDir: paths.buildFolder,
    //   outputDir: path.join(paths.buildFolder, 'prerendered'),
    //   routes: ['/', ],
    //   minify: {
    //     collapseBooleanAttributes: true,
    //     removeComments: true,
    //     collapseWhitespace: true,
    //     removeAttributeQuotes: true,
    //     removeRedundantAttributes: true,
    //     removeEmptyAttributes: true,
    //     removeOptionalTags: true,
    //     sortAttributes: true,
    //     sortClassName: true,
    //     minifyCSS: true,
    //     minifyJS: true,
    //   },
    //   postProcessHtml: ({ html }) => {
    //     return html.replace(/<script.+><\/script>/, '')
    //   }
    // })


  ],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
}
