import React from 'react'
import { ErrorBoundary } from '@ant-design/pro-components'
import { VisitorProvider } from '@fangcha/react'
import { RouterProvider } from 'react-router-dom'
import { MyRouter } from './core/MyRouter'
import { AuthRouter, SessionProvider, useSession } from '@fangcha/auth-react'
import { ConfigProvider } from 'antd'

export const App: React.FC = () => {
  const sessionCtx = useSession()

  if (!sessionCtx.session.userInfo) {
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
  }

  return (
    <ErrorBoundary>
      <VisitorProvider>
        <RouterProvider router={MyRouter}></RouterProvider>
      </VisitorProvider>
    </ErrorBoundary>
  )
}
