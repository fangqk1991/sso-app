import { MainLayout } from './views/MainLayout'
import { _defaultSession, SessionConfig, SessionContext } from './services/SessionContext'
import React, { useEffect, useState } from 'react'
import { AxiosBuilder } from '@fangcha/app-request'
import { RetainedSessionApis } from '@fangcha/backend-kit/lib/common/apis'
import { SessionInfo } from '@fangcha/backend-kit/lib/common/models'
import { ErrorBoundary } from './views/ErrorBoundary'
import { ConfigProvider } from 'antd'

export const App = () => {
  const [session, setSession] = useState(_defaultSession)
  useEffect(() => {
    const request = new AxiosBuilder()
    request.setApiOptions(RetainedSessionApis.SessionInfoGet)
    request
      .quickSend<SessionInfo<SessionConfig>>()
      .then((response) => {
        setSession(response)
      })
      .catch((err) => {
        console.error(err)
      })
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
        <SessionContext.Provider value={{ session: session, setSession: setSession }}>
          <MainLayout />
        </SessionContext.Provider>
      </ConfigProvider>
    </ErrorBoundary>
  )
}
