import React from 'react'
import { Button, Descriptions, Divider, message } from 'antd'
import { GroupFragmentProtocol } from './GroupFragmentProtocol'
import { NumBoolDescriptor } from '../core/NumBool'
import { GroupFormDialog } from './GroupFormDialog'
import { MyRequest } from '@fangcha/auth-react'
import { CommonAPI } from '@fangcha/app-request'
import { CommonAppApis } from '@web/sso-common/core-api'

export const GroupBasicInfoFragment: GroupFragmentProtocol = ({ groupInfo, onGroupInfoChanged }) => {
  return (
    <>
      <GroupFormDialog
        title='编辑信息'
        params={groupInfo}
        forEditing={true}
        onSubmit={async (params) => {
          const request = MyRequest(new CommonAPI(CommonAppApis.AppGroupInfoUpdate, groupInfo.appid, groupInfo.groupId))
          request.setBodyData(params)
          await request.quickSend()
          message.success('编辑成功')
          onGroupInfoChanged()
        }}
        trigger={<Button type='primary'>编辑</Button>}
      />
      <Divider />
      <Descriptions title='基本信息'>
        <Descriptions.Item label='ID'>{groupInfo.groupId}</Descriptions.Item>
        <Descriptions.Item label='Alias'>{groupInfo.groupAlias}</Descriptions.Item>
        <Descriptions.Item label='名称'>{groupInfo.name}</Descriptions.Item>
        <Descriptions.Item label='备注'>{groupInfo.remarks}</Descriptions.Item>
        <Descriptions.Item label='是否有效'>{NumBoolDescriptor.describe(groupInfo.isEnabled)}</Descriptions.Item>
        <Descriptions.Item label='创建者'>{groupInfo.author}</Descriptions.Item>
        <Descriptions.Item label='创建时间'>{groupInfo.createTime}</Descriptions.Item>
        <Descriptions.Item label='更新时间'>{groupInfo.updateTime}</Descriptions.Item>
      </Descriptions>
    </>
  )
}
