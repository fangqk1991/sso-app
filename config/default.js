module.exports = {
  Env: 'It will be rewritten by process.env.NODE_CONFIG_ENV or process.env.NODE_ENV',
  Tags: [],
  FangchaAuth: {
    configVersion: '0.0.0',
    wecomBotKey: '',
    feishuBotKey: '',

    webBaseURL: 'http://localhost:2699',
    webPort_frontend: 2699,
    webPort: 2700,
    webJwtKey: 'sso_web_jwt_key',
    webJwtSecret: '<TmplDemo Random 32>',

    powerBaseURL: 'http://localhost:2550',
    powerPort: 2550,

    adminBaseURL: 'http://localhost:2599',
    adminPort_frontend: 2599,
    adminPort: 2600,
    adminJwtKey: 'sso_admin_jwt_key',
    adminJwtSecret: '<TmplDemo Random 32>',
    adminAuth: {
      authMode: 'simple',
      retainedUserData: {
        // 'admin@example.com': 'admin',
      },
      oauthConfig: {
        baseURL: 'https://sso.example.com',
        clientId: '<clientId>',
        clientSecret: '<clientSecret>',
        authorizePath: '/api/v1/oauth/authorize',
        tokenPath: '/api/v1/oauth/token',
        logoutPath: '/api/v1/logout',
        scope: 'basic',
        callbackUri: 'http://localhost:2599/api-302/auth-sdk/v1/handle-sso',
        userInfoURL: 'https://sso.example.com/api/v1/oauth/user-info',
      },
    },
    adminFrontendConfig: {
      appName: 'Fangcha SSO Admin',
      colorPrimary: '',
      background: 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)',
      logoCss: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
      navBackground: '#EA3323',
      useWatermark: false,
    },
    mysql: {
      ssoDB: {
        host: '127.0.0.1',
        port: 3306,
        dialect: 'mysql',
        database: 'demo_db',
        username: 'root',
        password: '',
      },
    },
    useResque: false,
    useSchedule: false,
    ssoResque: {
      redisHost: '127.0.0.1',
      redisPort: 30100,
      dynamicQueues: [],
    },
    redisCache: {
      host: '127.0.0.1',
      port: 30100,
    },
    sqlTablePrefix: '',
    frontendConfig: {
      appName: 'Fangcha SSO',
      background: '#f5f5f5',
      logoCss: 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)',
      signupAble: false,
      beianText: '',
      useEmailLogin: true,
      useFeishuLogin: false,
      useGoogleLogin: false,
      useWechatLogin: false,
      useWechatMPLogin: false,
    },
    FeishuSDK: {
      urlBase: 'https://open.feishu.cn',
      appid: '<appid>',
      appSecret: '<appSecret>',
    },
    feishuSyncNotifyBotKey: '',
    OverseasProxy: false,
    JointLogin: {
      Wechat: {
        baseUrl: 'https://api.weixin.qq.com',
        appid: '<appid>',
        secret: '<some secret>',
        redirectUri: '<redirectUri>',
      },
      WechatMP: {
        baseUrl: 'https://api.weixin.qq.com',
        appid: '<appid>',
        secret: '<some secret>',
        redirectUri: '<redirectUri>',
      },
      Google: {
        baseURL: 'https://accounts.google.com',
        clientId: '<clientId>',
        clientSecret: '<clientSecret>',
        authorizePath: '/o/oauth2/auth',
        tokenBaseURL: 'https://oauth2.googleapis.com',
        tokenPath: '/token',
        logoutPath: '',
        scope: 'email profile',
        callbackUri: '<callbackUri>',
      },
    },
  },
  UserSDK: {
    adminUserService: {
      urlBase: 'http://localhost:2550',
      username: '<username>',
      password: '<password>',
    },
    openUserService: {
      urlBase: 'http://localhost:2550',
      username: '<username>',
      password: '<password>',
    },
  },
  test_oauthConfig: {
    baseURL: 'http://localhost:2699',
    clientId: '<clientId>',
    clientSecret: '<clientSecret>',
    authorizePath: '/api/v1/oauth/authorize',
    tokenPath: '/api/v1/oauth/token',
    logoutPath: '/api/v1/logout',
    scope: 'basic',
    callbackUri: 'http://localhost:2599/api-302/auth-sdk/v1/handle-sso',
    userInfoURL: 'https://sso.example.com/api/v1/oauth/user-info',
  },
  test_userInfo: {
    email: '<email>',
    password: '<password>',
  },
  menuData: {
    button: [
      {
        name: 'QDII',
        sub_button: [
          {
            type: 'view',
            name: 'LOF 观察',
            url: 'https://stock.datawich.com/v1/app/qdii_watch',
          },
          {
            type: 'view',
            name: 'ETF 投机',
            url: 'https://stock.datawich.com/v1/app/qdii_gaze',
          },
        ],
      },
      {
        name: '新股数据',
        sub_button: [
          {
            type: 'view',
            name: '美股打新',
            url: 'https://stock.datawich.com/v1/app/ipo_us',
          },
          {
            type: 'view',
            name: '港股打新',
            url: 'https://stock.datawich.com/v1/app/ipo_hk',
          },
          {
            type: 'view',
            name: '微牛招股中',
            url: 'https://stock.datawich.com/v1/app/webull_offering',
          },
        ],
      },
    ],
  },
}
