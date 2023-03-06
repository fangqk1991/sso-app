import React from 'react'
import { P_AppInfo } from '@fangcha/account-models'
import { PermissionTreeView } from './PermissionTreeView'

interface Props {
  appInfo: P_AppInfo
  onAppInfoChanged: () => void
}

export const AppPermissionFragment: React.FC<Props> = ({ appInfo, onAppInfoChanged }) => {
  return (
    <>
      <PermissionTreeView />
    </>
  )
}
