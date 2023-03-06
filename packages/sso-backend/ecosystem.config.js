const path = require('path')
const rootDir = path.resolve(__dirname, '../..')

const appList = [
  {
    name: 'sso-web',
    script: `${rootDir}/packages/sso-backend/dist/sso-web.js`,
    error_file: '/data/logs/auth/sso-web-err.log',
    out_file: '/data/logs/auth/sso-web-out.log',
    exec_mode: 'fork',
    listen_timeout: 10000,
    log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS',
    env: {
      CODE_VERSION: 'COMMIT_SHA',
      NODE_ENV: 'development',
      NODE_CONFIG_ENV: 'development',
    },
    env_staging: {
      NODE_ENV: 'staging',
      NODE_CONFIG_ENV: 'staging',
    },
    env_production: {
      NODE_ENV: 'production',
      NODE_CONFIG_ENV: 'production',
    },
  },
  {
    name: 'sso-admin',
    script: `${rootDir}/packages/sso-backend/dist/sso-admin.js`,
    error_file: '/data/logs/auth/sso-admin-err.log',
    out_file: '/data/logs/auth/sso-admin-out.log',
    exec_mode: 'fork',
    listen_timeout: 10000,
    log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS',
    env: {
      CODE_VERSION: 'COMMIT_SHA',
      NODE_ENV: 'development',
      NODE_CONFIG_ENV: 'development',
    },
    env_staging: {
      NODE_ENV: 'staging',
      NODE_CONFIG_ENV: 'staging',
    },
    env_production: {
      NODE_ENV: 'production',
      NODE_CONFIG_ENV: 'production',
    },
  },
  {
    name: 'sso-power',
    script: `${rootDir}/packages/sso-backend/dist/sso-power.js`,
    error_file: '/data/logs/auth/sso-power-err.log',
    out_file: '/data/logs/auth/sso-power-out.log',
    exec_mode: 'fork',
    listen_timeout: 10000,
    log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS',
    env: {
      CODE_VERSION: 'COMMIT_SHA',
      NODE_ENV: 'development',
      NODE_CONFIG_ENV: 'development',
    },
    env_staging: {
      NODE_ENV: 'staging',
      NODE_CONFIG_ENV: 'staging',
    },
    env_production: {
      NODE_ENV: 'production',
      NODE_CONFIG_ENV: 'production',
    },
  },
]

module.exports = {
  apps: appList,
}
