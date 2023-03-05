import { ModalForm, ProFormRadio, ProFormText } from '@ant-design/pro-components'
import { Form } from 'antd'
import React from 'react'
import { AppType, AppTypeDescriptor, P_AppParams, PermissionHelper } from '@fangcha/account-models'

interface Props {
  title: string
  trigger: JSX.Element
  forEditing?: boolean
  params?: Partial<P_AppParams>
  onSubmit?: (params: P_AppParams) => Promise<void>
}

export const AppFormDialog: React.FC<Props> = (props) => {
  const params = JSON.parse(
    JSON.stringify(
      props.params ||
        ({
          appid: '',
          appType: AppType.Admin,
          name: '',
          remarks: '',
          author: '',
          configData: {},
          permissionMeta: PermissionHelper.defaultPermissionMeta(),
          powerUserList: [],
          version: 0,
        } as P_AppParams)
    )
  )
  const [form] = Form.useForm<P_AppParams>()
  form.setFieldsValue(params)
  return (
    <ModalForm<P_AppParams>
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
          await props.onSubmit({
            ...params,
            ...data,
          })
        }
        return true
      }}
    >
      {!props.forEditing && <ProFormText name='appid' label='Appid' />}
      <ProFormText name='name' label='应用名' />
      <ProFormRadio.Group name='appType' label='应用类型' options={AppTypeDescriptor.options()} radioType='button' />
      <ProFormText name='remarks' label='备注' />
    </ModalForm>
  )
}
