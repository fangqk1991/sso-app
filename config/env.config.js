const envData = process.env || {}

const retainedUserData = {}
if (envData.Auth_User) {
  retainedUserData[envData.Auth_User] = envData.Auth_Password
}
module.exports = {
  FangchaAuth: {
    configVersion: envData.configVersion,
    wecomBotKey: envData.wecomBotKey,
    webBaseURL: envData.webBaseURL,
    webJwtKey: envData.webJwtKey,
    webJwtSecret: envData.webJwtSecret,
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
    ssoTableOptions: {
      tableName_SsoClient: envData.DB_Table_SsoClient,
      tableName_UserAuth: envData.DB_Table_UserAuth,
    },
    WebAuth: {
      retainedUserData: retainedUserData,
      accountTableOptions: {
        tableName_Account: envData.DB_Table_Account,
        tableName_AccountCarrier: envData.DB_Table_AccountCarrier,
        tableName_AccountCarrierExtras: envData.DB_Table_AccountCarrierExtras,
      },
    },
  },
}
