import { UserOutlined } from '@ant-design/icons'
import { PageContainer, ProLayout } from '@ant-design/pro-layout'
import React from 'react'
import { ConfigProvider, Dropdown } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AuthSdkHelper, useVisitorCtx } from '@fangcha/auth-react'
import { MenuRoute, MyMenu } from './MyMenu'

export const MainLayout: React.FC = () => {
  const visitorCtx = useVisitorCtx()

  const { userInfo } = visitorCtx

  const location = useLocation()
  const navigate = useNavigate()

  let curItems: MenuRoute[] = [MyMenu]
  while (curItems.length > 0) {
    const nextItems: MenuRoute[] = []
    for (const item of curItems) {
      item.hideInMenu = false
      // item.hideInMenu = !!item.permissionKey && !visitorCtx.hasPermission(item.permissionKey)
      const children = (item.children || []) as MenuRoute[]
      nextItems.push(...children)
    }
    curItems = nextItems
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0d6efd',
        },
      }}
    >
      <ProLayout
        logo={null}
        title='SSO Admin'
        fixSiderbar={true}
        layout='mix'
        splitMenus={false}
        defaultCollapsed={false}
        route={MyMenu}
        location={{
          pathname: location.pathname,
        }}
        onMenuHeaderClick={() => navigate('/')}
        menu={{
          type: 'sub',
          defaultOpenAll: true,
          ignoreFlatMenu: true,
          // params: visitorCtx.userInfo,
          // request: async (params, defaultMenuData) => {
          //   const menuItems: MenuRoute[] = [...defaultMenuData]
          //   let curItems: Route[] = [...menuItems]
          //   while (curItems.length > 0) {
          //     const nextItems: Route[] = []
          //     for (const item of curItems) {
          //       const children = item.children ? [...item.children] : []
          //       const visibleItems = children.filter(
          //         (item) => !item.permissionKey || visitorCtx.hasPermission(item.permissionKey)
          //       )
          //       item.children = visibleItems
          //       nextItems.push(...visibleItems)
          //     }
          //     curItems = nextItems
          //   }
          //   console.info(menuItems)
          //   return menuItems
          // },
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
        menuItemRender={(item, dom) => (
          <div
            onClick={() => {
              navigate(item.path || '/')
            }}
          >
            {dom}
          </div>
        )}
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
    </ConfigProvider>
  )
}
