import { ProForm, ProFormRadio, ProFormText } from '@ant-design/pro-components'
import { Form } from 'antd'
import React from 'react'
import { P_GroupParams } from '@fangcha/account-models'
import { NumBoolDescriptor } from '@fangcha/tools'
import { DialogProps, ReactDialog } from '@fangcha/react'
import { GroupCategory } from '@web/sso-common/user-models'

type Props = DialogProps & {
  params?: Partial<P_GroupParams>
  forEditing?: boolean
}

export class GroupFormDialog extends ReactDialog<Props, P_GroupParams> {
  title = '用户组'

  public rawComponent(): React.FC<Props> {
    return (props) => {
      const params = JSON.parse(
        JSON.stringify(
          props.params ||
            ({
              name: '',
              remarks: '',
              groupAlias: '',
              isRetained: 0,
              isEnabled: 1,
              groupCategory: GroupCategory.Custom,
              departmentId: null,
              isFullDepartment: 0,
              blackPermission: 0,
              subGroupIdList: [],
            } as P_GroupParams)
        )
      )
      const [form] = Form.useForm<P_GroupParams>()
      props.context.handleResult = () => {
        return {
          ...params,
          ...form.getFieldsValue(),
        }
      }
      return (
        <ProForm form={form} autoFocusFirstInput initialValues={params} submitter={false}>
          {props.forEditing && <ProFormText name='groupAlias' label='Alias' />}
          <ProFormText name='name' label='名称' />
          <ProFormText name='remarks' label='备注' />
          <ProFormRadio.Group
            name='isEnabled'
            label='是否有效'
            options={NumBoolDescriptor.options()}
            radioType='button'
          />
        </ProForm>
      )
    }
  }
}
