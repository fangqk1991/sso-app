import { SsoPlugin } from '@fangcha/vue/app'
import { FrontendPluginProtocol } from '@fangcha/vue/basic'
import { AdminApp } from '@fangcha/admin-vue'
import { AuthPluginForClient, MySession } from '@fangcha/auth-vue'
import ClientListView from './views/client/ClientListView'
import ClientDetailView from './views/client/ClientDetailView'
import { KitAuthApis } from '@fangcha/backend-kit/lib/apis'
import { I18nCode, VisitorInfo } from '@fangcha/tools'
import { HomeView } from './views/HomeView'
import { AccountListView } from './views/account/AccountListView'
import { AuthMode } from '@fangcha/account-models'
import AppListView from './views/app/AppListView'
import { AppDetailView } from './views/app/AppDetailView'
import { GroupDetailView } from './views/group/GroupDetailView'

MySession.defaultRedirectUri = '/'

const _fcApp = new AdminApp({
  appName: 'SSO Admin',

  homeView: HomeView,

  refreshIfVersionChanged: true,
  loginUrl: KitAuthApis.RedirectLogin.route,
  logoutUrl: KitAuthApis.RedirectLogout.route,

  plugins: async () => {
    await _fcApp.session.reloadSessionInfo()
    const plugins: FrontendPluginProtocol[] = []
    const authMode = _fcApp.session.config['authMode'] as AuthMode
    switch (authMode) {
      case AuthMode.Simple:
        plugins.push(AuthPluginForClient())
        _fcApp.setSession(MySession)
        break
      case AuthMode.SSO:
        plugins.push(SsoPlugin())
        break
    }
    return plugins
  },

  appDidLoad: async () => {
    const navBackground = _fcApp.session.config['navBackground']
    if (navBackground) {
      _fcApp.style.appHeader!.background = navBackground
    }
  },

  reloadUserInfo: async (): Promise<VisitorInfo> => {
    const email = _fcApp.session.curUser?.email || ''
    return {
      iamId: 0,
      email: email,
      name: email,
      permissionKeyMap: {},
      // isAdmin: true,
      locale: I18nCode.en,
    }
  },

  sidebarNodes: [
    {
      titleEn: '应用管理',
      titleZh: '应用管理',
      icon: 'el-icon-s-grid',
      links: [
        {
          titleEn: 'SSO 客户端',
          titleZh: 'SSO 客户端',
          path: '/v1/client',
        },
        {
          titleEn: '权限应用',
          titleZh: '权限应用',
          path: '/v1/app',
        },
      ],
    },
    {
      titleEn: '用户管理',
      titleZh: '用户管理',
      icon: 'el-icon-user',
      links: [
        {
          titleEn: '账号管理',
          titleZh: '账号管理',
          path: '/v1/account',
        },
      ],
    },
  ],
  routes: [
    {
      path: '/v1/client',
      component: ClientListView,
      name: 'ClientListView',
    },
    {
      path: '/v1/client/:clientId',
      component: ClientDetailView,
      name: 'ClientDetailView',
    },
    {
      path: '/v1/account',
      component: AccountListView,
      name: 'AccountListView',
    },
    {
      path: '/v1/app',
      component: AppListView,
      name: 'AppListView',
    },
    {
      path: '/v1/app/:appid',
      component: AppDetailView,
      name: 'AppDetailView',
    },
    {
      path: '/v1/app/:appid/app-group/:groupId',
      component: GroupDetailView,
      name: 'GroupDetailView',
    },
  ],
})
window._fcApp = _fcApp
_fcApp.launch()
