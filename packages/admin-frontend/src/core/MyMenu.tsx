import { AppstoreOutlined, UserOutlined } from '@ant-design/icons'
import { Route } from '@ant-design/pro-layout/es/typing'
import { UserPermission } from '@web/sso-common/user-models'

export type MenuRoute = Route & {
  permissionKey?: UserPermission
}

export const MyMenu: MenuRoute = {
  path: '/',
  children: [
    {
      name: '用户管理',
      icon: <UserOutlined />,
      children: [
        {
          path: '/v1/client',
          name: 'SSO 客户端',
          permissionKey: UserPermission.M_User_SsoClient,
        },
        {
          path: '/v1/account',
          name: '账号管理',
          // permissionKey: UserPermission.M_User_Account,
        },
      ],
    },
    {
      name: '数据托管',
      icon: <AppstoreOutlined />,
      // flatMenu: true,
      children: [
        {
          path: '/v1/app',
          name: '权限应用',
          permissionKey: UserPermission.M_DataHosting_PermissionApps,
        },
      ],
    },
  ],
}
