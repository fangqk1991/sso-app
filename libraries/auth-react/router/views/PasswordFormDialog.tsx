import { ModalForm, ProFormText } from '@ant-design/pro-components'
import { Form } from 'antd'
import React from 'react'
import { PasswordUpdateParams } from '@fangcha/account-models'

interface Props {
  title: string
  trigger: JSX.Element
  onSubmit?: (params: PasswordUpdateParams) => Promise<void>
}

export const PasswordFormDialog: React.FC<Props> = (props) => {
  const [form] = Form.useForm<PasswordUpdateParams>()
  return (
    <ModalForm<PasswordUpdateParams>
      // open={true}
      title={props.title}
      trigger={props.trigger}
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
        forceRender: true,
      }}
      onFinish={async (data) => {
        if (props.onSubmit) {
          await props.onSubmit(data)
        }
        return true
      }}
    >
      <ProFormText.Password name='curPassword' label='当前密码' />
      <ProFormText.Password name='newPassword' label='新密码' />
    </ModalForm>
  )
}
