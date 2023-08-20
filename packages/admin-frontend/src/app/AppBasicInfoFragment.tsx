import React from 'react'
import { MyRequest } from '@fangcha/auth-react'
import { Button, Descriptions, Divider, message, Space, Tag } from 'antd'
import { Link } from 'react-router-dom'
import { CommonAPI } from '@fangcha/app-request'
import { AppTypeDescriptor } from '@fangcha/account-models'
import { CommonAppApis } from '@web/sso-common/core-api'
import { AppFormDialog } from './AppFormDialog'
import { TextPreviewDialog } from '@fangcha/react'
import { AppFragmentProtocol } from './AppFragmentProtocol'
import { formatTime } from '../core/formatTime'

export const AppBasicInfoFragment: AppFragmentProtocol = ({ appInfo, onAppInfoChanged }) => {
  return (
    <>
      <Button
        type='primary'
        onClick={() => {
          const dialog = new AppFormDialog({
            title: '编辑应用',
            params: appInfo,
            forEditing: true,
          })
          dialog.show(async (params) => {
            const request = MyRequest(new CommonAPI(CommonAppApis.AppUpdate, appInfo.appid))
            request.setBodyData(params)
            await request.quickSend()
            message.success('编辑成功')
            onAppInfoChanged()
          })
        }}
      >
        编辑
      </Button>
      <Divider />
      <Descriptions title='基本信息'>
        <Descriptions.Item label='Appid'>{appInfo.appid}</Descriptions.Item>
        <Descriptions.Item label='应用类型'>{AppTypeDescriptor.describe(appInfo.appType)}</Descriptions.Item>
        <Descriptions.Item label='应用名'>{appInfo.name}</Descriptions.Item>
        <Descriptions.Item label='备注'>{appInfo.remarks}</Descriptions.Item>
        <Descriptions.Item label='版本号'>{appInfo.version}</Descriptions.Item>
        <Descriptions.Item label='创建者'>{appInfo.author}</Descriptions.Item>
        <Descriptions.Item label='创建时间'>{formatTime(appInfo.createTime)}</Descriptions.Item>
        <Descriptions.Item label='更新时间'>{formatTime(appInfo.updateTime)}</Descriptions.Item>
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
      <Space>
        <Button
          onClick={() => {
            const dialog = new TextPreviewDialog({
              loadData: async () => {
                const request = MyRequest(new CommonAPI(CommonAppApis.AppOpenInfoPreview, appInfo.appid))
                return await request.quickSend()
              },
            })
            dialog.show()
          }}
        >
          预览数据
        </Button>
        <Link to={{ pathname: `/v1/app/${appInfo.appid}/access` }}>
          <Button type={'primary'}>密钥管理</Button>
        </Link>
      </Space>
    </>
  )
}
