import React, { useContext, useEffect, useState } from 'react'
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
  beianText: string
  colorPrimary?: string
}

export const _defaultTheme: SessionConfig = {
  appName: 'Fangcha',
  background: '#f5f5f5',
  logoCss: 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)',
  signupAble: false,
  hidePromotion: false,
  beianText: '',
  colorPrimary: '',
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
  return useContext(SessionContext)
}

export const SessionProvider = ({ children }: React.ComponentProps<any>) => {
  const [session, setSession] = useState(_defaultSession)
  const [already, setAlready] = useState(false)

  const reloadSession = () => {
    console.info('reload session')
    const request = new AxiosBuilder()
    request.setApiOptions(RetainedSessionApis.SessionInfoGet)
    request
      .quickSend<SessionInfo<SessionConfig>>()
      .then((response) => {
        setSession({
          ...response,
          config: {
            ..._defaultTheme,
            ...response.config,
          },
        })
        setAlready(true)

        const redirectTools = new RedirectTools({
          checkLogin: () => {
            return !!response.userInfo
          },
        })
        redirectTools.redirectIfNeed()
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const sessionCtx: Context = {
    session: session,
    reloadSession: reloadSession,
  }

  useEffect(() => {
    sessionCtx.reloadSession()
  }, [])

  if (!already) {
    return null
  }

  return <SessionContext.Provider value={sessionCtx}>{children}</SessionContext.Provider>
}
