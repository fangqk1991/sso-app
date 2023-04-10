import React, { useState } from 'react'
import { Breadcrumb, Divider, Spin, Tabs } from 'antd'
import { Link, useParams } from 'react-router-dom'
import { useAppInfo } from './useAppInfo'
import { AppBasicInfoFragment } from './AppBasicInfoFragment'
import { AppConfigFragment } from './AppConfigFragment'
import { AppPermissionFragment } from './AppPermissionFragment'
import { AppGroupsFragment } from './AppGroupsFragment'
import { useQueryParams } from '@fangcha/react'

export const AppDetailView: React.FC = () => {
  const { appid = '' } = useParams()
  const { queryParams, updateQueryParams } = useQueryParams()
  const [version, setVersion] = useState(0)
  const appInfo = useAppInfo(appid, version)
  if (!appInfo) {
    return <Spin size='large' />
  }
  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={{ pathname: `/v1/app` }}>应用列表</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{appInfo.name}</Breadcrumb.Item>
      </Breadcrumb>
      <Divider />

      <Tabs
        activeKey={queryParams['curTab'] || 'basic-info'}
        onChange={(tab) => {
          updateQueryParams({
            curTab: tab,
          })
        }}
        type='card'
        items={[
          {
            label: `基本信息`,
            key: 'basic-info',
            children: <AppBasicInfoFragment appInfo={appInfo} onAppInfoChanged={() => setVersion(version + 1)} />,
          },
          {
            label: `应用配置`,
            key: 'app-config',
            children: <AppConfigFragment appInfo={appInfo} onAppInfoChanged={() => setVersion(version + 1)} />,
          },
          {
            label: `权限描述`,
            key: 'permission-meta',
            children: <AppPermissionFragment appInfo={appInfo} onAppInfoChanged={() => setVersion(version + 1)} />,
          },
          {
            label: `用户组`,
            key: 'user-group',
            children: <AppGroupsFragment appInfo={appInfo} onAppInfoChanged={() => setVersion(version + 1)} />,
          },
        ]}
      />
    </div>
  )
}
