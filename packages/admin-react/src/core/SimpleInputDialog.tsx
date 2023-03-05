import { ModalForm, ProFormText } from '@ant-design/pro-components'
import { Form } from 'antd'
import React from 'react'

interface SimpleData {
  content: string
}

interface Props {
  trigger: JSX.Element
  onSubmit: (text: string) => Promise<void>
  title?: string
  content?: string
}

export const SimpleInputDialog: React.FC<Props> = (props) => {
  const [form] = Form.useForm<SimpleData>()
  const title = props.title || '请输入'
  return (
    <ModalForm<SimpleData>
      // open={true}
      title={title}
      trigger={props.trigger}
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
      }}
      onFinish={async (data) => {
        if (props.onSubmit) {
          await props.onSubmit(data.content)
        }
        return true
      }}
    >
      <ProFormText name='content' label={title} initialValue={props.content} />
    </ModalForm>
  )
}
