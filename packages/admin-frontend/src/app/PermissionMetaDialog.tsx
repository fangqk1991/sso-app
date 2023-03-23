import { ProForm, ProFormTextArea } from '@ant-design/pro-components'
import { Button, Divider, Form, message } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { PermissionHelper, PermissionMeta } from '@fangcha/account-models'
import { PermissionTreeView } from './PermissionTreeView'
import { DialogProps, ReactDialog } from '@fangcha/react'

type Props = DialogProps & {
  permissionMeta: PermissionMeta
}

export class PermissionMetaDialog extends ReactDialog<Props, PermissionMeta> {
  title = '权限描述'
  width = 1000

  public rawComponent(): React.FC<Props> {
    return (props) => {
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

      props.context.handleResult = () => {
        return formatPermissionMeta()
      }
      return (
        <ProForm form={form} autoFocusFirstInput initialValues={{ content: content }} submitter={false}>
          <ProFormTextArea
            name='content'
            fieldProps={{
              rows: 15,
            }}
          />
          <Button onClick={formatPermissionMeta}>格式化校验并刷新预览</Button>
          <Divider />
          <PermissionTreeView permissionMeta={permissionMeta} />
        </ProForm>
      )
    }
  }
}
