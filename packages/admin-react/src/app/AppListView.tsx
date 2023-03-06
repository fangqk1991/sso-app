import React, { useState } from 'react'
import { MyRequest } from '@fangcha/auth-react'
import { Button, Divider, message, Space, Tag } from 'antd'
import { Admin_AppApis } from '@web/sso-common/admin-api'
import { TableView } from '../core/TableView'
import { PageResult } from '@fangcha/tools'
import { Link } from 'react-router-dom'
import { AppTypeDescriptor, P_AppInfo } from '@fangcha/account-models'
import { AppFormDialog } from './AppFormDialog'
import { CommonAPI } from '@fangcha/app-request'
import { CommonAppApis } from '@web/sso-common/core-api'
import { ConfirmDialog } from '../core/ConfirmDialog'

export const AppListView: React.FC = () => {
  const [version, setVersion] = useState(0)
  return (
    <div>
      <h3>应用列表</h3>
      <Divider />
      <AppFormDialog
        title='创建应用'
        onSubmit={async (params) => {
          const request = MyRequest(Admin_AppApis.AppCreate)
          request.setBodyData(params)
          await request.quickSend()
          message.success('创建成功')
          setVersion(version + 1)
        }}
        trigger={<Button type='primary'>创建应用</Button>}
      />
      <Divider />
      <TableView
        version={version}
        rowKey={(item: P_AppInfo) => {
          return item.appid
        }}
        columns={[
          {
            title: 'Name',
            render: (item: P_AppInfo) => (
              <>
                <Space>
                  <Link to={{ pathname: `/v1/app/${item.appid}` }}>{item.name}</Link>
                  <Tag color='green'>{AppTypeDescriptor.describe(item.appType)}</Tag>
                </Space>
                <br />
                <span>appid: {item.appid}</span>
              </>
            ),
          },
          {
            title: '管理员',
            render: (item: P_AppInfo) => (
              <div>
                {item.powerUserList.map((email) => {
                  return (
                    <Tag color='geekblue' key={email}>
                      {email}
                    </Tag>
                  )
                })}
              </div>
            ),
          },
          {
            title: '创建时间 / 更新时间',
            render: (item: P_AppInfo) => (
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
            render: (item: P_AppInfo) => (
              <Space size='small'>
                <AppFormDialog
                  title='编辑应用'
                  forEditing={true}
                  params={item}
                  onSubmit={async (params) => {
                    const request = MyRequest(new CommonAPI(CommonAppApis.AppUpdate, item.appid))
                    request.setBodyData(params)
                    await request.quickSend()
                    message.success('更新成功')
                    setVersion(version + 1)
                  }}
                  trigger={<Button type='link'>编辑应用</Button>}
                />
                <ConfirmDialog
                  title='请确认'
                  content={`确定要删除应用 ${item.name}[${item.appid}] 吗？`}
                  alertType='error'
                  onSubmit={async () => {
                    const request = MyRequest(new CommonAPI(Admin_AppApis.AppDelete, item.appid))
                    await request.quickSend()
                    message.success(`已成功删除应用 ${item.name}`)
                    setVersion(version + 1)
                  }}
                  trigger={
                    <Button danger type='link'>
                      删除
                    </Button>
                  }
                />
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
          const request = MyRequest(Admin_AppApis.AppPageDataGet)
          request.setQueryParams(retainParams)
          return request.quickSend<PageResult<P_AppInfo>>()
        }}
      />
    </div>
  )
}
