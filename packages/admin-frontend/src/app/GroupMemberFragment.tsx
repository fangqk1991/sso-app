import React, { useEffect, useState } from 'react'
import { MyRequest } from '@fangcha/auth-react'
import { CommonAPI } from '@fangcha/app-request'
import { CommonAppApis } from '@web/sso-common/core-api'
import { Button, Card, Divider, message, Space, Tag } from 'antd'
import { GroupFragmentProtocol } from './GroupFragmentProtocol'
import { P_MemberInfo } from '@fangcha/account-models'
import { ConfirmDialog, SimpleInputDialog, SimplePickerDialog } from '@fangcha/react'
import { NumBoolDescriptor } from '@fangcha/tools'

export const GroupMemberFragment: GroupFragmentProtocol = ({ appInfo, groupInfo, onGroupInfoChanged }) => {
  const [memberList, setMemberList] = useState<P_MemberInfo[]>([])

  useEffect(() => {
    MyRequest(new CommonAPI(CommonAppApis.AppGroupMemberListGet, groupInfo.appid, groupInfo.groupId))
      .quickSend()
      .then((response) => {
        setMemberList(response)
      })
  }, [groupInfo])

  return (
    <>
      <Button
        type='primary'
        onClick={() => {
          const dialog = new SimpleInputDialog({
            title: '批量添加成员',
            type: 'textarea',
            description: '多个成员请用 , 或换行分割',
          })
          dialog.show(async (content) => {
            const memberList = content
              .split(/[,;\n]/)
              .map((item) => item.trim())
              .filter((item) => !!item)
            const request = MyRequest(
              new CommonAPI(CommonAppApis.AppGroupMemberCreate, groupInfo.appid, groupInfo.groupId)
            )
            request.setBodyData({ memberList: memberList })
            await request.quickSend()
            message.success('添加成功')
            onGroupInfoChanged()
          })
        }}
      >
        添加成员
      </Button>
      <Divider />
      <div>
        {memberList.map((item) => (
          <Card size={'small'} style={{ minWidth: '150px', display: 'inline-block' }} key={item.member}>
            <Space size={'small'}>
              <b>{item.member}</b>
              {!!item.isAdmin && <Tag color='geekblue'>组管理员</Tag>}
            </Space>
            <br />
            <Space size={'small'}>
              <Button
                type='link'
                onClick={() => {
                  const dialog = new SimplePickerDialog({
                    curValue: item.isAdmin,
                    options: NumBoolDescriptor.options(),
                    title: `将 ${item.member} 设为管理员`,
                  })
                  dialog.show(async (val) => {
                    const request = MyRequest(
                      new CommonAPI(CommonAppApis.AppGroupMemberUpdate, groupInfo.appid, groupInfo.groupId, item.member)
                    )
                    request.setBodyData({
                      isAdmin: val,
                    })
                    await request.quickSend()
                    message.success(`设置成功`)
                    onGroupInfoChanged()
                  })
                }}
              >
                编辑
              </Button>

              <Button
                danger
                type='link'
                onClick={() => {
                  const dialog = new ConfirmDialog({
                    content: `确定要移除用户 ${item.member} 吗？`,
                  })
                  dialog.show(async () => {
                    const request = MyRequest(
                      new CommonAPI(CommonAppApis.AppGroupMemberDelete, groupInfo.appid, groupInfo.groupId, item.member)
                    )
                    await request.quickSend()
                    message.success(`移除成功`)
                    onGroupInfoChanged()
                  })
                }}
              >
                移除
              </Button>
            </Space>
          </Card>
        ))}
      </div>
    </>
  )
}
