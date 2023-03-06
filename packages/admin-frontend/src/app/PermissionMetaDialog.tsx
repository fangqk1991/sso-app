import { ModalForm, ProFormTextArea } from '@ant-design/pro-components'
import { Button, Divider, Form, message } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { P_AppParams, PermissionHelper, PermissionMeta } from '@fangcha/account-models'
import { PermissionTreeView } from './PermissionTreeView'

interface Props {
  permissionMeta: PermissionMeta
  onSubmit: (params: PermissionMeta) => Promise<void>
  trigger: JSX.Element
}

export const PermissionMetaDialog: React.FC<Props> = (props) => {
  const [permissionMeta, setPermissionMeta] = useState(() => {
    return JSON.parse(JSON.stringify(props.permissionMeta))
  })
  const content = useMemo(() => {
    return JSON.stringify(permissionMeta, null, 2)
  }, [permissionMeta])

  const formatPermissionMeta = () => {
    try {
      const permissionMeta = JSON.parse(form.getFieldValue('content')) as PermissionMeta
      PermissionHelper.checkPermissionMeta(permissionMeta)
      setPermissionMeta(permissionMeta)
      return permissionMeta
    } catch (e: any) {
      message.error(e.message)
    }
  }

  const [form] = Form.useForm()
  useEffect(() => {
    form.setFieldValue('content', content)
  })

  return (
    <ModalForm<P_AppParams>
      // open={true}
      title='权限描述'
      trigger={props.trigger}
      form={form}
      initialValues={{ content: content }}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
        forceRender: true,
      }}
      onFinish={async () => {
        if (props.onSubmit) {
          await props.onSubmit(formatPermissionMeta()!)
        }
        return true
      }}
    >
      <ProFormTextArea
        name='content'
        fieldProps={{
          rows: 15,
        }}
      />
      <Button onClick={formatPermissionMeta}>格式化校验并刷新预览</Button>
      <Divider />
      <PermissionTreeView permissionMeta={permissionMeta} />
    </ModalForm>
  )
}
