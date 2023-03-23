import { ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components'
import { Form } from 'antd'
import React from 'react'
import { SsoClientModel } from '@fangcha/sso-models'
import { DialogProps, ReactDialog } from '@fangcha/react'

type Props = DialogProps & {
  params?: Partial<SsoClientModel>
  forEditing?: boolean
}

export class ClientFormDialog extends ReactDialog<Props, SsoClientModel> {
  public rawComponent(): React.FC<Props> {
    return (props) => {
      const params = JSON.parse(JSON.stringify(props.params || {}))
      const [form] = Form.useForm<SsoClientModel>()

      props.context.handleResult = () => {
        return {
          ...params,
          ...form.getFieldsValue(),
        }
      }
      return (
        <ProForm form={form} autoFocusFirstInput initialValues={params} submitter={false}>
          {!props.forEditing && <ProFormText name='clientId' label='clientId' />}
          <ProFormText name='name' label='名称' />
          <ProFormSelect name='redirectUriList' mode='tags' label='回调地址' />
          <ProFormSelect name='powerUsers' mode='tags' label='管理员' />
        </ProForm>
      )
    }
  }
}
