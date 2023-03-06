import React from 'react'
import { P_GroupInfo } from '@fangcha/account-models'

export interface GroupFragmentProps {
  groupInfo: P_GroupInfo
  onGroupInfoChanged: () => void
}

export type GroupFragmentProtocol = React.FC<GroupFragmentProps>
