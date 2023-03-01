import React, { useEffect } from 'react'
import { ErrorBoundary } from '@ant-design/pro-components'
import { VisitorProvider } from '@fangcha/react'
import { RouterProvider } from 'react-router-dom'
import { MyRouter } from './core/MyRouter'
import { AuthRouter, SessionContext, useSession } from '@fangcha/auth-react'
import { ConfigProvider } from 'antd'

export const App: React.FC = () => {
  const sessionCtx = useSession()
  useEffect(() => {
    sessionCtx.reloadSession()
  }, [])

  if (!sessionCtx.already) {
    return null
  }

  return (
    <ErrorBoundary>
      {sessionCtx.session.userInfo ? (
        <VisitorProvider>
          <RouterProvider router={MyRouter}></RouterProvider>
        </VisitorProvider>
      ) : (
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
      )}
    </ErrorBoundary>
  )
}
