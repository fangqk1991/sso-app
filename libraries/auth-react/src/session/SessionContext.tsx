import React, { useContext, useEffect, useState } from 'react'
import { AxiosBuilder } from '@fangcha/app-request'
import { AuthSdkHelper } from '../services/AuthSdkHelper'
import { AuthMode } from '@fangcha/account-models'
import { RedirectTools } from '@fangcha/auth-basic'
import { RetainedSessionApis, SessionInfo, SessionUserInfo } from '@fangcha/app-models'
import { message } from 'antd'

export interface SessionConfig {
  appName: string
  logoCss: string
  background: string
  signupAble: boolean
  hidePromotion: boolean
  beianText: string
  colorPrimary?: string
  authMode: AuthMode
  feishuValid?: boolean
  useWatermark?: boolean
  watermarkColor?: string

  useEmailLogin?: boolean
  useFeishuLogin?: boolean
  useWechatLogin?: boolean
  useWechatMPLogin?: boolean
  useGoogleLogin?: boolean
}

export const _defaultTheme: SessionConfig = {
  appName: 'Fangcha',
  background: '#f5f5f5',
  logoCss: 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)',
  signupAble: false,
  hidePromotion: false,
  beianText: '',
  colorPrimary: '',
  authMode: AuthMode.Simple,
  feishuValid: false,
  useWatermark: false,
  watermarkColor: '',

  useEmailLogin: true,
  useFeishuLogin: false,
  useWechatLogin: false,
  useWechatMPLogin: false,
  useGoogleLogin: false,
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
  userInfo: SessionUserInfo | null
  reloadSession: () => void
  allowAnonymous?: boolean
  setAllowAnonymous: (val: boolean) => void
  hasPermission: (permissionKey: string) => boolean
}

export const SessionContext = React.createContext<Context>(null as any)

export const useSession = (): Context => {
  return useContext(SessionContext)
}

export const useUserInfo = <T extends any = SessionUserInfo>(strict = false): T => {
  const sessionCtx = useSession()
  if (strict) {
    return sessionCtx.userInfo as T
  }
  return (sessionCtx.userInfo || {}) as T
}

export const useSessionConfig = (): SessionConfig => {
  const sessionCtx = useSession()
  return sessionCtx.session.config
}

export const SessionProvider: React.FC<{ allowAnonymous?: boolean; strictVersion?: boolean }> = ({
  children,
  allowAnonymous: defaultAllowAnonymous,
  strictVersion,
}: React.ComponentProps<any>) => {
  const [session, setSession] = useState(_defaultSession)
  const [already, setAlready] = useState(false)
  const [allowAnonymous, setAllowAnonymous] = useState(!!defaultAllowAnonymous)

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

        if (
          strictVersion &&
          (response.codeVersion || '').match(/^\w{8}$/) &&
          response.codeVersion !== window['commitSHA']
        ) {
          message.warning('发现新版本，正在更新...', () => window.location.reload())
          return
        }

        setAlready(true)

        const redirectTools = new RedirectTools({
          defaultRedirectUri: AuthSdkHelper.defaultRedirectUri,
          checkLogin: () => {
            return !!response.userInfo
          },
          allowAnonymous: allowAnonymous,
        })
        redirectTools.redirectIfNeed()
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const sessionCtx: Context = {
    session: session,
    userInfo: session.userInfo,
    reloadSession: reloadSession,
    allowAnonymous: allowAnonymous,
    setAllowAnonymous: setAllowAnonymous,
    hasPermission: (permissionKey: string) => {
      return (
        !!session.userInfo && !!session.userInfo.permissionKeyMap && !!session.userInfo.permissionKeyMap[permissionKey]
      )
    },
  }

  useEffect(() => {
    sessionCtx.reloadSession()
  }, [])

  if (!already) {
    return null
  }

  return <SessionContext.Provider value={sessionCtx}>{children}</SessionContext.Provider>
}
