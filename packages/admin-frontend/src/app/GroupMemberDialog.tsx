import { ProForm, ProFormText } from '@ant-design/pro-components'
import { Form } from 'antd'
import React from 'react'
import { P_MemberParams } from '@fangcha/account-models'
import { DialogProps, ReactDialog } from '@fangcha/react'

type Props = DialogProps & {
  params?: Partial<P_MemberParams>
  forEditing?: boolean
}

export class GroupMemberDialog extends ReactDialog<Props, P_MemberParams> {
  title = '添加成员'

  public rawComponent(): React.FC<Props> {
    return (props) => {
      const params = JSON.parse(
        JSON.stringify(
          props.params ||
            ({
              userId: '',
              remarks: '',
            } as P_MemberParams)
        )
      )
      const [form] = Form.useForm<P_MemberParams>()
      props.context.handleResult = () => {
        return {
          ...params,
          ...form.getFieldsValue(),
        }
      }
      return (
        <ProForm form={form} autoFocusFirstInput initialValues={params} submitter={false}>
          {!props.forEditing && <ProFormText name='name' label='User ID' />}
          <ProFormText name='remarks' label='备注' />
        </ProForm>
      )
    }
  }
}
