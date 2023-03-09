import { AuthSdkHelper, SessionContext, useSession } from '@fangcha/auth-react'
import { AuthRouter } from '@fangcha/auth-react/router'
import React from 'react'
import { ErrorBoundary } from './views/ErrorBoundary'
import { ConfigProvider } from 'antd'
import { RouterProvider } from 'react-router-dom'

AuthSdkHelper.forClientSDK = false

export const App = () => {
  const sessionCtx = useSession()
  document.title = sessionCtx.session.config.appName || 'App'

  return (
    <ErrorBoundary>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: sessionCtx.session.config.colorPrimary || '#0d6efd',
          },
        }}
      >
        <SessionContext.Provider value={sessionCtx}>
          <RouterProvider router={AuthRouter} />
        </SessionContext.Provider>
      </ConfigProvider>
    </ErrorBoundary>
  )
}
