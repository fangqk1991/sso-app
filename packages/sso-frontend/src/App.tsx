import { SessionContext, useSession } from '@fangcha/auth-react'
import React, { useEffect } from 'react'
import { ErrorBoundary } from './views/ErrorBoundary'
import { ConfigProvider } from 'antd'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { AuthRoute } from '@fangcha/auth-react'

const router = createBrowserRouter([
  AuthRoute,
  {
    path: '*',
    element: <Navigate to='/login' />,
  },
])

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
          <RouterProvider router={router} />
        </SessionContext.Provider>
      </ConfigProvider>
    </ErrorBoundary>
  )
}
