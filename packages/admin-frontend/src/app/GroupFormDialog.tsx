import { ModalForm, ProFormRadio, ProFormText } from '@ant-design/pro-components'
import { Form } from 'antd'
import React from 'react'
import { P_GroupParams } from '@fangcha/account-models'
import { NumBoolDescriptor } from '../core/NumBool'

interface Props {
  title: string
  trigger: JSX.Element
  forEditing?: boolean
  params?: Partial<P_GroupParams>
  onSubmit?: (params: P_GroupParams) => Promise<void>
}

export const GroupFormDialog: React.FC<Props> = (props) => {
  const params = JSON.parse(
    JSON.stringify(
      props.params ||
        ({
          name: '',
          remarks: '',
          groupAlias: '',
          isRetained: 0,
          isEnabled: 1,
          blackPermission: 0,
          subGroupIdList: [],
        } as P_GroupParams)
    )
  )
  const [form] = Form.useForm<P_GroupParams>()
  return (
    <ModalForm<P_GroupParams>
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
          await props.onSubmit({
            ...params,
            ...data,
          })
        }
        return true
      }}
    >
      {props.forEditing && <ProFormText name='groupAlias' label='Alias' />}
      <ProFormText name='name' label='名称' />
      <ProFormText name='remarks' label='备注' />
      <ProFormRadio.Group name='isEnabled' label='是否有效' options={NumBoolDescriptor.options()} radioType='button' />
    </ModalForm>
  )
}
