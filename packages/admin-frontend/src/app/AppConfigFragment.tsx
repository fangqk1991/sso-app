import React from 'react'
import { MyRequest } from '@fangcha/auth-react'
import { Button, Divider, message } from 'antd'
import { CommonAPI } from '@fangcha/app-request'
import { CommonAppApis } from '@web/sso-common/core-api'
import { JsonEditorDialog, JsonPre } from '@fangcha/react'
import { AppFragmentProtocol } from './AppFragmentProtocol'

export const AppConfigFragment: AppFragmentProtocol = ({ appInfo, onAppInfoChanged }) => {
  return (
    <>
      <Button
        type='primary'
        onClick={() => {
          const dialog = new JsonEditorDialog({
            title: '编辑应用配置',
            curValue: appInfo.configData,
          })
          dialog.show(async (data) => {
            const request = MyRequest(new CommonAPI(new CommonAPI(CommonAppApis.AppUpdate, appInfo.appid)))
            request.setBodyData({
              configData: data,
            })
            await request.quickSend()
            message.success('更新成功')
            onAppInfoChanged()
          })
        }}
      >
        编辑应用配置
      </Button>

      <Divider />
      <JsonPre value={appInfo.configData} />
    </>
  )
}
