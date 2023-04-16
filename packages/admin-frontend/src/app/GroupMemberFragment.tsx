import React, { useEffect, useState } from 'react'
import { MyRequest } from '@fangcha/auth-react'
import { CommonAPI } from '@fangcha/app-request'
import { CommonAppApis } from '@web/sso-common/core-api'
import { Button, Card, Divider, message, Space, Tag } from 'antd'
import { GroupFragmentProtocol } from './GroupFragmentProtocol'
import { GroupCategory, P_MemberInfo } from '@fangcha/account-models'
import { ConfirmDialog, SimpleInputDialog, SimplePickerDialog } from '@fangcha/react'
import { NumBoolDescriptor } from '@fangcha/tools'
import { DepartmentTreeView } from '../feishu/DepartmentTreeView'
import { useFeishuDepartmentCtx } from '../feishu/FeishuDepartmentContext'
import { GroupMemberTag } from './GroupMemberTag'

export const GroupMemberFragment: GroupFragmentProtocol = ({ appInfo, groupInfo, onGroupInfoChanged }) => {
  const [memberList, setMemberList] = useState<P_MemberInfo[]>([])
  const departmentCtx = useFeishuDepartmentCtx()
  const curDepartmentTree = departmentCtx.getDepartmentTree(groupInfo.departmentId)

  useEffect(() => {
    MyRequest(new CommonAPI(CommonAppApis.AppGroupMemberListGet, groupInfo.appid, groupInfo.groupId))
      .quickSend()
      .then((response) => {
        setMemberList(response)
      })
  }, [groupInfo])

  return (
    <>
      {groupInfo.groupCategory === GroupCategory.Department && curDepartmentTree && (
        <>
          <h4>所绑定的部门架构</h4>
          <p>
            {groupInfo.isFullDepartment
              ? '组成员包含该部门及其子孙部门的所有员工'
              : '组成员包含该部门一级节点（不包含子孙部门）的员工'}
          </p>
          <DepartmentTreeView
            departmentNode={curDepartmentTree}
            defaultExpandAll={true}
            showMembers={!!groupInfo.isFullDepartment}
            showRootMembers={true}
          />
          <Divider />
        </>
      )}
      <div>
        <h4>{groupInfo.groupCategory === GroupCategory.Department ? '额外成员信息' : '成员信息'}</h4>
        <Button
          size={'small'}
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
      </div>
      <Divider style={{ margin: '12px 0' }} />
      <div>
        {memberList.map((item) => (
          <GroupMemberTag key={item.member} member={item} />
        ))}
        <hr />
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
