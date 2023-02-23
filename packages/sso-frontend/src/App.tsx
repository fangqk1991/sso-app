import { MainLayout } from './views/MainLayout'
import { SessionContext, SessionProvider, useSession } from './services/SessionContext'
import React, { useEffect } from 'react'
import { ErrorBoundary } from './views/ErrorBoundary'
import { ConfigProvider } from 'antd'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { ProfileView } from './views/ProfileView'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to='/login' />,
    children: [],
  },
  {
    path: '/login',
    element: <MainLayout />,
    children: [],
  },
  {
    path: '/profile',
    element: <ProfileView />,
  },
  {
    path: '*',
    element: <div>404 Not Found</div>,
  },
])

export const App = () => {
  const sessionCtx = useSession()
  useEffect(() => {
    sessionCtx.reloadSession()
  }, [])
  return (
    <ErrorBoundary>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: 'rgb(221 115 164)',
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
