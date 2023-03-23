import { ProForm, ProFormText } from '@ant-design/pro-components'
import { Form } from 'antd'
import React from 'react'
import { AccountSimpleParams } from '@fangcha/account-models'
import { DialogProps, ReactDialog } from '@fangcha/react'

type Props = DialogProps

export class AccountFormDialog extends ReactDialog<Props, AccountSimpleParams> {
  title = '创建账号'

  public rawComponent(): React.FC<Props> {
    return (props) => {
      const [form] = Form.useForm<AccountSimpleParams>()
      props.context.handleResult = () => {
        return {
          ...form.getFieldsValue(),
        }
      }
      return (
        <ProForm form={form} autoFocusFirstInput submitter={false}>
          <ProFormText name='email' label='Email' />
          <ProFormText.Password name='password' label='Password' />
        </ProForm>
      )
    }
  }
}
