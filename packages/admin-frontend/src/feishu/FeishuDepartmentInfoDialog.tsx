import React, { useEffect, useState } from 'react'
import { DialogProps, LoadingView, ReactDialog } from '@fangcha/react'
import { FeishuDepartmentTree } from '@fangcha/account-models'
import { Table } from 'antd'

interface Props extends DialogProps<any> {
  loadData?: () => Promise<{}>
}

export class FeishuDepartmentInfoDialog extends ReactDialog<Props> {
  title = '飞书部门'
  width = 800
  hideButtons = true

  public static previewData(data: FeishuDepartmentTree) {
    new FeishuDepartmentInfoDialog({
      curValue: data,
    }).show()
  }

  public static loadDataAndPreview(loadData: () => Promise<FeishuDepartmentTree>) {
    new FeishuDepartmentInfoDialog({
      loadData: loadData,
    }).show()
  }

  public rawComponent(): React.FC<Props> {
    return (props) => {
      const [loading, setLoading] = useState(false)
      const [mapper, setContent] = useState(props.curValue)
      useEffect(() => {
        if (props.loadData) {
          setLoading(true)
          props
            .loadData()
            .then((data) => {
              setLoading(false)
              setContent(data)
            })
            .catch((err) => {
              setLoading(false)
              throw err
            })
        }
      }, [])

      if (loading) {
        return <LoadingView />
      }

      return (
        <Table
          dataSource={Object.keys(mapper)
            .map((key) => ({ key: key, value: mapper[key] }))
            .filter((item) => typeof item.value !== 'object')}
          columns={[
            {
              key: 'key',
              title: 'Key',
              render: (item) => <b>{item.key}</b>,
            },
            {
              key: 'value',
              title: 'Value',
              render: (item) => <span>{typeof item.value !== 'object' && item.value}</span>,
            },
          ]}
        />
      )
    }
  }
}
