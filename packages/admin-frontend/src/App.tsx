import React from 'react'
import { ErrorBoundary } from '@ant-design/pro-components'
import { RouterProvider } from 'react-router-dom'
import { MyRouter } from './MyRouter'
import { AuthSdkHelper, SessionProvider, useSession, VisitorProvider } from '@fangcha/auth-react'
import { AuthRouter } from '@fangcha/auth-react/router'
import { ConfigProvider } from 'antd'
import { AuthMode } from '@fangcha/account-models'
import { LoadingView } from '@fangcha/admin-react'
import { WebAuthApis } from '@fangcha/sso-models'

AuthSdkHelper.defaultRedirectUri = '/'

export const App: React.FC = () => {
  const sessionCtx = useSession()

  if (!sessionCtx.session.userInfo) {
    if (sessionCtx.session.config.authMode === AuthMode.Simple) {
      return (
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: sessionCtx.session.config.colorPrimary || '#0d6efd',
            },
          }}
        >
          <SessionProvider value={sessionCtx}>
            <RouterProvider router={AuthRouter} />
          </SessionProvider>
        </ConfigProvider>
      )
    } else {
      window.location.href = `${WebAuthApis.RedirectLogin.route}?redirectUri=${encodeURIComponent(
        window.location.href
      )}`
      return <LoadingView text='跳转中……' />
    }
  }

  return (
    <ErrorBoundary>
      <VisitorProvider>
        <RouterProvider router={MyRouter}></RouterProvider>
      </VisitorProvider>
    </ErrorBoundary>
  )
}
