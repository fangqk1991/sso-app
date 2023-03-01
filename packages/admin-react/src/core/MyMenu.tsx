import { ChromeFilled, CrownFilled } from '@ant-design/icons'
import { Route } from '@ant-design/pro-layout/es/typing'

export const MyMenu: Route = {
  path: '/',
  children: [
    {
      name: '  ',
      path: '/',
      children: [
        {
          name: '应用管理',
          icon: <CrownFilled />,
          // flatMenu: true,
          children: [
            {
              path: '/v1/client',
              name: 'SSO 客户端',
              icon: <CrownFilled />,
            },
          ],
        },
        {
          name: '用户管理',
          icon: <CrownFilled />,
          children: [
            {
              path: '/v1/account',
              name: '账号管理',
              icon: <CrownFilled />,
            },
          ],
        },
      ],
    },
  ],
}
