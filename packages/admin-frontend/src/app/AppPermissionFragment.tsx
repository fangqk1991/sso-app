import React from 'react'
import { PermissionTreeView } from './PermissionTreeView'
import { MyRequest } from '@fangcha/auth-react'
import { CommonAPI } from '@fangcha/app-request'
import { CommonAppApis } from '@web/sso-common/core-api'
import { Button, Divider, message } from 'antd'
import { PermissionMetaDialog } from './PermissionMetaDialog'
import { AppFragmentProtocol } from './AppFragmentProtocol'

export const AppPermissionFragment: AppFragmentProtocol = ({ appInfo, onAppInfoChanged }) => {
  return (
    <>
      <PermissionMetaDialog
        permissionMeta={appInfo.permissionMeta}
        forEditing={true}
        onSubmit={async (params) => {
          const request = MyRequest(new CommonAPI(CommonAppApis.AppUpdate, appInfo.appid))
          request.setBodyData({
            permissionMeta: params,
          })
          await request.quickSend()
          message.success('编辑成功')
          onAppInfoChanged()
        }}
        trigger={<Button type='primary'>编辑权限</Button>}
      />
      <Divider />
      <PermissionTreeView permissionMeta={appInfo.permissionMeta} />
    </>
  )
}
