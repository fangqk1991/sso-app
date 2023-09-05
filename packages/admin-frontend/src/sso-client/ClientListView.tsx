import React, { useState } from 'react'
import { MyRequest } from '@fangcha/auth-react'
import { Button, Divider, Modal, Tag } from 'antd'
import { Admin_SsoClientApis } from '@web/sso-common/admin-api'
import { RouterLink, TableView } from '@fangcha/react'
import { SsoClientModel } from '@fangcha/sso-models'
import { PageResult } from '@fangcha/tools'
import { ClientFormDialog } from './ClientFormDialog'

export const ClientListView: React.FC = () => {
  const [version, setVersion] = useState(0)
  return (
    <div>
      <h3>客户端管理</h3>
      <Divider />
      <Button
        type='primary'
        onClick={() => {
          const dialog = new ClientFormDialog({
            title: '创建客户端',
          })
          dialog.show(async (params) => {
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
          })
        }}
      >
        创建客户端
      </Button>
      <Divider />
      <TableView
        version={version}
        rowKey={(item: SsoClientModel) => {
          return item.clientId
        }}
        columns={[
          {
            title: 'Name',
            render: (item: SsoClientModel) => (
              <>
                <RouterLink route={'/v1/client/:clientId'} params={{ clientId: item.clientId }}>
                  {item.name}
                </RouterLink>
                <br />
                <span>clientId: {item.clientId}</span>
              </>
            ),
          },
          {
            title: 'Scopes',
            render: (item: SsoClientModel) => (
              <span>
                {item.scopeList.map((item) => {
                  return (
                    <Tag color='green' key={item}>
                      {item}
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
                {item.redirectUriList.map((item) => {
                  return (
                    <div>
                      <Tag color='green' key={item}>
                        {item}
                      </Tag>
                    </div>
                  )
                })}
              </span>
            ),
          },
          {
            title: '管理员',
            render: (item: SsoClientModel) => (
              <span>
                {item.powerUsers.map((item) => {
                  return (
                    <div>
                      <Tag color='geekblue' key={item}>
                        {item}
                      </Tag>
                    </div>
                  )
                })}
              </span>
            ),
          },
        ]}
        defaultSettings={{
          pageSize: 10,
          sortKey: 'createTime',
          sortDirection: 'descending',
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
