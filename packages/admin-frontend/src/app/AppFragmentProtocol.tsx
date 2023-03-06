import React from 'react'
import { P_AppInfo } from '@fangcha/account-models'

export interface AppFragmentProps {
  appInfo: P_AppInfo
  onAppInfoChanged: () => void
}

export type AppFragmentProtocol = React.FC<AppFragmentProps>
