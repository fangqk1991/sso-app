import React, { useState } from 'react'
import { MyRequest } from '@fangcha/auth-react'
import { Breadcrumb, Button, Divider, message, Modal, Space, Spin, Tag } from 'antd'
import { ConfirmDialog, RouterLink, TableView } from '@fangcha/react'
import { PageResult } from '@fangcha/tools'
import { useParams } from 'react-router-dom'
import { P_GroupAccessInfo } from '@fangcha/account-models'
import { CommonAPI } from '@fangcha/app-request'
import { CommonAppApis } from '@web/sso-common/core-api'
import { useAppInfo } from './useAppInfo'
import { useGroupInfo } from './useGroupInfo'
import { formatTime } from '../core/formatTime'

export const GroupAccessListView: React.FC = () => {
  const { appid = '', groupId = '' } = useParams()
  const [version, setVersion] = useState(0)
  const appInfo = useAppInfo(appid, version)!
  const groupInfo = useGroupInfo(appid, groupId, version)!
  if (!appInfo || !groupInfo) {
    return <Spin size='large' />
  }

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item>
          <RouterLink route={'/v1/app'}>应用列表</RouterLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <RouterLink route={'/v1/app/:appid'} params={{ appid: appInfo.appid }}>
            {appInfo.name}
          </RouterLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item to={{ pathname: `/v1/app/${appInfo.appid}/group/${groupInfo.groupId}` }}>
          <RouterLink
            route={'/v1/app/:appid/group/:groupId'}
            params={{ appid: appInfo.appid, groupId: groupInfo.groupId }}
          >
            {groupInfo.name}
          </RouterLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>密钥管理</Breadcrumb.Item>
      </Breadcrumb>

      <Divider />

      <Button
        type='primary'
        onClick={async () => {
          const request = MyRequest(
            new CommonAPI(CommonAppApis.AppGroupAccessCreate, groupInfo.appid, groupInfo.groupId)
          )
          const data = await request.quickSend<P_GroupAccessInfo>()
          Modal.success({
            title: '创建成功',
            content: `请保存此密钥 [${data.groupSecret}]`,
          })
          setVersion(version + 1)
        }}
      >
        创建密钥
      </Button>

      <Divider />
      <TableView
        version={version}
        rowKey={(item: P_GroupAccessInfo) => {
          return item.accessId
        }}
        columns={[
          {
            title: 'Group Secret',
            render: (item: P_GroupAccessInfo) => (
              <Space>
                <span>{item.groupSecret}</span>
                <Button
                  type='link'
                  onClick={async () => {
                    const request = MyRequest(
                      new CommonAPI(
                        CommonAppApis.AppGroupAccessInfoRequest,
                        groupInfo.appid,
                        groupInfo.groupId,
                        item.accessId
                      )
                    )
                    const data = await request.quickSend<P_GroupAccessInfo>()
                    Modal.info({
                      title: 'App Secret',
                      content: data.groupSecret,
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
            render: (item: P_GroupAccessInfo) => <Tag color='geekblue'>{item['author']}</Tag>,
          },
          {
            title: '创建时间 / 更新时间',
            render: (item: P_GroupAccessInfo) => (
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
            render: (item: P_GroupAccessInfo) => (
              <Space size='small'>
                <Button
                  danger
                  type='link'
                  onClick={() => {
                    const dialog = new ConfirmDialog({
                      content: `确定要删除吗？`,
                    })
                    dialog.show(async () => {
                      const request = MyRequest(
                        new CommonAPI(
                          CommonAppApis.AppGroupAccessDelete,
                          groupInfo.appid,
                          groupInfo.groupId,
                          item.accessId
                        )
                      )
                      await request.quickSend()
                      message.success(`已成功删除密钥`)
                      setVersion(version + 1)
                    })
                  }}
                >
                  删除
                </Button>
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
          const request = MyRequest(
            new CommonAPI(CommonAppApis.AppGroupAccessPageDataGet, groupInfo.appid, groupInfo.groupId)
          )
          request.setQueryParams(retainParams)
          return request.quickSend<PageResult<P_GroupAccessInfo>>()
        }}
      />
    </div>
  )
}
