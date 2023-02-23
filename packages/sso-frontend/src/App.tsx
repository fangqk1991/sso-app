import { MainLayout } from './views/MainLayout'
import { SessionContext, SessionProvider, useSession } from './services/SessionContext'
import React, { useEffect } from 'react'
import { ErrorBoundary } from './views/ErrorBoundary'
import { ConfigProvider } from 'antd'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { ProfileView } from './views/ProfileView'

const visitorRouter = createBrowserRouter([
  {
    path: '/profile',
    element: <ProfileView />,
  },
  {
    path: '*',
    element: <ProfileView />,
  },
])

const anonymousRouter = createBrowserRouter([
  {
    path: '/login',
    element: <MainLayout />,
    children: [],
  },
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
          {sessionCtx.session.userInfo ? <RouterProvider router={visitorRouter} /> : <RouterProvider router={anonymousRouter} />}
        </SessionContext.Provider>
      </ConfigProvider>
    </ErrorBoundary>
  )
}
