import React, { useState } from 'react'
import { MyRequest } from '@fangcha/auth-react'
import { Button, Divider, Modal, Tag } from 'antd'
import { Admin_SsoClientApis } from '@web/sso-common/admin-api'
import { TableView } from '../core/TableView'
import { SsoClientModel } from '@fangcha/sso-models'
import { PageResult } from '@fangcha/tools'
import { ClientFormDialog } from './ClientFormDialog'
import { Link } from 'react-router-dom'

export const ClientListView: React.FC = () => {
  const [version, setVersion] = useState(0)
  return (
    <div>
      <h3>客户端管理</h3>
      <Divider />
      <ClientFormDialog
        title='创建客户端'
        onSubmit={async (params) => {
          const request = MyRequest(Admin_SsoClientApis.ClientCreate)
          request.setBodyData({
            ...params,
            scopeList: ['basic'],
          })
          const data = await request.quickSend<SsoClientModel>()
          Modal.success({
            title: '创建成功',
            content: `请保存此 App Secret [${data.clientSecret}]（只在本次展示）`,
          })
          setVersion(version + 1)
        }}
        trigger={<Button type='primary'>创建客户端</Button>}
      />
      <Divider />
      <TableView
        version={version}
        columns={[
          {
            title: 'Name',
            render: (item: SsoClientModel) => (
              <>
                <Link to={{ pathname: `/v1/client/${item.clientId}` }}>{item.name}</Link>
                <br />
                <span>clientId: {item.clientId}</span>
              </>
            ),
          },
          {
            title: 'Scopes',
            render: (item: SsoClientModel) => (
              <span>
                {item.scopeList.map((email) => {
                  return (
                    <Tag color='green' key={email}>
                      {email}
                    </Tag>
                  )
                })}
              </span>
            ),
          },
          {
            title: '回调地址',
            render: (item: SsoClientModel) => (
              <span>
                {item.redirectUriList.map((email) => {
                  return (
                    <Tag color='green' key={email}>
                      {email}
                    </Tag>
                  )
                })}
              </span>
            ),
          },
          {
            title: '管理员',
            render: (item: SsoClientModel) => (
              <span>
                {item.powerUsers.map((email) => {
                  return (
                    <Tag color='geekblue' key={email}>
                      {email}
                    </Tag>
                  )
                })}
              </span>
            ),
          },
        ]}
        defaultSettings={{
          pageSize: 10,
        }}
        loadData={async (retainParams) => {
          const request = MyRequest(Admin_SsoClientApis.ClientPageDataGet)
          request.setQueryParams(retainParams)
          return request.quickSend<PageResult<SsoClientModel>>()
        }}
      />
    </div>
  )
}
