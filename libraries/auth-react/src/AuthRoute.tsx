import { Navigate, RouteObject } from 'react-router-dom'
import { MainLayout } from './views/MainLayout'
import { LoginForm } from './views/LoginForm'
import { SignupForm } from './views/SignupForm'
import { ProfileView } from './views/ProfileView'
import React from 'react'
import './assets/main.scss'

export const AuthRoute: RouteObject = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/login',
      element: <LoginForm />,
    },
    {
      path: '/signup',
      element: <SignupForm />,
    },
    {
      path: '/profile',
      element: <ProfileView />,
    },
    {
      path: '/',
      element: <Navigate to='/login' />,
    },
  ],
}
