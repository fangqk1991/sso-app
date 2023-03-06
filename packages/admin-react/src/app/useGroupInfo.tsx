import React, { useEffect, useState } from 'react'
import { MyRequest } from '@fangcha/auth-react'
import { P_GroupInfo } from '@fangcha/account-models'
import { CommonAPI } from '@fangcha/app-request'
import { CommonAppApis } from '@web/sso-common/core-api'

export const useGroupInfo = (appid: string, groupId: string, version: number) => {
  const [groupInfo, setGroupInfo] = useState<P_GroupInfo>()
  useEffect(() => {
    MyRequest(new CommonAPI(CommonAppApis.AppGroupInfoGet, appid, groupId))
      .quickSend()
      .then((response) => {
        setGroupInfo(response)
      })
  }, [appid, groupId, version])
  return groupInfo
}
