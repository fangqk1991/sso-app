module.exports = {
  Env: 'It will be rewritten by process.env.NODE_CONFIG_ENV or process.env.NODE_ENV',
  Tags: [],
  FangchaAuth: {
    configVersion: '0.0.0',
    wecomBotKey: '',
    webBaseURL: 'http://localhost:2699',
    webPort_frontend: 2699,
    webPort: 2700,
    webJwtKey: 'sso_web_jwt_key',
    webJwtSecret: '<TmplDemo Random 32>',
    mysql: {
      ssoDB: {
        host: '127.0.0.1',
        port: 3306,
        dialect: 'mysql',
        database: 'fangcha_sso',
        username: 'root',
        password: '',
      },
    },
    redisCache: {
      host: '127.0.0.1',
      port: 30100,
    },
    ssoTableOptions: {
      tableName_SsoClient: 'sso_client',
      tableName_UserAuth: 'user_auth',
    },
    WebAuth: {
      retainedUserData: {
        // 'admin@example.com': 'admin',
      },
      accountTableOptions: {
        tableName_Account: 'fc_account',
        tableName_AccountCarrier: 'fc_account_carrier',
        tableName_AccountCarrierExtras: 'fc_account_carrier_extras',
      },
    },
  },
}
