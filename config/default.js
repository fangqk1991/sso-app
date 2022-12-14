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
        database: 'demo_db',
        username: 'root',
        password: '',
      },
    },
    redisCache: {
      host: '127.0.0.1',
      port: 30100,
    },
    sqlTablePrefix: '',
    WebAuth: {
      retainedUserData: {
        // 'admin@example.com': 'admin',
      },
    },
    frontendConfig: {
      appName: 'Fangcha SSO',
      background: '#f5f5f5',
      logoCss: 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)',
      signupAble: false,
    },
  },
}
