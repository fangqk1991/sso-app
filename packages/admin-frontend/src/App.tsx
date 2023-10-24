import React from 'react'
import { ErrorBoundary } from '@ant-design/pro-components'
import { RouterProvider } from 'react-router-dom'
import { MyRouter } from './MyRouter'
import { AuthSdkHelper, useSessionConfig, useSessionCtx } from '@fangcha/auth-react'
import { AuthRouter } from '@fangcha/auth-react/router'
import { ConfigProvider, Watermark } from 'antd'
import { AuthMode } from '@fangcha/account-models'
import { LoadingView } from '@fangcha/react'
import { WebAuthApis } from '@fangcha/sso-models'
import { FeishuDepartmentProvider } from './feishu/FeishuDepartmentContext'

AuthSdkHelper.defaultRedirectUri = '/'

export const App: React.FC = () => {
  const sessionCtx = useSessionCtx()
  const config = useSessionConfig()
  if (!sessionCtx.session.userInfo) {
    if (config.authMode === AuthMode.Simple) {
      sessionCtx.setAllowAnonymous(false)
      return (
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: config.colorPrimary || '#0d6efd',
            },
          }}
        >
          <RouterProvider router={AuthRouter} />
        </ConfigProvider>
      )
    } else {
      window.location.href = `${WebAuthApis.RedirectLogin.route}?redirectUri=${encodeURIComponent(
        window.location.href
      )}`
      return <LoadingView style={{ height: '100vh' }} text='跳转中……' />
    }
  }

  return (
    <ErrorBoundary>
      {config.useWatermark && (
        <Watermark
          style={{
            width: '100vw',
            height: '100vh',
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
          content={(sessionCtx.session.userInfo.email || '').split('@')[0]}
          font={{ color: config.watermarkColor || '#0000000a' }}
        />
      )}
      <FeishuDepartmentProvider feishuValid={config.feishuValid}>
        <RouterProvider router={MyRouter}></RouterProvider>
      </FeishuDepartmentProvider>
    </ErrorBoundary>
  )
}
