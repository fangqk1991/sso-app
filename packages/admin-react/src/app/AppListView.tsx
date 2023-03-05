import React, { useState } from 'react'
import { MyRequest } from '@fangcha/auth-react'
import { Button, Divider, message, Space, Tag } from 'antd'
import { Admin_AppApis } from '@web/sso-common/admin-api'
import { TableView } from '../core/TableView'
import { SsoClientModel } from '@fangcha/sso-models'
import { PageResult } from '@fangcha/tools'
import { ClientFormDialog } from '../sso-client/ClientFormDialog'
import { Link } from 'react-router-dom'
import { P_AppInfo } from '@fangcha/account-models'

export const AppListView: React.FC = () => {
  const [version, setVersion] = useState(0)
  return (
    <div>
      <h3>应用列表</h3>
      <Divider />
      <ClientFormDialog
        title='创建应用'
        onSubmit={async (params) => {
          const request = MyRequest(Admin_AppApis.AppCreate)
          request.setBodyData(params)
          const data = await request.quickSend<SsoClientModel>()
          message.success('创建成功')
          setVersion(version + 1)
        }}
        trigger={<Button type='primary'>创建应用</Button>}
      />
      <Divider />
      <TableView
        version={version}
        columns={[
          {
            title: 'Name',
            render: (item: P_AppInfo) => (
              <>
                <b>{item.name}</b>
                <br />
                <span>appid: {item.appid}</span>
              </>
            ),
          },
          {
            title: '管理员',
            render: (item: P_AppInfo) => (
              <span>
                {item.powerUserList.map((email) => {
                  return (
                    <Tag color='geekblue' key={email}>
                      {email}
                    </Tag>
                  )
                })}
              </span>
            ),
          },
          {
            title: 'Action',
            key: 'action',
            render: (item: P_AppInfo) => (
              <Space size='middle'>
                <Link to={{ pathname: `/v1/app/${item.appid}` }}>查看详情</Link>
              </Space>
            ),
          },
        ]}
        defaultSettings={{
          pageSize: 10,
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
