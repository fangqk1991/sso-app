import { createBrowserRouter } from 'react-router-dom'
import React from 'react'
import { MainLayout } from './core/MainLayout'
import { RouteErrorBoundary } from '@fangcha/react'
import { HomeView } from './core/HomeView'
import { ClientListView } from './sso-client/ClientListView'

export const MyRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: '/',
        element: <HomeView />,
      },
      {
        path: '/v1/client',
        element: <ClientListView />,
      },
      {
        path: '*',
        element: <div>404 Not Found</div>,
      },
    ],
  },
])
