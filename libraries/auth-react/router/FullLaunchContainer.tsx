import React from 'react'
import { ErrorBoundary } from '@ant-design/pro-components'
import { RouterProvider } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { AuthMode } from '@fangcha/account-models'
import { ReactTheme } from '@fangcha/react'
import { AuthSdkHelper, RedirectingView, SessionProvider, useSession, useSessionConfig } from '../src'
import { AuthRouter } from './AuthRouter'

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
    } else if (!sessionCtx.allowAnonymous) {
      return <RedirectingView />
    }
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

export const FullLaunchContainer: React.FC<Props> = ({ children, allowAnonymous }) => {
  return (
    <ErrorBoundary>
      <SessionProvider allowAnonymous={allowAnonymous}>
        <InnerContainer>{children}</InnerContainer>
      </SessionProvider>
    </ErrorBoundary>
  )
}
