const { WebpackBuilder } = require('@fangcha/webpack')

module.exports = new WebpackBuilder()
  .setDevMode(false)
  .setPublicPath('/')
  .setEntry('./src/index.tsx')
  // .setExtras({
  //   optimization: {
  //     minimize: false,
  //   },
  // })
  .build()
