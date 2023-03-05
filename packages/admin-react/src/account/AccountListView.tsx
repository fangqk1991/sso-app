import React, { useState } from 'react'
import { MyRequest } from '@fangcha/auth-react'
import { Button, Divider, message, Modal, Space } from 'antd'
import { Admin_AccountApis, Admin_SsoClientApis } from '@web/sso-common/admin-api'
import { TableView } from '../core/TableView'
import { SsoClientModel } from '@fangcha/sso-models'
import { PageResult } from '@fangcha/tools'
import { AccountFormDialog } from './AccountFormDialog'
import { CarrierType, FullAccountModel } from '@fangcha/account-models'
import { SimpleInputDialog } from '../core/SimpleInputDialog'
import { CommonAPI } from '@fangcha/app-request'

export const AccountListView: React.FC = () => {
  const [version, setVersion] = useState(0)
  return (
    <div>
      <AccountFormDialog
        title='创建账号'
        onSubmit={async (params) => {
          const request = MyRequest(Admin_AccountApis.AccountCreate)
          request.setBodyData(params)
          await request.quickSend()
          message.success('创建成功')
          setVersion(version + 1)
        }}
        trigger={<Button type='primary'>创建账号</Button>}
      />
      <Divider />
      <TableView
        version={version}
        columns={[
          {
            title: 'Email',
            render: (item: FullAccountModel) => (
              <>
                <b>{item.email}</b>
                <br />
                <span>{item.accountUid}</span>
              </>
            ),
          },
          {
            title: '创建时间 / 更新时间',
            render: (item: FullAccountModel) => (
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
            render: (item: FullAccountModel) => (
              <Space size='middle'>
                <SimpleInputDialog
                  title='输入新邮箱'
                  content={item.email}
                  onSubmit={async (content) => {
                    const request = MyRequest(
                      new CommonAPI(Admin_AccountApis.AccountCarrierUpdate, item.accountUid, CarrierType.Email)
                    )
                    request.setBodyData({
                      carrierUid: content,
                    })
                    await request.quickSend()
                    message.success('变更成功')
                    setVersion(version + 1)
                  }}
                  trigger={<Button type='link'>变更邮箱</Button>}
                />
                <SimpleInputDialog
                  title='输入新密码'
                  onSubmit={async (content) => {
                    const request = MyRequest(new CommonAPI(Admin_AccountApis.AccountPasswordReset, item.accountUid))
                    request.setBodyData({
                      newPassword: content,
                    })
                    await request.quickSend()
                    message.success('重置成功')
                    setVersion(version + 1)
                  }}
                  trigger={<Button type='link'>重置密码</Button>}
                />
              </Space>
            ),
          },
        ]}
        defaultSettings={{
          pageSize: 10,
        }}
        loadData={async (retainParams) => {
          const request = MyRequest(Admin_AccountApis.AccountPageDataGet)
          request.setQueryParams(retainParams)
          return request.quickSend<PageResult<FullAccountModel>>()
        }}
      />
    </div>
  )
}
