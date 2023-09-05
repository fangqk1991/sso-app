import React, { useEffect, useState } from 'react'
import { MyRequest, useVisitorCtx } from '@fangcha/auth-react'
import { Breadcrumb, Button, Descriptions, Divider, message, Modal, Space, Spin, Tag } from 'antd'
import { Admin_SsoClientApis } from '@web/sso-common/admin-api'
import { SsoClientModel } from '@fangcha/sso-models'
import { ClientFormDialog } from './ClientFormDialog'
import { useParams } from 'react-router-dom'
import { CommonAPI } from '@fangcha/app-request'
import { RouterLink } from '@fangcha/react'

export const ClientDetailView: React.FC = () => {
  const { clientId = '' } = useParams()
  const [version, setVersion] = useState(0)
  const [clientInfo, setClientInfo] = useState<SsoClientModel>()
  const visitorCtx = useVisitorCtx()

  useEffect(() => {
    MyRequest(new CommonAPI(Admin_SsoClientApis.ClientInfoGet, clientId))
      .quickSend()
      .then((response) => {
        setClientInfo(response)
      })
  }, [version])

  if (!clientInfo) {
    return <Spin size='large' />
  }
  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item>
          <RouterLink route={'/v1/client'}>客户端管理</RouterLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{clientInfo.name}</Breadcrumb.Item>
      </Breadcrumb>
      <Divider />
      <Space>
        <Button
          type='primary'
          onClick={() => {
            const dialog = new ClientFormDialog({
              title: '编辑客户端信息',
              params: clientInfo,
              forEditing: true,
            })
            dialog.show(async (params) => {
              const request = MyRequest(new CommonAPI(Admin_SsoClientApis.ClientInfoUpdate, clientInfo.clientId))
              request.setBodyData(params)
              await request.quickSend()
              message.success('编辑成功')
              setVersion(version + 1)
            })
          }}
        >
          编辑
        </Button>
        {!!visitorCtx.userInfo.isAdmin && (
          <Button
            type='primary'
            danger
            onClick={() => {
              const dialog = new ClientFormDialog({
                title: '编辑客户端信息',
                params: clientInfo,
                forEditing: true,
                forAdmin: true,
              })
              dialog.show(async (params) => {
                const request = MyRequest(new CommonAPI(Admin_SsoClientApis.ClientInfoPowerUpdate, clientInfo.clientId))
                request.setBodyData(params)
                await request.quickSend()
                message.success('编辑成功')
                setVersion(version + 1)
              })
            }}
          >
            管理员编辑
          </Button>
        )}
      </Space>
      <Divider />
      <Descriptions title='基本信息'>
        <Descriptions.Item label='clientId'>{clientInfo.clientId}</Descriptions.Item>
        <Descriptions.Item label='clientSecret'>
          <Space>
            <span>{clientInfo.clientSecret} </span>|
            <Button
              size={'small'}
              onClick={async () => {
                const request = MyRequest(new CommonAPI(Admin_SsoClientApis.ClientFullInfoRequest, clientInfo.clientId))
                const data = await request.quickSend<SsoClientModel>()
                Modal.info({
                  title: 'Client Secret',
                  content: data.clientSecret,
                })
              }}
            >
              显示
            </Button>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label='名称'>{clientInfo.name}</Descriptions.Item>
        <Descriptions.Item label='grants'>
          <div>
            {clientInfo.grantList.map((item) => {
              return (
                <Tag color='green' key={item}>
                  {item}
                </Tag>
              )
            })}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label='scopes'>
          <div>
            {clientInfo.scopeList.map((item) => {
              return (
                <Tag color='green' key={item}>
                  {item}
                </Tag>
              )
            })}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label='回调地址'>
          <div>
            {clientInfo.redirectUriList.map((item) => {
              return (
                <Tag color='green' key={item}>
                  {item}
                </Tag>
              )
            })}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label='管理员'>
          <div>
            {clientInfo.powerUsers.map((item) => {
              return (
                <Tag color='geekblue' key={item}>
                  {item}
                </Tag>
              )
            })}
          </div>
        </Descriptions.Item>
      </Descriptions>
    </div>
  )
}
