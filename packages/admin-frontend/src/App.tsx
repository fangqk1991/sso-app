import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { MyRouter } from './MyRouter'
import { AuthSdkHelper, RedirectingView, useSessionConfig, useUserInfo } from '@fangcha/auth-react'
import { Watermark } from 'antd'
import { FeishuDepartmentProvider } from './feishu/FeishuDepartmentContext'

AuthSdkHelper.defaultRedirectUri = '/'

export const App: React.FC = () => {
  const config = useSessionConfig()
  const userInfo = useUserInfo(true)
  if (!userInfo) {
    return <RedirectingView />
  }
  return (
    <>
      {config.useWatermark && (
        <Watermark
          style={{
            width: '100vw',
            height: '100vh',
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
          content={(userInfo.email || '').split('@')[0]}
          font={{ color: config.watermarkColor || '#0000000a' }}
        />
      )}
      <FeishuDepartmentProvider feishuValid={config.feishuValid}>
        <RouterProvider router={MyRouter}></RouterProvider>
      </FeishuDepartmentProvider>
    </>
  )
}
