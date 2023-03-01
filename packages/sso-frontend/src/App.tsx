import { AuthRouter, AuthSdkHelper, SessionContext, useSession } from '@fangcha/auth-react'
import React, { useEffect } from 'react'
import { ErrorBoundary } from './views/ErrorBoundary'
import { ConfigProvider } from 'antd'
import { RouterProvider } from 'react-router-dom'

AuthSdkHelper.forClientSDK = false

export const App = () => {
  const sessionCtx = useSession()
  useEffect(() => {
    sessionCtx.reloadSession()
  }, [])
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
