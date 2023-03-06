import React, { useState } from 'react'
import { AppFragmentProtocol } from './AppFragmentProtocol'
import { Button, message, Space } from 'antd'
import { MyRequest } from '@fangcha/auth-react'
import { TableView } from '../core/TableView'
import { P_AppInfo, P_GroupInfo } from '@fangcha/account-models'
import { Link } from 'react-router-dom'
import { CommonAPI } from '@fangcha/app-request'
import { CommonAppApis } from '@web/sso-common/core-api'
import { ConfirmDialog } from '../core/ConfirmDialog'
import { PageResult } from '@fangcha/tools'

export const AppGroupsFragment: AppFragmentProtocol = ({ appInfo, onAppInfoChanged }) => {
  const [version, setVersion] = useState(0)
  return (
    <div>
      {/*<Space>*/}
      {/*  <AppFormDialog*/}
      {/*    title='创建应用'*/}
      {/*    onSubmit={async (params) => {*/}
      {/*      const request = MyRequest(Admin_AppApis.AppCreate)*/}
      {/*      request.setBodyData(params)*/}
      {/*      await request.quickSend()*/}
      {/*      message.success('创建成功')*/}
      {/*      setVersion(version + 1)*/}
      {/*    }}*/}
      {/*    trigger={<Button type='primary'>创建应用</Button>}*/}
      {/*  />*/}
      {/*  <JsonEditorDialog*/}
      {/*    title='导入应用'*/}
      {/*    onSubmit={async (params) => {*/}
      {/*      const request = MyRequest(Admin_AppApis.AppFullCreate)*/}
      {/*      request.setBodyData(params)*/}
      {/*      await request.quickSend()*/}
      {/*      message.success('创建成功')*/}
      {/*      setVersion(version + 1)*/}
      {/*    }}*/}
      {/*    trigger={<Button>导入应用</Button>}*/}
      {/*  />*/}
      {/*</Space>*/}
      {/*<Divider />*/}
      <TableView
        version={version}
        rowKey={(item: P_GroupInfo) => {
          return item.groupId
        }}
        columns={[
          {
            title: 'Name',
            render: (item: P_GroupInfo) => (
              <>
                <Space>
                  <Link to={{ pathname: `/v1/app/${item.appid}` }}>{item.name}</Link>
                </Space>
                <br />
                <span>groupId: {item.groupAlias}</span>
              </>
            ),
          },
          {
            title: '创建时间 / 更新时间',
            render: (item: P_GroupInfo) => (
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
            render: (item: P_GroupInfo) => (
              <Space size='small'>
                {/*<AppFormDialog*/}
                {/*  title='编辑应用'*/}
                {/*  forEditing={true}*/}
                {/*  params={item}*/}
                {/*  onSubmit={async (params) => {*/}
                {/*    const request = MyRequest(new CommonAPI(CommonAppApis.AppUpdate, item.appid))*/}
                {/*    request.setBodyData(params)*/}
                {/*    await request.quickSend()*/}
                {/*    message.success('更新成功')*/}
                {/*    setVersion(version + 1)*/}
                {/*  }}*/}
                {/*  trigger={<Button type='link'>编辑应用</Button>}*/}
                {/*/>*/}
                <ConfirmDialog
                  title='请确认'
                  content={`确定要删除用户组 ${item.name}[${item.groupAlias}] 吗？`}
                  alertType='error'
                  onSubmit={async () => {
                    const request = MyRequest(new CommonAPI(CommonAppApis.AppGroupDelete, item.appid, item.groupId))
                    await request.quickSend()
                    message.success(`已删除`)
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
          const request = MyRequest(new CommonAPI(CommonAppApis.AppGroupPageDataGet, appInfo.appid))
          request.setQueryParams(retainParams)
          return request.quickSend<PageResult<P_GroupInfo>>()
        }}
      />
    </div>
  )
}
