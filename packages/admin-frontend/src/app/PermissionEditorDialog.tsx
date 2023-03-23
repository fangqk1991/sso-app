import React, { useState } from 'react'
import { PermissionMeta } from '@fangcha/account-models'
import { PermissionTreeView } from './PermissionTreeView'
import { DiffEntity, DiffMapper } from '@fangcha/tools'
import { DialogProps, ReactDialog } from '@fangcha/react'

type Props = DialogProps & {
  permissionMeta: PermissionMeta
  checkedKeys: string[]
}

export class PermissionEditorDialog extends ReactDialog<Props, DiffEntity[]> {
  title = '选取权限'

  public rawComponent(): React.FC<Props> {
    return (props) => {
      const permissionMeta = props.permissionMeta
      const [checkedKeys, setCheckedKeys] = useState<(string | number)[]>(props.checkedKeys)

      props.context.handleResult = () => {
        const prevCheckedMap = props.checkedKeys.reduce((result, cur) => {
          result[cur] = true
          return result
        }, {})
        const checkedMap = checkedKeys.reduce((result, cur) => {
          result[cur] = true
          return result
        }, {})
        return DiffMapper.diff(prevCheckedMap, checkedMap)
      }
      return (
        <PermissionTreeView
          permissionMeta={permissionMeta}
          checkable={true}
          defaultCheckedKeys={checkedKeys}
          onCheckedKeysChanged={(checkedKeys) => setCheckedKeys(checkedKeys)}
        />
      )
    }
  }
}
