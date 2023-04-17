import { ProForm } from '@ant-design/pro-components'
import { Form } from 'antd'
import React from 'react'
import { DialogProps, ReactDialog } from '@fangcha/react'
import { MemberSelector } from './MemberSelector'

type Props = DialogProps & {}

export class MemberPickerDialog extends ReactDialog<Props, string> {
  title = '选择用户'

  public rawComponent(): React.FC<Props> {
    return (props) => {
      const [form] = Form.useForm()
      props.context.handleResult = () => {
        return form.getFieldValue('unionId') || ''
      }
      return (
        <ProForm form={form} autoFocusFirstInput submitter={false}>
          <MemberSelector name='unionId' />
        </ProForm>
      )
    }
  }
}
