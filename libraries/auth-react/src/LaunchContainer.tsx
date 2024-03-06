import React from 'react'
import { ErrorBoundary } from '@ant-design/pro-components'
import { ConfigProvider } from 'antd'
import { ReactTheme } from '@fangcha/react'
import { AuthSdkHelper } from './services/AuthSdkHelper'
import { SessionProvider, useSession, useSessionConfig } from './session/SessionContext'
import { RedirectingView } from './RedirectingView'

AuthSdkHelper.defaultRedirectUri = '/'

interface Props extends React.ComponentProps<any> {
  allowAnonymous?: boolean
}

const InnerContainer: React.FC<React.ComponentProps<any>> = ({ children }) => {
  const sessionCtx = useSession()
  const config = useSessionConfig()
  ReactTheme.colorPrimary = config.colorPrimary || ReactTheme.colorPrimary || '#0d6efd'

  if (!sessionCtx.allowAnonymous && !sessionCtx.session.userInfo) {
    return <RedirectingView />
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

export const LaunchContainer: React.FC<Props> = ({ children, allowAnonymous }) => {
  return (
    <ErrorBoundary>
      <SessionProvider allowAnonymous={allowAnonymous}>
        <InnerContainer>{children}</InnerContainer>
      </SessionProvider>
    </ErrorBoundary>
  )
}
