import { MainLayout } from './views/MainLayout'
import { SessionContext, useSession } from './services/SessionContext'
import React, { useEffect } from 'react'
import { ErrorBoundary } from './views/ErrorBoundary'
import { ConfigProvider } from 'antd'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { ProfileView } from './views/ProfileView'
import { LoginForm } from './views/LoginForm'
import { SignupForm } from './views/SignupForm'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <LoginForm />,
      },
    ],
  },
  {
    path: '/signup',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <SignupForm />,
      },
    ],
  },
  {
    path: '/profile',
    element: <ProfileView />,
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
          <RouterProvider router={router} />
        </SessionContext.Provider>
      </ConfigProvider>
    </ErrorBoundary>
  )
}
