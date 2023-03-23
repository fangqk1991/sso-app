import React, { useEffect, useState } from 'react'
import { MyRequest } from '@fangcha/auth-react'
import { Breadcrumb, Button, Descriptions, Divider, message, Spin, Tag } from 'antd'
import { Admin_SsoClientApis } from '@web/sso-common/admin-api'
import { SsoClientModel } from '@fangcha/sso-models'
import { ClientFormDialog } from './ClientFormDialog'
import { Link, useParams } from 'react-router-dom'
import { CommonAPI } from '@fangcha/app-request'

export const ClientDetailView: React.FC = () => {
  const { clientId = '' } = useParams()
  const [version, setVersion] = useState(0)
  const [clientInfo, setClientInfo] = useState<SsoClientModel>()

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
          <Link to={{ pathname: `/v1/client` }}>客户端管理</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{clientInfo.name}</Breadcrumb.Item>
      </Breadcrumb>
      <Divider />
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
      <Divider />
      <Descriptions title='基本信息'>
        <Descriptions.Item label='clientId'>{clientInfo.clientId}</Descriptions.Item>
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
