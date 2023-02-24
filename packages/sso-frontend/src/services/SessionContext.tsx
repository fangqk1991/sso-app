import React, { useState } from 'react'
import { SessionInfo } from '@fangcha/backend-kit/lib/common/models'
import { AxiosBuilder } from '@fangcha/app-request'
import { RetainedSessionApis } from '@fangcha/backend-kit/lib/common/apis'
import { RedirectTools } from '@fangcha/auth-basic'

export interface SessionConfig {
  appName: string
  logoCss: string
  background: string
  signupAble: boolean
  hidePromotion: boolean
}

export const _defaultTheme: SessionConfig = {
  appName: 'Fangcha',
  background: '#f5f5f5',
  logoCss: 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)',
  signupAble: false,
  hidePromotion: false,
}

export const _defaultSession: SessionInfo<SessionConfig> = {
  env: '',
  tags: [],
  codeVersion: '',
  config: _defaultTheme,
  userInfo: null,
}

interface Context {
  session: SessionInfo<SessionConfig>
  reloadSession: () => void
}

export const SessionContext = React.createContext<Context>(null as any)

export const useSession = (): Context => {
  const [session, setSession] = useState(_defaultSession)
  const reloadSession = () => {
    console.info('reload session')
    const request = new AxiosBuilder()
    request.setApiOptions(RetainedSessionApis.SessionInfoGet)
    request
      .quickSend<SessionInfo<SessionConfig>>()
      .then((response) => {
        setSession(response)

        const redirectTools = new RedirectTools()
        redirectTools.checkLogin = () => {
          return !!response.userInfo
        }
        redirectTools.redirectIfNeed()
      })
      .catch((err) => {
        console.error(err)
      })
  }
  return {
    session: session,
    reloadSession: reloadSession,
  }
}

export const SessionProvider = ({ children }: React.ComponentProps<any>) => {
  const sessionCtx = useSession()
  return <SessionContext.Provider value={sessionCtx}>{children}</SessionContext.Provider>
}
