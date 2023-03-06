import React from 'react'
import { ErrorBoundary } from '@ant-design/pro-components'
import { VisitorProvider } from '@fangcha/react'
import { RouterProvider } from 'react-router-dom'
import { MyRouter } from './MyRouter'
import { AuthRouter, AuthSdkHelper, SessionProvider, useSession } from '@fangcha/auth-react'
import { ConfigProvider } from 'antd'
import { AuthMode } from '@fangcha/account-models'
import { KitAuthApis } from '@fangcha/backend-kit/lib/apis'
import { LoadingView } from './core/LoadingView'

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
      window.location.href = `${KitAuthApis.RedirectLogin.route}?redirectUri=${encodeURIComponent(
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
