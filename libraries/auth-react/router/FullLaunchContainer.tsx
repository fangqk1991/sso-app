import React from 'react'
import { ErrorBoundary } from '@ant-design/pro-components'
import { RouterProvider } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { AuthMode } from '@fangcha/account-models'
import { LoadingView, ReactTheme } from '@fangcha/react'
import { AuthSdkHelper, SessionProvider, useSession, useSessionConfig } from '../src'
import { AuthRouter } from './AuthRouter'
import { WebAuthApis } from '@fangcha/sso-models'

AuthSdkHelper.defaultRedirectUri = '/'

interface Props extends React.ComponentProps<any> {
  allowAnonymous?: boolean
}

const InnerContainer: React.FC<React.ComponentProps<any>> = ({ children }) => {
  const sessionCtx = useSession()
  const config = useSessionConfig()
  ReactTheme.colorPrimary = config.colorPrimary || ReactTheme.colorPrimary || '#0d6efd'

  if (!sessionCtx.session.userInfo) {
    if (config.authMode === AuthMode.Simple) {
      sessionCtx.setAllowAnonymous(false)
      return (
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: ReactTheme.colorPrimary,
            },
          }}
        >
          <RouterProvider router={AuthRouter} />
        </ConfigProvider>
      )
    } else {
      window.location.href = `${WebAuthApis.RedirectLogin.route}?redirectUri=${encodeURIComponent(
        window.location.href
      )}`
      return (
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: ReactTheme.colorPrimary,
            },
          }}
        >
          <LoadingView style={{ height: '100vh' }} text='跳转中……' />
        </ConfigProvider>
      )
    }
  }

  return children
}

export const FullLaunchContainer: React.FC<Props> = ({ children }) => {
  return (
    <ErrorBoundary>
      <SessionProvider allowAnonymous={false}>
        <InnerContainer>{children}</InnerContainer>
      </SessionProvider>
    </ErrorBoundary>
  )
}
