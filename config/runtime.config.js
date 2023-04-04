const envData = process.env || {}

const retainedUserData = {}
if (envData.Auth_User) {
  retainedUserData[envData.Auth_User] = envData.Auth_Password
}
const Feishu_useDepartmentSyncing = !!envData.Feishu_useDepartmentSyncing

module.exports = {
  FangchaAuth: {
    configVersion: envData.configVersion,
    wecomBotKey: envData.wecomBotKey,
    feishuBotKey: envData.feishuBotKey,

    webBaseURL: envData.webBaseURL,
    webJwtKey: envData.webJwtKey,
    webJwtSecret: envData.webJwtSecret,
    adminBaseURL: envData.adminBaseURL,
    adminJwtKey: envData.adminJwtKey,
    adminJwtSecret: envData.adminJwtSecret,
    mysql: {
      ssoDB: {
        host: envData.DB_Host,
        port: envData.DB_Port,
        dialect: 'mysql',
        database: envData.DB_Name,
        username: envData.DB_User,
        password: envData.DB_Password,
      },
    },
    redisCache: {
      host: envData.Redis_Host,
      port: envData.Redis_Port,
    },
    ssoResque: {
      redisHost: envData.Resque_redisHost,
      redisPort: envData.Resque_redisPort,
      dynamicQueues: Feishu_useDepartmentSyncing ? ['FeishuQueue'] : [],
    },
    sqlTablePrefix: envData.DB_tableNamePrefix,
    frontendConfig: {
      appName: envData.FE_appName,
      background: envData.FE_background,
      logoCss: envData.FE_logoCss,
      signupAble: envData.FE_signupAble,
      beianText: envData.FE_beianText,
    },
    adminAuth: {
      authMode: envData.authMode,
      retainedUserData: retainedUserData,
      oauthConfig: {
        baseURL: envData.adminSSO_baseURL,
        clientId: envData.adminSSO_clientId,
        clientSecret: envData.adminSSO_clientSecret,
        authorizePath: envData.adminSSO_authorizePath,
        tokenPath: envData.adminSSO_tokenPath,
        logoutPath: envData.adminSSO_logoutPath,
        scope: envData.adminSSO_scope,
        callbackUri: envData.adminSSO_callbackUri,
        userInfoURL: envData.adminSSO_userInfoURL,
      },
    },
    adminFrontendConfig: {
      appName: envData.adminFE_appName,
      background: envData.adminFE_background,
      logoCss: envData.adminFE_logoCss,
      navBackground: envData.adminFE_navBackground,
    },
    useResque: Feishu_useDepartmentSyncing,
    useSchedule: Feishu_useDepartmentSyncing,
    FeishuSDK: {
      urlBase: 'https://open.feishu.cn',
      appid: envData.Feishu_appid,
      appSecret: envData.Feishu_appSecret,
    },
    feishuSyncNotifyBotKey: envData.Feishu_syncNotifyBotKey,
  },
}
