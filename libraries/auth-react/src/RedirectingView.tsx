import React, { useEffect } from 'react'
import { ConfigProvider } from 'antd'
import { LoadingView, ReactTheme } from '@fangcha/react'
import { WebAuthApis } from '@fangcha/sso-models'

export const RedirectingView: React.FC = () => {
  useEffect(() => {
    window.location.href = `${WebAuthApis.RedirectLogin.route}?redirectUri=${encodeURIComponent(window.location.href)}`
  }, [])
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: ReactTheme.colorPrimary,
        },
      }}
    >
      <LoadingView style={{ height: '100vh' }} text='跳转中……' />
    </ConfigProvider>
  )
}
