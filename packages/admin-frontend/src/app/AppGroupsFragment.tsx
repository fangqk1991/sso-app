import React, { useState } from 'react'
import { AppFragmentProtocol } from './AppFragmentProtocol'
import { Button, Divider, message, Space, Tag } from 'antd'
import { MyRequest } from '@fangcha/auth-react'
import { ConfirmDialog, JsonEditorDialog, RouterLink, TableView } from '@fangcha/react'
import { GroupCategory, P_GroupInfo } from '@fangcha/account-models'
import { CommonAPI } from '@fangcha/app-request'
import { CommonAppApis } from '@web/sso-common/core-api'
import { PageResult } from '@fangcha/tools'
import { GroupFormDialog } from './GroupFormDialog'
import { useFeishuDepartmentCtx } from '../feishu/FeishuDepartmentContext'
import { formatTime } from '../core/formatTime'
import { AppPages } from '../core/AppPages'

export const AppGroupsFragment: AppFragmentProtocol = ({ appInfo }) => {
  const departmentCtx = useFeishuDepartmentCtx()
  const [version, setVersion] = useState(0)
  return (
    <div>
      <Space>
        <Button
          type='primary'
          onClick={() => {
            const dialog = new GroupFormDialog({
              title: '创建用户组',
            })
            dialog.show(async (params) => {
              const request = MyRequest(new CommonAPI(CommonAppApis.AppGroupCreate, appInfo.appid))
              request.setBodyData(params)
              await request.quickSend()
              message.success('创建成功')
              setVersion(version + 1)
            })
          }}
        >
          创建
        </Button>

        <Button
          onClick={() => {
            const dialog = new JsonEditorDialog({
              title: '导入用户组',
            })
            dialog.show(async (params) => {
              const request = MyRequest(new CommonAPI(CommonAppApis.AppGroupFullCreate, appInfo.appid))
              request.setBodyData(params)
              await request.quickSend()
              message.success('导入成功')
              setVersion(version + 1)
            })
          }}
        >
          导入
        </Button>
      </Space>
      <Divider />
      <TableView
        version={version}
        rowKey={(item: P_GroupInfo) => {
          return item.groupId
        }}
        columns={[
          {
            title: 'Name',
            render: (item: P_GroupInfo) => (
              <>
                <Space>
                  <RouterLink
                    route={AppPages.GroupDetailRoute}
                    params={{ appid: appInfo.appid, groupId: item.groupId }}
                  >
                    {item.name}
                  </RouterLink>
                  {item.groupCategory === GroupCategory.Department && item.departmentId && (
                    <Tag color={'geekblue'}>{departmentCtx.getFullDepartmentName(item.departmentId)}</Tag>
                  )}
                </Space>
                <br />
                <span>Alias: {item.groupAlias}</span>
              </>
            ),
          },
          {
            title: '创建时间 / 更新时间',
            render: (item: P_GroupInfo) => (
              <>
                <span>{formatTime(item.createTime)}</span>
                <br />
                <span>{formatTime(item.updateTime)}</span>
              </>
            ),
          },
          {
            title: 'Action',
            key: 'action',
            render: (item: P_GroupInfo) => (
              <Space size='small'>
                <Button
                  type='link'
                  onClick={() => {
                    const dialog = new GroupFormDialog({
                      title: '编辑用户组',
                      params: item,
                      forEditing: true,
                    })
                    dialog.show(async (params) => {
                      const request = MyRequest(
                        new CommonAPI(CommonAppApis.AppGroupInfoUpdate, appInfo.appid, item.groupId)
                      )
                      request.setBodyData(params)
                      await request.quickSend()
                      message.success('更新成功')
                      setVersion(version + 1)
                    })
                  }}
                >
                  编辑
                </Button>

                <Button
                  type='link'
                  onClick={() => {
                    window.location.href = new CommonAPI(
                      CommonAppApis.AppGroupInfoExport,
                      appInfo.appid,
                      item.groupId
                    ).api
                  }}
                >
                  导出
                </Button>

                <Button
                  danger
                  type='link'
                  onClick={() => {
                    const dialog = new ConfirmDialog({
                      content: `确定要删除用户组 ${item.name}[${item.groupAlias}] 吗？`,
                    })
                    dialog.show(async () => {
                      const request = MyRequest(
                        new CommonAPI(CommonAppApis.AppGroupDelete, appInfo.appid, item.groupId)
                      )
                      await request.quickSend()
                      message.success(`已删除`)
                      setVersion(version + 1)
                    })
                  }}
                >
                  删除
                </Button>
              </Space>
            ),
          },
        ]}
        defaultSettings={{
          pageSize: 10,
          sortKey: 'createTime',
          sortDirection: 'descending',
        }}
        loadData={async (retainParams) => {
          const request = MyRequest(new CommonAPI(CommonAppApis.AppGroupPageDataGet, appInfo.appid))
          request.setQueryParams(retainParams)
          return request.quickSend<PageResult<P_GroupInfo>>()
        }}
      />
    </div>
  )
}
