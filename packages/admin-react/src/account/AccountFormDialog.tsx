import { ModalForm, ProFormText } from '@ant-design/pro-components'
import { Form } from 'antd'
import React from 'react'
import { AccountSimpleParams } from '@fangcha/account-models'

interface Props {
  title: string
  trigger: JSX.Element
  onSubmit?: (params: AccountSimpleParams) => Promise<void>
}

export const AccountFormDialog: React.FC<Props> = (props) => {
  const [form] = Form.useForm<AccountSimpleParams>()
  return (
    <ModalForm<AccountSimpleParams>
      // open={true}
      title={props.title}
      trigger={props.trigger}
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
      }}
      onFinish={async (data) => {
        if (props.onSubmit) {
          await props.onSubmit(data)
        }
        return true
      }}
    >
      <ProFormText name='email' label='Email' />
      <ProFormText.Password name='password' label='Password'  />
    </ModalForm>
  )
}
