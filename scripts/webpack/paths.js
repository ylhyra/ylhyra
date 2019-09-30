const { resolve, general } = require('./utils/config/helpers')

const resolveModules = [
  './',
  'project/',
  'project/text-plugin/',
  'node_modules',
]

let DevelopmentOnly = ['./scripts/webpack/webpackHotDevClient'] // I've added some hardcoded values there :(
if (process.env.NODE_ENV === 'production') {
  DevelopmentOnly = []
}

module.exports = {
  ...general,
  resolve,
  resolveModules,
  buildFolder: resolve('build'),
  // publicFolder: resolve('project/text-plugin/public'),
  // htmlFile: resolve('project/text-plugin/public/index.html'),
  indexJs: resolve('project/text-plugin/index.js'),
  src: resolve('project/text-plugin'),
  babelPaths: resolve('project/'),
  entry: {
    /*
      ylhyra - text-plugin
    */
    app: [
      ...DevelopmentOnly,
      'project/text-plugin/index.js',
    ],
  }
}
