import React from 'react'
import { ErrorBoundary } from '@ant-design/pro-components'
import { ConfigProvider } from 'antd'
import { LoadingView, ReactTheme } from '@fangcha/react'
import { WebAuthApis } from '@fangcha/sso-models'
import { AuthSdkHelper } from './services/AuthSdkHelper'
import { SessionProvider, useSession, useSessionConfig } from './session/SessionContext'

AuthSdkHelper.defaultRedirectUri = '/'

interface Props extends React.ComponentProps<any> {
  allowAnonymous?: boolean
}

const InnerContainer: React.FC<React.ComponentProps<any>> = ({ children }) => {
  const sessionCtx = useSession()
  const config = useSessionConfig()
  ReactTheme.colorPrimary = config.colorPrimary || ReactTheme.colorPrimary || '#0d6efd'

  if (!sessionCtx.session.userInfo) {
    window.location.href = `${WebAuthApis.RedirectLogin.route}?redirectUri=${encodeURIComponent(window.location.href)}`
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
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: ReactTheme.colorPrimary,
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}

export const LaunchContainer: React.FC<Props> = ({ children }) => {
  return (
    <ErrorBoundary>
      <SessionProvider allowAnonymous={false}>
        <InnerContainer>{children}</InnerContainer>
      </SessionProvider>
    </ErrorBoundary>
  )
}
