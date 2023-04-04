const { makeRunningConfig } = require('fc-config/config.utils')
const path = require('path')
const rootDir = path.resolve(__dirname, '../..')

const appList = [
  {
    name: 'sso-web',
    script: `${rootDir}/packages/sso-backend/dist/sso-web.js`,
    error_file: '/data/logs/sso/sso-web-err.log',
    out_file: '/data/logs/sso/sso-web-out.log',
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
    error_file: '/data/logs/sso/sso-admin-err.log',
    out_file: '/data/logs/sso/sso-admin-out.log',
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
    error_file: '/data/logs/sso/sso-power-err.log',
    out_file: '/data/logs/sso/sso-power-out.log',
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


const resqueApp = {
  name: 'sso-resque',
  script: `${rootDir}/packages/sso-backend/dist/sso-resque.js`,
  error_file: '/data/logs/sso/sso-resque-err.log',
  out_file: '/data/logs/sso/sso-resque-out.log',
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
}

const scheduleApp = {
  name: 'sso-schedule',
  script: `${rootDir}/packages/sso-backend/dist/sso-schedule.js`,
  error_file: '/data/logs/sso/sso-schedule-err.log',
  out_file: '/data/logs/sso/sso-schedule-out.log',
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
}

const config = makeRunningConfig()
if (!config.Tags.includes('Backup')) {
  if (config.FangchaAuth.useResque) {
    appList.push(resqueApp)
  }
  if (config.FangchaAuth.useSchedule) {
    appList.push(scheduleApp)
  }
}

module.exports = {
  apps: appList,
}
