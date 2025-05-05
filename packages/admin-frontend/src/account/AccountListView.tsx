import React, { useMemo, useState } from 'react'
import { MyRequest } from '@fangcha/auth-react'
import { Button, Input, message, Modal, Space } from 'antd'
import { Admin_AccountApis } from '@web/sso-common/admin-api'
import { ConfirmDialog, InformationDialog, SimpleInputDialog, TableView, useQueryParams } from '@fangcha/react'
import { PageResult } from '@fangcha/tools'
import { AccountFormDialog } from './AccountFormDialog'
import { AccountCarrierModel, CarrierType, FullAccountModel } from '@fangcha/account-models'
import { CommonAPI } from '@fangcha/app-request'
import { formatTime } from '../core/formatTime'

export const AccountListView: React.FC = () => {
  const [version, setVersion] = useState(0)
  const { queryParams, updateQueryParams, setQueryParams } = useQueryParams<{
    $keywords: string
  }>()

  const keywordsSearchBar = useMemo(() => {
    return (
      <Input.Search
        key={queryParams.$keywords}
        defaultValue={queryParams.$keywords}
        placeholder='Keywords'
        onSearch={(keywords: string) => {
          updateQueryParams({
            $keywords: keywords,
          })
        }}
        allowClear
        enterButton
      />
    )
  }, [queryParams.$keywords])

  return (
    <div>
      <h3>账号管理</h3>
      <div className={'my-3'}>
        <Space wrap={true}>
          {keywordsSearchBar}
          <Button
            onClick={() => {
              setQueryParams({})
            }}
          >
            重置过滤器
          </Button>
        </Space>
      </div>
      <div className={'mb-3'}>
        <Button
          type='primary'
          onClick={() => {
            const dialog = new AccountFormDialog({})
            dialog.show(async (params) => {
              const request = MyRequest(Admin_AccountApis.AccountCreate)
              request.setBodyData(params)
              await request.quickSend()
              message.success('创建成功')
              setVersion(version + 1)
            })
          }}
        >
          创建账号
        </Button>
      </div>
      <TableView
        version={version}
        rowKey={(item: FullAccountModel) => {
          return item.accountUid
        }}
        tableProps={{
          size: 'small',
        }}
        columns={[
          {
            title: 'Email',
            render: (item: FullAccountModel) => (
              <>
                <Space>
                  <b>{item.email}</b>
                  <a
                    className={'ant-btn-link'}
                    onClick={() => {
                      const dialog = new SimpleInputDialog({
                        title: '输入新邮箱',
                        curValue: item.email,
                      })
                      dialog.show(async (content) => {
                        const request = MyRequest(
                          new CommonAPI(Admin_AccountApis.AccountCarrierUpdate, item.accountUid, CarrierType.Email)
                        )
                        request.setBodyData({
                          carrierUid: content,
                        })
                        await request.quickSend()
                        message.success('变更成功')
                        setVersion(version + 1)
                      })
                    }}
                  >
                    变更
                  </a>

                  {item.email && (
                    <a
                      style={{ color: '#ff4d4f' }}
                      onClick={() => {
                        const dialog = new ConfirmDialog({
                          content: `确定解绑此账号 Email[${item.email}] 吗`,
                        })
                        dialog.show(async () => {
                          const request = MyRequest(
                            new CommonAPI(Admin_AccountApis.AccountCarrierUnlink, item.accountUid, CarrierType.Email)
                          )
                          await request.quickSend()
                          message.success('解绑成功')
                          setVersion(version + 1)
                        })
                      }}
                    >
                      解绑
                    </a>
                  )}
                </Space>
                <br />
                <span>{item.accountUid}</span>
              </>
            ),
          },
          {
            title: '用户名',
            render: (item: FullAccountModel) => (
              <Space>
                <span>{item.nickName}</span>|
                <a
                  className={'ant-btn-link'}
                  onClick={() => {
                    const dialog = new SimpleInputDialog({
                      title: '编辑用户名',
                      curValue: item.nickName,
                    })
                    dialog.show(async (content) => {
                      const request = MyRequest(
                        new CommonAPI(Admin_AccountApis.AccountBasicInfoUpdate, item.accountUid)
                      )
                      request.setBodyData({
                        nickName: content,
                      })
                      await request.quickSend()
                      message.success('变更成功')
                      setVersion(version + 1)
                    })
                  }}
                >
                  编辑
                </a>
              </Space>
            ),
          },
          {
            title: '创建时间 / 更新时间',
            render: (item: FullAccountModel) => (
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
            render: (item: FullAccountModel) => (
              <Space size='small'>
                <a
                  className={'text-success'}
                  onClick={async () => {
                    const request = MyRequest(new CommonAPI(Admin_AccountApis.AccountCarrierListGet, item.accountUid))
                    const items = await request.quickSend<AccountCarrierModel[]>()

                    InformationDialog.previewData({
                      title: '绑定情况',
                      infos: items.map((item) => ({
                        label: item.carrierType,
                        value: item.carrierUid,
                      })),
                    })
                  }}
                >
                  查看绑定
                </a>
                <a
                  onClick={() => {
                    const dialog = new SimpleInputDialog({
                      title: '输入新密码',
                      type: 'password',
                    })
                    dialog.show(async (content) => {
                      const request = MyRequest(new CommonAPI(Admin_AccountApis.AccountPasswordReset, item.accountUid))
                      request.setBodyData({
                        newPassword: content,
                      })
                      await request.quickSend()
                      message.success('重置成功')
                      setVersion(version + 1)
                    })
                  }}
                >
                  重置密码
                </a>
                <a
                  className={'text-danger'}
                  onClick={async () => {
                    const request = MyRequest(new CommonAPI(Admin_AccountApis.AccountLoginSimulate, item.accountUid))
                    const { url } = await request.quickSend<{ url: string }>()
                    Modal.success({
                      title: '模拟登录链接',
                      content: (
                        <a href={url} target={'_blank'}>
                          {url}
                        </a>
                      ),
                    })
                  }}
                >
                  模拟登录
                </a>
              </Space>
            ),
          },
        ]}
        defaultSettings={{
          pageSize: 10,
        }}
        loadData={async (retainParams) => {
          const request = MyRequest(Admin_AccountApis.AccountPageDataGet)
          request.setQueryParams({
            ...retainParams,
            ...queryParams,
          })
          return request.quickSend<PageResult<FullAccountModel>>()
        }}
      />
    </div>
  )
}
