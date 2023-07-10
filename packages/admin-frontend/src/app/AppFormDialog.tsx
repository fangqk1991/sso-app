import { ProForm, ProFormRadio, ProFormSelect, ProFormText } from '@ant-design/pro-components'
import { Form } from 'antd'
import React from 'react'
import { AppType, AppTypeDescriptor, P_AppParams, PermissionHelper } from '@fangcha/account-models'
import { DialogProps, ReactDialog } from '@fangcha/react'

type Props = DialogProps & {
  params?: Partial<P_AppParams>
  forEditing?: boolean
}

export class AppFormDialog extends ReactDialog<Props, P_AppParams> {
  title = '编辑应用'

  public rawComponent(): React.FC<Props> {
    return (props) => {
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
      props.context.handleResult = () => {
        return {
          ...params,
          ...form.getFieldsValue(),
        }
      }
      return (
        <ProForm form={form} autoFocusFirstInput initialValues={params} submitter={false}>
          {!props.forEditing && <ProFormText name='appid' label='Appid' />}
          <ProFormText name='name' label='应用名' />
          <ProFormRadio.Group
            name='appType'
            label='应用类型'
            options={AppTypeDescriptor.options()}
            radioType='button'
            readonly={props.forEditing}
          />
          <ProFormText name='remarks' label='备注' />
          <ProFormSelect name='powerUserList' mode='tags' label='管理员' />
        </ProForm>
      )
    }
  }
}
