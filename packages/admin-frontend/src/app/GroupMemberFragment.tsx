import React, { useEffect, useState } from 'react'
import { MyRequest } from '@fangcha/auth-react'
import { CommonAPI } from '@fangcha/app-request'
import { CommonAppApis } from '@web/sso-common/core-api'
import { Button, Divider, message, Space, Tag } from 'antd'
import { GroupFragmentProtocol } from './GroupFragmentProtocol'
import { FullAccountModel, GroupCategory, P_MemberInfo } from '@fangcha/account-models'
import { ConfirmDialog, SimpleInputDialog, TableViewColumn, TableViewV2 } from '@fangcha/react'
import { DepartmentTreeView } from '../feishu/DepartmentTreeView'
import { useFeishuDepartmentCtx } from '../feishu/FeishuDepartmentContext'
import { GroupMemberDialog } from './GroupMemberDialog'
import { MemberPickerDialog } from './MemberPickerDialog'
import { formatTime } from '../core/formatTime'

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

  useEffect(() => {
    departmentCtx.fillUserMapper(memberList.map((item) => item.userId))
  }, [memberList])

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
        <Space>
          {departmentCtx.feishuValid && (
            <Button
              size={'small'}
              type='primary'
              onClick={() => {
                const dialog = new MemberPickerDialog({})
                dialog.show(async (unionId) => {
                  const request = MyRequest(
                    new CommonAPI(CommonAppApis.AppGroupMemberCreate, groupInfo.appid, groupInfo.groupId)
                  )
                  request.setBodyData({ memberList: [unionId] })
                  await request.quickSend()
                  message.success('添加成功')
                  onGroupInfoChanged()
                })
              }}
            >
              添加飞书成员
            </Button>
          )}
          <Button
            size={'small'}
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
            批量添加成员
          </Button>
        </Space>
      </div>
      <Divider style={{ margin: '12px 0' }} />

      <TableViewV2
        tableProps={{
          size: 'small',
        }}
        rowKey={(item: FullAccountModel) => {
          return item.accountUid
        }}
        columns={TableViewColumn.makeColumns<P_MemberInfo>([
          {
            title: 'ID / Email',
            render: (item) => <>{item.userId}</>,
          },
          ...(departmentCtx.feishuValid
            ? [
                {
                  title: '用户信息',
                  render: (item: P_MemberInfo) => (
                    <>
                      {departmentCtx.userMapper[item.userId] &&
                        (() => {
                          const userInfo = departmentCtx.userMapper[item.userId]!
                          return (
                            <Space>
                              {userInfo.isValid ? <Tag color={'geekblue'}>飞书用户</Tag> : <Tag>飞书用户 (不在职)</Tag>}
                              {userInfo.name}
                            </Space>
                          )
                        })()}
                    </>
                  ),
                },
              ]
            : []),
          {
            title: '备注',
            render: (item) => <>{item.remarks}</>,
          },
          {
            title: '创建时间',
            render: (item) => <span>{formatTime(item.createTime)}</span>,
          },
          {
            title: '操作',
            key: 'action',
            render: (item) => (
              <Space size='small'>
                <Button
                  type='link'
                  onClick={() => {
                    const dialog = new GroupMemberDialog({
                      title: '编辑成员',
                      params: item,
                      forEditing: true,
                    })
                    dialog.show(async (params) => {
                      const request = MyRequest(
                        new CommonAPI(
                          CommonAppApis.AppGroupMemberUpdate,
                          groupInfo.appid,
                          groupInfo.groupId,
                          item.userId
                        )
                      )
                      request.setBodyData(params)
                      await request.quickSend()
                      message.success(`编辑成功`)
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
                      content: `确定要移除用户 ${item.userId} 吗？`,
                    })
                    dialog.show(async () => {
                      const request = MyRequest(
                        new CommonAPI(
                          CommonAppApis.AppGroupMemberDelete,
                          groupInfo.appid,
                          groupInfo.groupId,
                          item.userId
                        )
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
            ),
          },
        ])}
        items={memberList}
      />
    </>
  )
}
