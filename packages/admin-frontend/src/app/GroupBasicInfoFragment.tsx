import React from 'react'
import { Button, Descriptions, message } from 'antd'
import { GroupFragmentProtocol } from './GroupFragmentProtocol'
import { GroupFormDialog } from './GroupFormDialog'
import { MyRequest } from '@fangcha/auth-react'
import { CommonAPI } from '@fangcha/app-request'
import { CommonAppApis } from '@web/sso-common/core-api'
import { NumBoolDescriptor } from '@fangcha/tools'
import { AppType } from '@fangcha/account-models'
import { Link } from 'react-router-dom'
import { formatTime } from '../core/formatTime'

export const GroupBasicInfoFragment: GroupFragmentProtocol = ({ appInfo, groupInfo, onGroupInfoChanged }) => {
  return (
    <>
      <Descriptions
        title={
          <div>
            <h4>基本信息</h4>
            <Button
              type='primary'
              size={'small'}
              onClick={() => {
                const dialog = new GroupFormDialog({
                  title: '编辑用户组',
                  params: groupInfo,
                  forEditing: true,
                })
                dialog.show(async (params) => {
                  const request = MyRequest(
                    new CommonAPI(CommonAppApis.AppGroupInfoUpdate, groupInfo.appid, groupInfo.groupId)
                  )
                  request.setBodyData(params)
                  await request.quickSend()
                  message.success('编辑成功')
                  onGroupInfoChanged()
                })
              }}
            >
              编辑
            </Button>
          </div>
        }
      >
        <Descriptions.Item label='ID'>{groupInfo.groupId}</Descriptions.Item>
        <Descriptions.Item label='Alias'>{groupInfo.groupAlias}</Descriptions.Item>
        <Descriptions.Item label='名称'>{groupInfo.name}</Descriptions.Item>
        <Descriptions.Item label='备注'>{groupInfo.remarks}</Descriptions.Item>
        <Descriptions.Item label='是否有效'>{NumBoolDescriptor.describe(groupInfo.isEnabled)}</Descriptions.Item>
        <Descriptions.Item label='创建者'>{groupInfo.author}</Descriptions.Item>
        <Descriptions.Item label='创建时间'>{formatTime(groupInfo.createTime)}</Descriptions.Item>

        {appInfo.appType === AppType.Open && (
          <Descriptions.Item label='操作'>
            <Link to={{ pathname: `/v1/app/${appInfo.appid}/group/${groupInfo.groupId}/access` }}>密钥管理</Link>
          </Descriptions.Item>
        )}
      </Descriptions>
    </>
  )
}
