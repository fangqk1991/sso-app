import { ProForm, ProFormText } from '@ant-design/pro-components'
import { Form } from 'antd'
import React from 'react'
import { PasswordUpdateParams } from '@fangcha/account-models'
import { DialogProps, ReactDialog } from '@fangcha/react'

type Props = DialogProps

export class PasswordFormDialog extends ReactDialog<Props, PasswordUpdateParams> {
  title = '修改密码'

  public rawComponent(): React.FC<Props> {
    return (props) => {
      const [form] = Form.useForm<PasswordUpdateParams>()
      props.context.handleResult = () => {
        return {
          ...form.getFieldsValue(),
        }
      }
      return (
        <ProForm form={form} autoFocusFirstInput submitter={false}>
          <ProFormText.Password name='curPassword' label='当前密码' />
          <ProFormText.Password name='newPassword' label='新密码' />
        </ProForm>
      )
    }
  }
}
