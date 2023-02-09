import { MySession } from './services/MySession'
import Vue from 'vue'
import { LoginView } from './views/LoginView'
import { ProfileView } from './views/ProfileView'
import { AxiosSettings, FrontendPluginProtocol, MyAxios } from '@fangcha/vue/basic'
import 'bootstrap'
import { AccountSimpleParams } from '@fangcha/account-models'
import { LoginApis } from '@fangcha/sso-models'
import { LoginLayout } from './views/LoginLayout'
import { SignupView } from './views/SignupView'
import { KitAuthApis } from '@fangcha/backend-kit/lib/apis'

export * from './views/LoginView'
export * from './views/ProfileView'
export * from './services/MySession'
export * from './services/AuthSession'

export const AuthPluginForClient = (): FrontendPluginProtocol => {
  Vue.prototype.$session = MySession
  AxiosSettings.loginUrl = '/login'
  MySession.submitLogin = async (params: AccountSimpleParams) => {
    const request = MyAxios(KitAuthApis.Login)
    request.setBodyData(params)
    await request.quickSend()
  }
  return {
    onAppDidLoad: async () => {
      await MySession.reloadSessionInfo()
      MySession.redirectIfNeed()
    },
    independentRoutes: [
      {
        path: '/login-and-signup-layout',
        component: LoginLayout,
        children: [
          {
            path: '/login',
            component: LoginView,
            name: 'LoginView',
          },
          {
            path: '/signup',
            component: SignupView,
            name: 'SignupView',
          },
          {
            path: '/profile',
            component: ProfileView,
            name: 'ProfileView',
          },
        ],
      },
    ],
  }
}

export const AuthPluginForServer = (): FrontendPluginProtocol => {
  const plugin = AuthPluginForClient()
  MySession.logoutApiPath = LoginApis.Logout.route
  MySession.submitLogin = async (params: AccountSimpleParams) => {
    const request = MyAxios(LoginApis.LoginWithEmail)
    request.setBodyData(params)
    await request.quickSend()
  }
  return plugin
}
