import React from 'react'
import { MyRequest } from '@fangcha/auth-react'
import { Space, Tag } from 'antd'
import { Admin_SsoClientApis } from '@web/sso-common/admin-api'
import { TableView } from '../core/TableView'
import { SsoClientModel } from '@fangcha/sso-models/lib'
import { PageResult } from '@fangcha/tools'

export const ClientListView: React.FC = () => {
  return (
    <TableView
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
              <a href='javascript:'>编辑</a>
              <a href='javascript:'>删除</a>
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
  )
}
