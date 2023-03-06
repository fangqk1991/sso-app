import React from 'react'
import { P_AppInfo } from '@fangcha/account-models'
import { PermissionTreeView } from './PermissionTreeView'
import { AppFormDialog } from './AppFormDialog'
import { MyRequest } from '@fangcha/auth-react'
import { CommonAPI } from '@fangcha/app-request'
import { CommonAppApis } from '@web/sso-common/core-api'
import { Button, Divider, message } from 'antd'
import { PermissionMetaDialog } from './PermissionMetaDialog'

interface Props {
  appInfo: P_AppInfo
  onAppInfoChanged: () => void
}

export const AppPermissionFragment: React.FC<Props> = ({ appInfo, onAppInfoChanged }) => {
  return (
    <>
      <PermissionMetaDialog
        permissionMeta={appInfo.permissionMeta}
        forEditing={true}
        onSubmit={async (params) => {
          const request = MyRequest(new CommonAPI(CommonAppApis.AppUpdate, appInfo.appid))
          request.setBodyData({
            permissionMeta: params
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
