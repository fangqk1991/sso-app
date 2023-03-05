import React, { useState } from 'react'
import { MyRequest } from '@fangcha/auth-react'
import { Button, Divider, message, Space } from 'antd'
import { Admin_AccountApis } from '@web/sso-common/admin-api'
import { TableView } from '../core/TableView'
import { PageResult } from '@fangcha/tools'
import { AccountFormDialog } from './AccountFormDialog'
import { CarrierType, FullAccountModel } from '@fangcha/account-models'
import { SimpleInputDialog } from '../core/SimpleInputDialog'
import { CommonAPI } from '@fangcha/app-request'
import { ConfirmDialog } from '../core/ConfirmDialog'

export const AccountListView: React.FC = () => {
  const [version, setVersion] = useState(0)
  return (
    <div>
      <h3>账号管理</h3>
      <Divider />
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
                {item.email && (
                  <ConfirmDialog
                    title='请确认'
                    content={`确定解绑此账号 Email[${item.email}] 吗`}
                    alertType='error'
                    onSubmit={async () => {
                      const request = MyRequest(
                        new CommonAPI(Admin_AccountApis.AccountCarrierUnlink, item.accountUid, CarrierType.Email)
                      )
                      await request.quickSend()
                      message.success('解绑成功')
                      setVersion(version + 1)
                    }}
                    trigger={
                      <Button danger type='link'>
                        解绑
                      </Button>
                    }
                  />
                )}

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
              <Space size='small'>
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
                  type='password'
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
