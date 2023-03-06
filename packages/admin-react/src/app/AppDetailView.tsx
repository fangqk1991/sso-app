import React, { useEffect, useState } from 'react'
import { MyRequest } from '@fangcha/auth-react'
import { Breadcrumb, Button, Descriptions, Divider, message, Spin, Tabs, Tag } from 'antd'
import { Link, useParams } from 'react-router-dom'
import { CommonAPI } from '@fangcha/app-request'
import { AppTypeDescriptor, P_AppInfo } from '@fangcha/account-models'
import { CommonAppApis } from '@web/sso-common/core-api'
import { AppFormDialog } from './AppFormDialog'
import { TextPreviewDialog } from '../core/TextPreviewDialog'
import { JsonPre } from '../core/JsonPre'
import { JsonEditorDialog } from '../core/JsonEditorDialog'

export const AppDetailView: React.FC = () => {
  const { appid = '' } = useParams()
  const [curTab, setCurTab] = useState('basic-info')
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
          <Link to={{ pathname: `/v1/app` }}>应用管理</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{appInfo.name}</Breadcrumb.Item>
      </Breadcrumb>
      <Divider />

      <Tabs
        activeKey={curTab}
        onChange={(tab) => setCurTab(tab)}
        type='card'
        items={[
          {
            label: `基本信息`,
            key: 'basic-info',
            children: (
              <>
                <AppFormDialog
                  title='编辑信息'
                  params={appInfo}
                  forEditing={true}
                  onSubmit={async (params) => {
                    const request = MyRequest(new CommonAPI(CommonAppApis.AppUpdate, appInfo.appid))
                    request.setBodyData(params)
                    await request.quickSend()
                    message.success('编辑成功')
                    setVersion(version + 1)
                  }}
                  trigger={<Button type='primary'>编辑</Button>}
                />
                <Divider />
                <Descriptions title='基本信息'>
                  <Descriptions.Item label='Appid'>{appInfo.appid}</Descriptions.Item>
                  <Descriptions.Item label='应用类型'>{AppTypeDescriptor.describe(appInfo.appType)}</Descriptions.Item>
                  <Descriptions.Item label='应用名'>{appInfo.name}</Descriptions.Item>
                  <Descriptions.Item label='备注'>{appInfo.remarks}</Descriptions.Item>
                  <Descriptions.Item label='创建者'>{appInfo.author}</Descriptions.Item>
                  <Descriptions.Item label='创建时间'>{appInfo.createTime}</Descriptions.Item>
                  <Descriptions.Item label='更新时间'>{appInfo.updateTime}</Descriptions.Item>
                  <Descriptions.Item label='管理员'>
                    <div>
                      {appInfo.powerUserList.map((email) => {
                        return (
                          <Tag color='geekblue' key={email}>
                            {email}
                          </Tag>
                        )
                      })}
                    </div>
                  </Descriptions.Item>
                </Descriptions>
                <Divider />
                <TextPreviewDialog
                  loadData={async () => {
                    const request = MyRequest(new CommonAPI(CommonAppApis.AppOpenInfoPreview, appInfo.appid))
                    return await request.quickSend()
                  }}
                  trigger={<Button>预览数据</Button>}
                />
              </>
            ),
          },
          {
            label: `应用配置`,
            key: 'app-config',
            children: (
              <>
                <JsonEditorDialog
                  title='编辑应用配置'
                  data={appInfo.configData}
                  onSubmit={async (data) => {
                    const request = MyRequest(new CommonAPI(new CommonAPI(CommonAppApis.AppUpdate, appid || '_')))
                    request.setBodyData({
                      configData: data,
                    })
                    await request.quickSend()
                    message.success('更新成功')
                    setVersion(version + 1)
                  }}
                  trigger={<Button type='primary'>编辑应用配置</Button>}
                />
                <Divider />
                <JsonPre value={appInfo.configData} />
              </>
            ),
          },
        ]}
      />
    </div>
  )
}
