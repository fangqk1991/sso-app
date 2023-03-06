import React from 'react'
import { P_AppInfo, P_GroupDetail } from '@fangcha/account-models'

export interface GroupFragmentProps {
  appInfo: P_AppInfo
  groupInfo: P_GroupDetail
  onGroupInfoChanged: () => void
}

export type GroupFragmentProtocol = React.FC<GroupFragmentProps>
