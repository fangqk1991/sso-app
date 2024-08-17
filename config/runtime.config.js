const envData = process.env || {}

const retainedUserData = {}
if (envData.Auth_User) {
  retainedUserData[envData.Auth_User] = envData.Auth_Password
}

const dynamicQueues = []
const Feishu_useDepartmentSyncing = !!envData.Feishu_useDepartmentSyncing
if (Feishu_useDepartmentSyncing) {
  dynamicQueues.push('FeishuQueue')
}
const Wechat_useWechatMPSyncing = !!envData.Wechat_useWechatMPSyncing
if (Wechat_useWechatMPSyncing) {
  dynamicQueues.push('WeixinMPQueue')
}
const useTask = Feishu_useDepartmentSyncing || Wechat_useWechatMPSyncing

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
      dynamicQueues: dynamicQueues,
    },
    sqlTablePrefix: envData.DB_tableNamePrefix,
    frontendConfig: {
      appName: envData.FE_appName,
      background: envData.FE_background,
      logoCss: envData.FE_logoCss,
      signupAble: envData.FE_signupAble,
      beianText: envData.FE_beianText,

      useFeishuLogin: envData.FE_useFeishuLogin !== undefined ? `${envData.FE_useFeishuLogin}` === 'true' : undefined,
      useGoogleLogin: envData.FE_useGoogleLogin !== undefined ? `${envData.FE_useGoogleLogin}` === 'true' : undefined,
      useWechatLogin: envData.FE_useWechatLogin !== undefined ? `${envData.FE_useWechatLogin}` === 'true' : undefined,
      useWechatMPLogin:
        envData.FE_useWechatMPLogin !== undefined ? `${envData.FE_useWechatMPLogin}` === 'true' : undefined,
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
      colorPrimary: envData.adminFE_colorPrimary,
      background: envData.adminFE_background,
      logoCss: envData.adminFE_logoCss,
      navBackground: envData.adminFE_navBackground,
    },
    useResque: useTask,
    useSchedule: useTask,
    FeishuSDK: {
      urlBase: 'https://open.feishu.cn',
      appid: envData.Feishu_appid,
      appSecret: envData.Feishu_appSecret,
    },
    feishuSyncNotifyBotKey: envData.Feishu_syncNotifyBotKey,
    JointLogin: {
      Wechat: {
        baseUrl: 'https://api.weixin.qq.com',
        appid: envData.Wechat_appid,
        secret: envData.Wechat_secret,
        redirectUri: envData.Wechat_redirectUri,
      },
      WechatMP: {
        baseUrl: 'https://api.weixin.qq.com',
        appid: envData.WechatMP_appid,
        secret: envData.WechatMP_secret,
        redirectUri: envData.WechatMP_redirectUri,
      },
      Google: {
        baseURL: 'https://accounts.google.com',
        clientId: envData.Google_clientId,
        clientSecret: envData.Google_clientSecret,
        authorizePath: '/o/oauth2/auth',
        tokenBaseURL: 'https://oauth2.googleapis.com',
        tokenPath: '/token',
        logoutPath: '',
        scope: 'email profile',
        callbackUri: envData.Google_callbackUri,
      },
    },
  },
}
