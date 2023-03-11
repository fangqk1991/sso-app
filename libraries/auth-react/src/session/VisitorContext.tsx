import React, { useContext, useEffect, useState } from 'react'
import { SessionHTTP, SessionUserInfo } from './SessionHTTP'

interface Context {
  userInfo: SessionUserInfo
  reloadUserInfo: () => void
  hasPermission: (permissionKey: string) => boolean
}

const VisitorContext = React.createContext<Context>(null as any)

export const useVisitorCtx = () => {
  return useContext(VisitorContext)
}

export const VisitorProvider = ({ children }: React.ComponentProps<any>) => {
  const [userInfo, setUserInfo] = useState<SessionUserInfo>({
    email: '',
    permissionKeyMap: {},
  })

  const visitorCtx: Context = {
    userInfo: userInfo,
    reloadUserInfo: () => {
      SessionHTTP.getUserInfo().then((info) => {
        setUserInfo(info)
      })
    },
    hasPermission: (permissionKey: string) => {
      return userInfo.permissionKeyMap && !!userInfo.permissionKeyMap[permissionKey]
    },
  }
  useEffect(() => {
    visitorCtx.reloadUserInfo()
  }, [])

  return <VisitorContext.Provider value={visitorCtx}>{children}</VisitorContext.Provider>
}
