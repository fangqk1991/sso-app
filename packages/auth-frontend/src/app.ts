import { BasicApp } from '@fangcha/vue/app'
import { AxiosSettings, MyAxios } from '@fangcha/vue/basic'
import Vue from 'vue'
import 'bootstrap'
import { MySession } from './services/MySession'
import { AccountSimpleParams } from '@fangcha/account-models'
import { LoginLayout } from './views/LoginLayout'
import { LoginView } from './views/LoginView'
import { SignupView } from './views/SignupView'
import { ProfileView } from './views/ProfileView'
import { LoginApis } from '@fangcha/sso-server/src/common/web-api'

Vue.prototype.$session = MySession
AxiosSettings.loginUrl = '/login'
MySession.logoutApiPath = LoginApis.Logout.route
MySession.submitLogin = async (params: AccountSimpleParams) => {
  const request = MyAxios(LoginApis.LoginWithEmail)
  request.setBodyData(params)
  await request.quickSend()
}

const app = new BasicApp({
  appName: 'Fangcha SSO',
  session: MySession,
  appDidLoad: async () => {
    await MySession.reloadSessionInfo()
    MySession.redirectIfNeed()
  },
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
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
})
app.launch()
