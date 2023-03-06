import React, { useEffect, useState } from 'react'
import { MyRequest } from '@fangcha/auth-react'
import { Breadcrumb, Button, Divider, message, Modal, Space, Spin, Tag } from 'antd'
import { TableView } from '../core/TableView'
import { PageResult } from '@fangcha/tools'
import { Link, useParams } from 'react-router-dom'
import { P_AccessInfo, P_AppInfo } from '@fangcha/account-models'
import { CommonAPI } from '@fangcha/app-request'
import { CommonAppApis } from '@web/sso-common/core-api'
import { ConfirmDialog } from '../core/ConfirmDialog'
import { SsoClientModel } from '@fangcha/sso-models'

export const AppAccessListView: React.FC = () => {
  const { appid = '' } = useParams()
  const [version, setVersion] = useState(0)
  const [appInfo, setAppInfo] = useState<P_AppInfo>()

  useEffect(() => {
    MyRequest(new CommonAPI(CommonAppApis.AppInfoGet, appid || '_'))
      .quickSend()
      .then((response) => {
        setAppInfo(response)
      })
  }, [version])

  if (!appInfo) {
    return <Spin size='large' />
  }

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={{ pathname: `/v1/app` }}>应用列表</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={{ pathname: `/v1/app/${appInfo.appid}` }}>{appInfo.name}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>密钥管理</Breadcrumb.Item>
      </Breadcrumb>
      <Divider />

      <Button
        type='primary'
        onClick={async () => {
          const request = MyRequest(new CommonAPI(CommonAppApis.AppAccessCreate, appInfo.appid))
          const data = await request.quickSend<P_AccessInfo>()
          Modal.success({
            title: '创建成功',
            content: `请保存此密钥 [${data.appSecret}]`,
          })
          setVersion(version + 1)
        }}
      >
        创建密钥
      </Button>

      <Divider />
      <TableView
        version={version}
        rowKey={(item: P_AccessInfo) => {
          return item.accessId
        }}
        columns={[
          {
            title: 'App Secret',
            render: (item: P_AccessInfo) => (
              <Space>
                <span>{item.appSecret}</span>
                <Button
                  type='link'
                  onClick={async () => {
                    const request = MyRequest(
                      new CommonAPI(CommonAppApis.AppAccessInfoRequest, appInfo.appid, item.accessId)
                    )
                    const data = await request.quickSend<P_AccessInfo>()
                    Modal.info({
                      title: 'App Secret',
                      content: data.appSecret,
                    })
                    setVersion(version + 1)
                  }}
                >
                  显示
                </Button>
              </Space>
            ),
          },
          {
            title: '创建者',
            render: (item: P_AccessInfo) => <Tag color='geekblue'>{item.author}</Tag>,
          },
          {
            title: '创建时间 / 更新时间',
            render: (item: P_AccessInfo) => (
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
            render: (item: P_AccessInfo) => (
              <Space size='small'>
                <ConfirmDialog
                  title='请确认'
                  content={`确定要删除吗？`}
                  alertType='error'
                  onSubmit={async () => {
                    const request = MyRequest(new CommonAPI(CommonAppApis.AppAccessDelete, appInfo.appid, item.accessId))
                    await request.quickSend()
                    message.success(`已成功删除密钥`)
                    setVersion(version + 1)
                  }}
                  trigger={
                    <Button danger type='link'>
                      删除
                    </Button>
                  }
                />
              </Space>
            ),
          },
        ]}
        defaultSettings={{
          pageSize: 10,
          sortKey: 'createTime',
          sortDirection: 'descending',
        }}
        loadData={async (retainParams) => {
          const request = MyRequest(new CommonAPI(CommonAppApis.AppAccessPageDataGet, appInfo.appid))
          request.setQueryParams(retainParams)
          return request.quickSend<PageResult<P_AccessInfo>>()
        }}
      />
    </div>
  )
}