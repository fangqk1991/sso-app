import React, { useState } from 'react'
import { AppFragmentProtocol } from './AppFragmentProtocol'
import { Button, Divider, message, Space } from 'antd'
import { MyRequest } from '@fangcha/auth-react'
import { ConfirmDialog, JsonEditorDialog, TableView } from '@fangcha/react'
import { P_GroupInfo } from '@fangcha/account-models'
import { Link } from 'react-router-dom'
import { CommonAPI } from '@fangcha/app-request'
import { CommonAppApis } from '@web/sso-common/core-api'
import { PageResult } from '@fangcha/tools'
import { GroupFormDialog } from './GroupFormDialog'

export const AppGroupsFragment: AppFragmentProtocol = ({ appInfo }) => {
  const [version, setVersion] = useState(0)
  return (
    <div>
      <Space>
        <GroupFormDialog
          title='创建用户组'
          onSubmit={async (params) => {
            const request = MyRequest(new CommonAPI(CommonAppApis.AppGroupCreate, appInfo.appid))
            request.setBodyData(params)
            await request.quickSend()
            message.success('创建成功')
            setVersion(version + 1)
          }}
          trigger={<Button type='primary'>创建</Button>}
        />
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
                  <Link to={{ pathname: `/v1/app/${appInfo.appid}/group/${item.groupId}` }}>{item.name}</Link>
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
                <span>{item.createTime}</span>
                <br />
                <span>{item.updateTime}</span>
              </>
            ),
          },
          {
            title: 'Action',
            key: 'action',
            render: (item: P_GroupInfo) => (
              <Space size='small'>
                <GroupFormDialog
                  title='编辑用户组'
                  forEditing={true}
                  params={item}
                  onSubmit={async (params) => {
                    const request = MyRequest(
                      new CommonAPI(CommonAppApis.AppGroupInfoUpdate, appInfo.appid, item.groupId)
                    )
                    request.setBodyData(params)
                    await request.quickSend()
                    message.success('更新成功')
                    setVersion(version + 1)
                  }}
                  trigger={<Button type='link'>编辑</Button>}
                />
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
