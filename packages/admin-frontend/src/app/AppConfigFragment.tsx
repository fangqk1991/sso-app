import React from 'react'
import { MyRequest } from '@fangcha/auth-react'
import { Button, Divider, message } from 'antd'
import { CommonAPI } from '@fangcha/app-request'
import { CommonAppApis } from '@web/sso-common/core-api'
import { JsonEditorDialog } from '@fangcha/admin-react'
import { JsonPre } from '@fangcha/admin-react'
import { AppFragmentProtocol } from './AppFragmentProtocol'

export const AppConfigFragment: AppFragmentProtocol = ({ appInfo, onAppInfoChanged }) => {
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
