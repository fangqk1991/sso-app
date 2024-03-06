# sso-app
### Demo
* SSO 登录页: <https://sso-demo.fangcha.net/>
* 客户端 Demo: <https://app-demo.fangcha.net/>

---

### 准备
* MySQL 数据库、[数据表](https://github.com/fangqk1991/sso-app/blob/master/config/schemas.sql)
* Redis 服务启动

### 数据表初始化
通过 Docker 使用 `prepare` 命令可以创建 SSO 服务依赖的[数据表](https://github.com/fangqk1991/sso-app/blob/master/config/schemas.sql)
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
  -e adminBaseURL=${adminBaseURL} \
  -e adminJwtSecret=${adminJwtSecret} \
  -e DB_Host=${DB_Host} \
  -e DB_Port=${DB_Port} \
  -e DB_Name=${DB_Name} \
  -e DB_User=${DB_User} \
  -e DB_Password=${DB_Password} \
  -e Redis_Host=${Redis_Host} \
  -e Redis_Port=${Redis_Port} \
  -e Auth_User=${Auth_User} \
  -e Auth_Password=${Auth_Password} \
  -p 2550:2550 \
  -p 2599:2599 \
  -p 2699:2699 \
  fangqk1991/sso-app
```

### SSO 客户端、用户维护
* SSO Admin Demo: <https://sso-admin-demo.fangcha.net/>
* Demo 账号: sso-admin-demo@fangcha.net
* Demo 密码: sVUhtonaLp4N0M2EKIm5nLbtoxSwDdBN

![](https://image.fangqk.com/2024-03-06/sso-client.png)
![](https://image.fangqk.com/2024-03-06/sso-account.png)
![](https://image.fangqk.com/2024-03-06/permission-app.png)

### SSO Admin 登录鉴权
* 可以使用普通认证方式或对接标准 SSO
* 普通认证方式(authMode = 'simple'): 环境变量传递的 `Auth_User`、`Auth_Password` 即用于登录的账号密码
* SSO(authMode = 'sso'): 传递 adminSSO_xxx 环境变量，对接已有的单点登录系统

### 环境变量说明
| 环境变量 | 缺省值                         | 说明                      |
|:-------|:----------------------------|:------------------------|
| `webBaseURL` | `http://localhost:2699`     | 网站 baseURL              |
| `webJwtSecret` | `<TmplDemo Random 32>`      | JWT Secret              |
| `adminBaseURL` | `http://localhost:2599` | 网站 baseURL |
| `adminJwtSecret` | `<TmplDemo Random 32>`  | JWT Secret |
| `authMode` | `simple` | SSO Admin 鉴权模式，simple 或 sso |
| `Auth_User` |                         | SSO Admin 临时鉴权用户名 |
| `Auth_Password` |                         | SSO Admin 临时鉴权用户密码 |
| `adminSSO_baseURL` |  | SSO baseURL |
| `adminSSO_clientId` | `<clientId>` | SSO clientId |
| `adminSSO_clientSecret` | `<clientSecret>` | SSO clientSecret |
| `adminSSO_authorizePath` | `/api/v1/oauth/authorize` | SSO authorizePath |
| `adminSSO_tokenPath` | `/api/v1/oauth/token` | SSO tokenPath |
| `adminSSO_logoutPath` | `/api/v1/logout` | SSO logoutPath |
| `adminSSO_scope` | `basic` | SSO scope |
| `adminSSO_callbackUri` | `http://localhost:2599/api/v1/handleSSO` | SSO callbackUri |
| `adminSSO_userInfoURL` |  | SSO userInfoURL |
| `adminFE_appName` | `Fangcha SSO Admin`                   | SSO Admin 登录页应用名                   |
| `adminFE_background` | `linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)`                         | SSO Admin 登录页背景                    |
| `adminFE_logoCss` | `linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)` | SSO Admin 登录页 Logo 样式              |
| `adminFE_navBackground` | `#EA3323` | SSO Admin 应用导航栏背景              |
| `DB_Host` | `127.0.0.1`                 | MySQL Host              |
| `DB_Port` | `3306`                      | MySQL 端口                |
| `DB_Name` | `demo_db`                   | MySQL 数据库名              |
| `DB_User` | `root`                      | MySQL 用户名               |
| `DB_Password` |                             | MySQL 用户密码              |
| `DB_tableNamePrefix` | | 数据表前缀 |
| `Redis_Host` | `127.0.0.1`                 | Redis Host              |
| `Redis_Port` | `30100`                     | Redis 端口                |
| `FE_appName` | `Fangcha SSO` | 页面应用名 |
| `FE_background` | `#f5f5f5` | 页面背景 |
| `FE_logoCss` | `linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)` | 页面 Logo 样式 |
| `FE_signupAble` | false | 开启注册功能 |
