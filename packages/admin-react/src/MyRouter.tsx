import { createBrowserRouter } from 'react-router-dom'
import React from 'react'
import { MainLayout } from './core/MainLayout'
import { RouteErrorBoundary } from '@fangcha/react'
import { HomeView } from './core/HomeView'
import { ClientListView } from './sso-client/ClientListView'
import { AccountListView } from './account/AccountListView'
import { ClientDetailView } from './sso-client/ClientDetailView'

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
        path: '/v1/client/:clientId',
        element: <ClientDetailView />,
      },
      {
        path: '/v1/account',
        element: <AccountListView />,
      },
      {
        path: '*',
        element: <div>404 Not Found</div>,
      },
    ],
  },
])
