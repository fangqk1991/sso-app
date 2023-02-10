const { WebpackBuilder } = require('@fangcha/webpack')
const { GlobalAppConfig } = require('fc-config')

module.exports = new WebpackBuilder()
  .setDevMode(true)
  .setPort(GlobalAppConfig.SsoAdmin.adminPort_frontend)
  .setExtras({
    devServer: {
      proxy: {
        '/api': `http://localhost:${GlobalAppConfig.SsoAdmin.adminPort}`,
      },
    },
  })
  .build()
