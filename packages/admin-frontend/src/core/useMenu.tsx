import { AppstoreOutlined, UserOutlined } from '@ant-design/icons'
import { Route } from '@ant-design/pro-layout/es/typing'
import { UserPermission } from '@web/sso-common/user-models'
import { useVisitorCtx } from '@fangcha/auth-react'

export const useMenu = () => {
  const visitorCtx = useVisitorCtx()

  const myMenu: Route = {
    path: '/',
    children: [
      {
        key: 'M_User',
        name: '用户管理',
        icon: <UserOutlined />,
        children: [
          {
            path: '/v1/client',
            name: 'SSO 客户端',
            hideInMenu: !visitorCtx.userInfo.isAdmin && !visitorCtx.hasPermission(UserPermission.M_User_SsoClient),
          },
          {
            path: '/v1/account',
            name: '账号管理',
            hideInMenu: !visitorCtx.userInfo.isAdmin && !visitorCtx.hasPermission(UserPermission.M_User_Account),
          },
        ],
      },
      {
        key: 'M_DataHosting',
        name: '数据托管',
        icon: <AppstoreOutlined />,
        children: [
          {
            path: '/v1/app',
            name: '权限应用',
            hideInMenu:
              !visitorCtx.userInfo.isAdmin && !visitorCtx.hasPermission(UserPermission.M_DataHosting_PermissionApps),
          },
        ],
      },
    ],
  }
  return myMenu
}
