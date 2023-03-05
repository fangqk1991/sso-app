import React, { useState } from 'react'
import { MyRequest } from '@fangcha/auth-react'
import { Button, Modal, Space, Tag } from 'antd'
import { Admin_SsoClientApis } from '@web/sso-common/admin-api'
import { TableView } from '../core/TableView'
import { SsoClientModel } from '@fangcha/sso-models/lib'
import { PageResult } from '@fangcha/tools'
import { ClientFormDialog } from './ClientFormDialog'

export const ClientListView: React.FC = () => {
  const [version, setVersion] = useState(0)
  return (
    <div>
      <ClientFormDialog
        title='创建客户端'
        onSubmit={async (params) => {
          const request = MyRequest(Admin_SsoClientApis.ClientCreate)
          request.setBodyData(params)
          const data = await request.quickSend<SsoClientModel>()
          Modal.success({
            title: '创建成功',
            content: `请保存此 App Secret [${data.clientSecret}]（只在本次展示）`,
          })
          setVersion(version + 1)
        }}
        trigger={<Button type='primary'>创建客户端</Button>}
      />
      <TableView
        version={version}
        columns={[
          {
            title: 'Name',
            render: (item: SsoClientModel) => (
              <>
                <b>{item.name}</b>
                <br />
                <span>clientId: {item.clientId}</span>
              </>
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
          {
            title: 'Action',
            key: 'action',
            render: (item: SsoClientModel) => (
              <Space size='middle'>
                <ClientFormDialog
                  title='复制'
                  params={item}
                  onSubmit={async (params) => {
                    const request = MyRequest(Admin_SsoClientApis.ClientCreate)
                    request.setBodyData(params)
                    const data = await request.quickSend<SsoClientModel>()
                    Modal.success({
                      title: '创建成功',
                      content: `请保存此 App Secret [${data.clientSecret}]（只在本次展示）`,
                    })
                    setVersion(version + 1)
                  }}
                  trigger={<Button type='link'>复制</Button>}
                />
              </Space>
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
