import { ModalForm, ProFormTextArea } from '@ant-design/pro-components'
import { Form } from 'antd'
import React from 'react'

interface SimpleData {
  content: string
}

interface Props {
  trigger: JSX.Element
  onSubmit: (data: {}) => Promise<void>
  title?: string
  data?: {}
}

export const JsonEditorDialog: React.FC<Props> = (props) => {
  const [form] = Form.useForm<SimpleData>()
  const title = props.title || '请输入'
  return (
    <ModalForm<SimpleData>
      // open={true}
      title={title}
      trigger={props.trigger}
      form={form}
      autoFocusFirstInput
      initialValues={{ content: JSON.stringify(props.data || {}, null, 2) }}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
        forceRender: true,
      }}
      onFinish={async (data) => {
        if (props.onSubmit) {
          await props.onSubmit(JSON.parse(data.content))
        }
        return true
      }}
    >
      <ProFormTextArea
        name='content'
        fieldProps={{
          rows: 10,
        }}
      />
    </ModalForm>
  )
}
