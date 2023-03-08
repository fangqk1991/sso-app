import React from 'react'
import { PermissionTreeView } from './PermissionTreeView'
import { MyRequest } from '@fangcha/auth-react/antd'
import { CommonAPI } from '@fangcha/app-request'
import { CommonAppApis } from '@web/sso-common/core-api'
import { Button, Divider, message } from 'antd'
import { GroupFragmentProtocol } from './GroupFragmentProtocol'
import { PermissionEditorDialog } from './PermissionEditorDialog'

export const GroupPermissionFragment: GroupFragmentProtocol = ({ appInfo, groupInfo, onGroupInfoChanged }) => {
  return (
    <>
      <PermissionEditorDialog
        permissionMeta={appInfo.permissionMeta}
        checkedKeys={groupInfo.permissionKeys}
        forEditing={true}
        onSubmit={async (diffItems) => {
          const request = MyRequest(
            new CommonAPI(CommonAppApis.AppGroupPermissionUpdate, appInfo.appid, groupInfo.groupId)
          )
          request.setBodyData(diffItems)
          await request.quickSend()
          message.success('编辑成功')
          onGroupInfoChanged()
        }}
        trigger={<Button type='primary'>编辑权限</Button>}
      />
      <Divider />
      <PermissionTreeView
        permissionMeta={appInfo.permissionMeta}
        checkable={true}
        defaultCheckedKeys={groupInfo.permissionKeys}
        readonly={true}
      />
    </>
  )
}
