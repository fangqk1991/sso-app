import React, { useMemo, useState } from 'react'
import { MyRequest } from '@fangcha/auth-react'
import { Button, Divider, Modal, Tag } from 'antd'
import { Admin_SsoClientApis } from '@web/sso-common/admin-api'
import {
  RouterLink,
  TablePageOptions,
  TableParamsHelper,
  TableViewV2,
  useLoadingData,
  useQueryParams
} from '@fangcha/react'
import { SsoClientModel } from '@fangcha/sso-models'
import { PageResult } from '@fangcha/tools'
import { ClientFormDialog } from './ClientFormDialog'
import { AppPages } from '../core/AppPages'

export const ClientListView: React.FC = () => {
  const [version, setVersion] = useState(0)
  const { queryParams, updateQueryParams, setQueryParams } = useQueryParams<{
    $keywords: string
  }>()

  const pageParams = useMemo(
    (): TablePageOptions => ({
      pageSize: 10,
      sortKey: 'createTime',
      sortDirection: 'descending',
      ...queryParams,
    }),
    [queryParams]
  )

  const { loading, data: pageResult } = useLoadingData<PageResult<SsoClientModel>>(
    async () => {
      const request = MyRequest(Admin_SsoClientApis.ClientPageDataGet)
      request.setQueryParams(TableParamsHelper.transferQueryParams(pageParams))
      return request.quickSend()
    },
    [version, pageParams],
    { offset: 0, length: 20, totalCount: 0, items: [] }
  )

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
      <TableViewV2
        tableProps={{
          size: 'small',
          loading: loading,
        }}
        rowKey={(item: SsoClientModel) => {
          return item.clientId
        }}
        columns={[
          {
            title: 'Name',
            render: (item: SsoClientModel) => (
              <>
                <RouterLink route={AppPages.ClientDetailRoute} params={{ clientId: item.clientId }}>
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
        initialSettings={pageParams}
        pageResult={pageResult}
        onParamsChanged={(params) => {
          // console.info('onParamsChanged', params)
          updateQueryParams(params as any)
        }}
      />
    </div>
  )
}
