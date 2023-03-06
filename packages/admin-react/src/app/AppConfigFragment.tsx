import React from 'react'
import { MyRequest } from '@fangcha/auth-react'
import { Button, Divider, message } from 'antd'
import { CommonAPI } from '@fangcha/app-request'
import { P_AppInfo } from '@fangcha/account-models'
import { CommonAppApis } from '@web/sso-common/core-api'
import { JsonEditorDialog } from '../core/JsonEditorDialog'
import { JsonPre } from '../core/JsonPre'

interface Props {
  appInfo: P_AppInfo
  onAppInfoChanged: () => void
}

export const AppConfigFragment: React.FC<Props> = ({ appInfo, onAppInfoChanged }) => {
  return (
    <>
      <JsonEditorDialog
        title='编辑应用配置'
        data={appInfo.configData}
        onSubmit={async (data) => {
          const request = MyRequest(new CommonAPI(new CommonAPI(CommonAppApis.AppUpdate, appInfo.appid)))
          request.setBodyData({
            configData: data,
          })
          await request.quickSend()
          message.success('更新成功')
          onAppInfoChanged()
        }}
        trigger={<Button type='primary'>编辑应用配置</Button>}
      />
      <Divider />
      <JsonPre value={appInfo.configData} />
    </>
  )
}
