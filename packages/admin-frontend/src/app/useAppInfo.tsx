import React, { useEffect, useState } from 'react'
import { MyRequest } from '@fangcha/auth-react/antd'
import { P_AppInfo } from '@fangcha/account-models'
import { CommonAPI } from '@fangcha/app-request'
import { CommonAppApis } from '@web/sso-common/core-api'

export const useAppInfo = (appid: string, version: number) => {
  const [appInfo, setAppInfo] = useState<P_AppInfo>()
  useEffect(() => {
    MyRequest(new CommonAPI(CommonAppApis.AppInfoGet, appid))
      .quickSend()
      .then((response) => {
        setAppInfo(response)
      })
  }, [appid, version])
  return appInfo
}
