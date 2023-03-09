import { AppstoreOutlined, UserOutlined } from '@ant-design/icons'
import { Route } from '@ant-design/pro-layout/es/typing'

export const MyMenu: Route = {
  path: '/',
  children: [
    {
      name: '  ',
      path: '/',
      children: [
        {
          name: '用户管理',
          icon: <UserOutlined />,
          children: [
            {
              path: '/v1/client',
              name: 'SSO 客户端',
            },
            {
              path: '/v1/account',
              name: '账号管理',
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
            },
          ],
        },
      ],
    },
  ],
}
