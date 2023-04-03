import { GlobalAppConfig } from 'fc-config'
import { WebApp } from '@fangcha/backend-kit/lib/router'
import { _FangchaState } from '@fangcha/backend-kit'
import { SsoAdminSpecDocItems } from './admin/SsoAdminSpecDocItems'
import { SsoConfig } from '../SsoConfig'
import { WebAuthSdkPlugin } from '@fangcha/web-auth-sdk'
import { AdminUserCenter } from '@fangcha/user-sdk'
import { UserSystemCenter } from '../services/UserSystemCenter'
import { AppHandler } from '../services/AppHandler'
import { FeishuSdkPlugin } from '@fangcha/feishu-sdk'
import { MyFeishuServer } from '../services/MyFeishuServer'

const app = new WebApp({
  env: GlobalAppConfig.Env,
  tags: GlobalAppConfig.Tags,
  appName: 'sso-admin',
  wecomBotKey: SsoConfig.wecomBotKey,
  routerOptions: {
    baseURL: SsoConfig.adminBaseURL,
    backendPort: SsoConfig.adminPort,
    jwtProtocol: {
      jwtKey: SsoConfig.adminJwtKey,
      jwtSecret: SsoConfig.adminJwtSecret,
    },
  },
  mainDocItems: SsoAdminSpecDocItems,
  plugins: [
    WebAuthSdkPlugin({
      jwtOptions: {
        jwtKey: SsoConfig.adminJwtKey,
        jwtSecret: SsoConfig.adminJwtSecret,
      },
      authMode: SsoConfig.adminAuth.authMode,
      simpleAuth: {
        retainedUserData: SsoConfig.adminAuth.retainedUserData,
        // accountServer: MyAccountServer,
      },
      ssoAuth: SsoConfig.adminAuth.oauthConfig,
    }),
    FeishuSdkPlugin({
      feishuServer: MyFeishuServer,
    }),
  ],

  appDidLoad: async () => {
    AdminUserCenter.useAutoReloadingChecker({
      getAppFullInfo: async () => {
        const app = await UserSystemCenter.prepareUserSystemApp()
        return new AppHandler(app).getFullAppInfo()
      },
      getAppVersion: async () => {
        const app = await UserSystemCenter.prepareUserSystemApp()
        return app.version
      },
    })
    await AdminUserCenter.waitForReady()

    _FangchaState.transferSessionUserInfo = async (userInfo: { email: string }) => {
      return {
        ...userInfo,
        isAdmin: AdminUserCenter.checker().checkUserIsAdmin(userInfo.email),
        permissionKeyMap: AdminUserCenter.checker().getPermissionKeyMapForUser(userInfo.email),
      }
    }

    _FangchaState.frontendConfig = {
      ...SsoConfig.adminFrontendConfig,
      authMode: SsoConfig.adminAuth.authMode,
    }
  },
  checkHealth: async () => {},
})
app.launch()
