import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-components'
import { Form } from 'antd'
import React from 'react'
import { SsoClientModel } from '@fangcha/sso-models'

interface Props {
  title: string
  trigger: JSX.Element
  forEditing?: boolean
  params?: Partial<SsoClientModel>
  onSubmit?: (params: SsoClientModel) => Promise<void>
}

export const ClientFormDialog: React.FC<Props> = (props) => {
  const params = JSON.parse(JSON.stringify(props.params || {}))
  const [form] = Form.useForm<SsoClientModel>()
  return (
    <ModalForm<SsoClientModel>
      // open={true}
      title={props.title}
      trigger={props.trigger}
      form={form}
      initialValues={params}
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
      {!props.forEditing && <ProFormText name='clientId' label='clientId' />}
      <ProFormText name='name' label='名称' />
      <ProFormSelect name='redirectUriList' mode='tags' label='回调地址' />
      <ProFormSelect name='powerUsers' mode='tags' label='管理员' />
    </ModalForm>
  )
}
