import React, { useEffect, useState } from 'react'
import { DialogProps, LoadingView, ReactDialog } from '@fangcha/react'
import { FeishuUserModel } from '@fangcha/account-models/lib'
import { Table } from 'antd'

interface Props extends DialogProps<any> {
  loadData?: () => Promise<{}>
}

export class FeishuUserInfoDialog extends ReactDialog<Props> {
  title = '飞书用户'
  width = 800
  hideButtons = true

  public static previewData(data: FeishuUserModel) {
    new FeishuUserInfoDialog({
      curValue: data,
    }).show()
  }

  public static loadDataAndPreview(loadData: () => Promise<FeishuUserModel>) {
    new FeishuUserInfoDialog({
      loadData: loadData,
    }).show()
  }

  public rawComponent(): React.FC<Props> {
    return (props) => {
      const [loading, setLoading] = useState(false)
      const [feishuUser, setContent] = useState(props.curValue)
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
          dataSource={Object.keys(feishuUser).map((key) => ({ key: key, value: feishuUser[key] }))}
          columns={[
            {
              key: 'key',
              title: 'Key',
              render: (item) => <b>{item.key}</b>,
            },
            {
              key: 'value',
              title: 'Value',
              render: (item) => <span>{item.value}</span>,
            },
          ]}
        />
      )
    }
  }
}
