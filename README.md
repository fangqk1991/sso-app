# sso-app
### Demo
* SSO 登录页: <https://sso-demo.fangcha.net/>
* 客户端 Demo: <https://app-demo.fangcha.net/>

---

### 准备
* MySQL 数据库、[数据表](https://github.com/fangqk1991/sso-app/blob/master/config/schemas.sql)
* Redis 服务启动

### 数据表初始化
通过 Docker 使用 `prepare` 命令可以创建 SSO 服务依赖的[数据表](https://github.com/fangqk1991/sso-app/blob/master/config/schemas.sql)，默认情况下为 `fc_account`、`fc_account_carrier`、`fc_account_carrier_extras`、`fc_sso_client`、`fc_user_auth`，也可以通过环境变量指定表名

```
docker run --rm \
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

### SSO 客户端、用户维护
* SSO Admin: <https://github.com/fangqk1991/sso-admin>
* SSO Admin Demo: <https://sso-admin-demo.fangcha.net/>
* Demo 账号: sso-admin-demo@fangcha.net
* Demo 密码: sVUhtonaLp4N0M2EKIm5nLbtoxSwDdBN

![](https://image.fangqk.com/2022-11-15/sso-demo-client.png)
![](https://image.fangqk.com/2022-11-15/sso-demo-user.png)

### 环境变量说明
| 环境变量 | 缺省值                         | 说明                      |
|:-------|:----------------------------|:------------------------|
| `webBaseURL` | `http://localhost:2699`     | 网站 baseURL              |
| `webJwtSecret` | `<TmplDemo Random 32>`      | JWT Secret              |
| `DB_Host` | `127.0.0.1`                 | MySQL Host              |
| `DB_Port` | `3306`                      | MySQL 端口                |
| `DB_Name` | `demo_db`                   | MySQL 数据库名              |
| `DB_User` | `root`                      | MySQL 用户名               |
| `DB_Password` |                             | MySQL 用户密码              |
| `Redis_Host` | `127.0.0.1`                 | Redis Host              |
| `Redis_Port` | `30100`                     | Redis 端口                |
| `DB_Table_SsoClient` | `fc_sso_client`             | SsoClient 表名            |
| `DB_Table_UserAuth` | `fc_user_auth`              | UserAuth 表名             |
| `DB_Table_Account` | `fc_account`                | Account 表名              |
| `DB_Table_AccountCarrier` | `fc_account_carrier`        | AccountCarrier 表名       |
| `DB_Table_AccountCarrierExtras` | `fc_account_carrier_extras` | AccountCarrierExtras 表名 |
| `FE_appName` | `Fangcha SSO` | 页面应用名 |
| `FE_background` | `#f5f5f5` | 页面背景 |
| `FE_logoCss` | `linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)` | 页面 Logo 样式 |
| `FE_signupAble` | false | 开启注册功能 |
