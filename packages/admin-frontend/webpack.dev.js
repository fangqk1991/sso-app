const { WebpackBuilder } = require('@fangcha/webpack')
const { GlobalAppConfig } = require('fc-config')

module.exports = new WebpackBuilder()
  .useReact()
  .setDevMode(true)
  .setPort(GlobalAppConfig.FangchaAuth.adminPort_frontend)
  .setEntry('./src/index.tsx')
  .setExtras({
    devServer: {
      proxy: {
        '/api': `http://localhost:${GlobalAppConfig.FangchaAuth.adminPort}`,
      },
      client: {
        overlay: false,
      },
    },
  })
  .build()
