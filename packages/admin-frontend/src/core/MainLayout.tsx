import { UserOutlined } from '@ant-design/icons'
import { PageContainer, ProLayout } from '@ant-design/pro-layout'
import React from 'react'
import { Dropdown } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AuthSdkHelper, useSessionConfig, useUserInfo } from '@fangcha/auth-react'
import { RouterLink } from '@fangcha/react'
import { useMenu } from './useMenu'

export const MainLayout: React.FC = () => {
  const config = useSessionConfig()
  const userInfo = useUserInfo()

  const location = useLocation()
  const navigate = useNavigate()
  const myMenu = useMenu()

  return (
    <ProLayout
      logo={null}
      title={config.appName || 'SSO Admin'}
      fixSiderbar={true}
      layout='mix'
      splitMenus={false}
      defaultCollapsed={false}
      route={myMenu}
      location={{
        pathname: location.pathname,
      }}
      onMenuHeaderClick={() => navigate('/')}
      menu={{
        type: 'sub',
        defaultOpenAll: true,
        ignoreFlatMenu: true,
        defaultOpenKeys: ['M_User', 'M_DataHosting', 'M_Enterprise'],
      }}
      avatarProps={{
        icon: <UserOutlined />,
        render: (avatarProps, avatar) => {
          return (
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'logout',
                    label: 'Logout',
                    onClick: () => {
                      window.location.href = AuthSdkHelper.logoutUrl()
                    },
                  },
                ],
              }}
              trigger={['click']}
            >
              <div>
                {avatar}
                <span
                  style={{
                    marginInlineStart: 8,
                    userSelect: 'none',
                  }}
                >
                  {userInfo.email}
                </span>

                {/*<Space>*/}
                {/*  Click me*/}
                {/*  <DownOutlined />*/}
                {/*</Space>*/}
              </div>
            </Dropdown>

            // <div
            //   onClick={() => {
            //     console.info('onclick')
            //   }}
            // >
            // </div>
          )
        },
      }}
      // actionsRender 必须定义，否则会影响 avatarProps 的生效
      actionsRender={() => {
        return []
      }}
      menuItemRender={(item, dom) => <RouterLink route={item.path || '/'}>{dom}</RouterLink>}
    >
      <PageContainer
        header={{
          title: '',
          // 隐藏面包屑
          breadcrumb: {},
        }}
      >
        <Outlet />
      </PageContainer>
    </ProLayout>
  )
}
