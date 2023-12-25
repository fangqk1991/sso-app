import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { MyRouter } from './MyRouter'
import { AuthSdkHelper, useSession, useSessionConfig, VisitorProvider } from '@fangcha/auth-react'
import { Watermark } from 'antd'
import { FeishuDepartmentProvider } from './feishu/FeishuDepartmentContext'

AuthSdkHelper.defaultRedirectUri = '/'

export const App: React.FC = () => {
  const sessionCtx = useSession()
  const config = useSessionConfig()
  if (!sessionCtx.session.userInfo) {
    return null
  }
  return (
    <VisitorProvider>
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
    </VisitorProvider>
  )
}
