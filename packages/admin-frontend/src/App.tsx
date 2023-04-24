import React from 'react'
import { ErrorBoundary } from '@ant-design/pro-components'
import { RouterProvider } from 'react-router-dom'
import { MyRouter } from './MyRouter'
import { AuthSdkHelper, SessionProvider, useSession, useSessionConfig, VisitorProvider } from '@fangcha/auth-react'
import { AuthRouter } from '@fangcha/auth-react/router'
import { ConfigProvider, Watermark } from 'antd'
import { AuthMode } from '@fangcha/account-models'
import { LoadingView } from '@fangcha/react'
import { WebAuthApis } from '@fangcha/sso-models'
import { FeishuDepartmentProvider } from './feishu/FeishuDepartmentContext'

AuthSdkHelper.defaultRedirectUri = '/'

export const App: React.FC = () => {
  const sessionCtx = useSession()
  const config = useSessionConfig()
  if (!sessionCtx.session.userInfo) {
    if (config.authMode === AuthMode.Simple) {
      return (
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: config.colorPrimary || '#0d6efd',
            },
          }}
        >
          <SessionProvider value={sessionCtx}>
            <RouterProvider router={AuthRouter} />
          </SessionProvider>
        </ConfigProvider>
      )
    } else {
      window.location.href = `${WebAuthApis.RedirectLogin.route}?redirectUri=${encodeURIComponent(
        window.location.href
      )}`
      return <LoadingView style={{ height: '100vh' }} text='跳转中……' />
    }
  }

  const userInfo = sessionCtx.session.userInfo
  const watermarkText = config.useWatermark ? (userInfo.email || '').split('@')[0] : ''
  const watermarkColor = config.watermarkColor || '#efefef'

  return (
    <ErrorBoundary>
      <VisitorProvider>
        <FeishuDepartmentProvider feishuValid={config.feishuValid}>
          <Watermark content={watermarkText} font={{ color: watermarkColor }}>
            <RouterProvider router={MyRouter}></RouterProvider>
          </Watermark>
        </FeishuDepartmentProvider>
      </VisitorProvider>
    </ErrorBoundary>
  )
}
