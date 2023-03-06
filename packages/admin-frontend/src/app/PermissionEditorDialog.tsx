import { ModalForm } from '@ant-design/pro-components'
import React, { useState } from 'react'
import { PermissionMeta } from '@fangcha/account-models'
import { PermissionTreeView } from './PermissionTreeView'
import { DiffEntity, DiffMapper } from '@fangcha/tools'

interface Props {
  permissionMeta: PermissionMeta
  checkedKeys: string[]
  onSubmit: (diffItems: DiffEntity[]) => Promise<void>
  trigger: JSX.Element
}

export const PermissionEditorDialog: React.FC<Props> = (props) => {
  const permissionMeta = props.permissionMeta
  const [checkedKeys, setCheckedKeys] = useState<(string | number)[]>(props.checkedKeys)

  return (
    <ModalForm
      // open={true}
      title='编辑权限'
      trigger={props.trigger}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
        forceRender: true,
      }}
      onFinish={async () => {
        const prevCheckedMap = props.checkedKeys.reduce((result, cur) => {
          result[cur] = true
          return result
        }, {})
        const checkedMap = checkedKeys.reduce((result, cur) => {
          result[cur] = true
          return result
        }, {})
        await props.onSubmit(DiffMapper.diff(prevCheckedMap, checkedMap))
        return true
      }}
    >
      <PermissionTreeView
        permissionMeta={permissionMeta}
        checkable={true}
        defaultCheckedKeys={checkedKeys}
        onCheckedKeysChanged={(checkedKeys) => setCheckedKeys(checkedKeys)}
      />
    </ModalForm>
  )
}
