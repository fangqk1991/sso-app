import React from 'react'
import { ErrorBoundary } from '@ant-design/pro-components'
import { ConfigProvider } from 'antd'
import { LoadingView } from '@fangcha/react'
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
  if (!sessionCtx.session.userInfo) {
    window.location.href = `${WebAuthApis.RedirectLogin.route}?redirectUri=${encodeURIComponent(window.location.href)}`
    return (
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: config.colorPrimary || '#0d6efd',
          },
        }}
      >
        <LoadingView style={{ height: '100vh' }} text='跳转中……' />
      </ConfigProvider>
    )
  }
  return children
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
