import { createBrowserRouter } from 'react-router-dom'
import React from 'react'
import { MainLayout } from './core/MainLayout'
import { RouteErrorBoundary } from '@fangcha/react'
import { HomeView } from './core/HomeView'
import { ClientListView } from './sso-client/ClientListView'
import { AccountListView } from './account/AccountListView'
import { ClientDetailView } from './sso-client/ClientDetailView'
import { AppListView } from './app/AppListView'
import { AppDetailView } from './app/AppDetailView'
import { AppAccessListView } from './app/AppAccessListView'
import { GroupDetailView } from './app/GroupDetailView'
import { FeishuDepartmentMainView } from './feishu/FeishuDepartmentMainView'
import { GroupAccessListView } from './app/GroupAccessListView'
import { AppPages } from './core/AppPages'

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
        path: AppPages.ClientListRoute,
        element: <ClientListView />,
      },
      {
        path: AppPages.ClientDetailRoute,
        element: <ClientDetailView />,
      },
      {
        path: AppPages.AccountListRoute,
        element: <AccountListView />,
      },
      {
        path: AppPages.AppListRoute,
        element: <AppListView />,
      },
      {
        path: AppPages.AppDetailRoute,
        element: <AppDetailView />,
      },
      {
        path: AppPages.AppAccessRoute,
        element: <AppAccessListView />,
      },
      {
        path: AppPages.GroupDetailRoute,
        element: <GroupDetailView />,
      },
      {
        path: AppPages.GroupAccessRoute,
        element: <GroupAccessListView />,
      },
      {
        path: AppPages.EnterpriseFeishuRoute,
        element: <FeishuDepartmentMainView />,
      },
      {
        path: '*',
        element: <div>404 Not Found</div>,
      },
    ],
  },
])
