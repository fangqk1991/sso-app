# sso-app
### 准备
* MySQL 数据库、[账号数据表](https://github.com/fangqk1991/account-service/blob/master/schemas/account-service.sql)、[客户端数据表](https://github.com/fangqk1991/sso-server/blob/master/schemas/sso-server.sql) 创建
* Redis 服务启动

### 数据表创建
```
docker run -it --rm \
  -e DB_Host=${DB_Host} \
  -e DB_Port=${DB_Port} \
  -e DB_Name=${DB_Name} \
  -e DB_User=${DB_User} \
  -e DB_Password=${DB_Password} \
  fangqk1991/sso-app prepare
```

### 使用 Docker 启动

```
docker pull fangqk1991/sso-app

docker run -d --restart=unless-stopped \
  --name sso-app \
  -e ENV=production \
  -e webBaseURL=${webBaseURL} \
  -e webJwtSecret=${webJwtSecret} \
  -e DB_Host=${DB_Host} \
  -e DB_Port=${DB_Port} \
  -e DB_Name=${DB_Name} \
  -e DB_User=${DB_User} \
  -e DB_Password=${DB_Password} \
  -e Redis_Host=${Redis_Host} \
  -e Redis_Port=${Redis_Port} \
  -p 2699:2699 \
  fangqk1991/sso-app
```

### 环境变量说明
| 环境变量 | 缺省值                         | 说明 |
|:-------|:----------------------------|:---|
| `webBaseURL` | `http://localhost:2699`     | 网站 baseURL |
| `webJwtSecret` | `<TmplDemo Random 32>`      | JWT Secret |
| `DB_Host` | `127.0.0.1`                 | MySQL Host |
| `DB_Port` | `3306`                      | MySQL 端口 |
| `DB_Name` | `demo_db`               | MySQL 数据库名 |
| `DB_User` | `root`                      | MySQL 用户名 |
| `DB_Password` |                             | MySQL 用户密码 |
| `Redis_Host` | `127.0.0.1`                 | Redis Host |
| `Redis_Port` | `30100`                     | Redis 端口 |
| `DB_Table_SsoClient` | `fc_sso_client`             | SsoClient 表名 |
| `DB_Table_UserAuth` | `fc_user_auth`              | UserAuth 表名 |
| `DB_Table_Account` | `fc_account`                | Account 表名 |
| `DB_Table_AccountCarrier` | `fc_account_carrier`        | AccountCarrier 表名 |
| `DB_Table_AccountCarrierExtras` | `fc_account_carrier_extras` | AccountCarrierExtras 表名 |
