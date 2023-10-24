import { ApartmentOutlined, AppstoreOutlined, UserOutlined } from '@ant-design/icons'
import { Route } from '@ant-design/pro-layout/es/typing'
import { UserPermission } from '@web/sso-common/user-models'
import { useSessionConfig, useSessionCtx } from '@fangcha/auth-react'
import { AppPages } from './AppPages'

export const useMenu = () => {
  const sessionCtx = useSessionCtx()
  const config = useSessionConfig()

  const myMenu: Route = {
    path: '/',
    children: [
      {
        key: 'M_User',
        name: '用户管理',
        icon: <UserOutlined />,
        children: [
          {
            path: AppPages.ClientListRoute,
            name: 'SSO 客户端',
            // hideInMenu: !visitorCtx.userInfo.isAdmin && !visitorCtx.hasPermission(UserPermission.M_User_SsoClient),
          },
          {
            path: AppPages.AccountListRoute,
            name: '账号管理',
            hideInMenu: !sessionCtx.userInfo.isAdmin && !sessionCtx.hasPermission(UserPermission.M_User_Account),
          },
        ],
      },
      {
        key: 'M_DataHosting',
        name: '数据托管',
        icon: <AppstoreOutlined />,
        children: [
          {
            path: AppPages.AppListRoute,
            name: '权限应用',
            // hideInMenu:
            //   !visitorCtx.userInfo.isAdmin && !visitorCtx.hasPermission(UserPermission.M_DataHosting_PermissionApps),
          },
        ],
      },
      {
        key: 'M_Enterprise',
        name: '员工管理',
        icon: <ApartmentOutlined />,
        hideInMenu: !config.feishuValid,
        children: [
          {
            path: AppPages.EnterpriseFeishuRoute,
            name: '飞书组织架构',
            hideInMenu: !config.feishuValid,
          },
        ],
      },
    ],
  }
  return myMenu
}
