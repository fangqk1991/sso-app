import React, { useState } from 'react'
import { Breadcrumb, Divider, Spin, Tabs } from 'antd'
import { useParams } from 'react-router-dom'
import { useAppInfo } from './useAppInfo'
import { useGroupInfo } from './useGroupInfo'
import { GroupBasicInfoFragment } from './GroupBasicInfoFragment'
import { GroupPermissionFragment } from './GroupPermissionFragment'
import { GroupMemberFragment } from './GroupMemberFragment'
import { RouterLink, useQueryParams } from '@fangcha/react'

export const GroupDetailView: React.FC = () => {
  const { appid = '', groupId = '' } = useParams()
  const { queryParams, updateQueryParams } = useQueryParams()
  const [version, setVersion] = useState(0)
  const appInfo = useAppInfo(appid, version)
  const groupInfo = useGroupInfo(appid, groupId, version)
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
        <Breadcrumb.Item>{groupInfo.name}</Breadcrumb.Item>
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
            children: (
              <>
                <GroupBasicInfoFragment
                  appInfo={appInfo}
                  groupInfo={groupInfo}
                  onGroupInfoChanged={() => setVersion(version + 1)}
                />
                <Divider />
                <GroupMemberFragment
                  appInfo={appInfo}
                  groupInfo={groupInfo}
                  onGroupInfoChanged={() => setVersion(version + 1)}
                />
              </>
            ),
          },
          {
            label: `权限信息`,
            key: 'permission-info',
            children: (
              <GroupPermissionFragment
                appInfo={appInfo}
                groupInfo={groupInfo}
                onGroupInfoChanged={() => setVersion(version + 1)}
              />
            ),
          },
        ]}
      />
    </div>
  )
}
