import React, { useEffect, useState } from 'react'
import { Divider, Spin } from 'antd'
import { MyRequest } from '@fangcha/auth-react'
import { FeishuDepartmentTree, FeishuSdkApis } from '@fangcha/account-models'
import { DepartmentTreeView } from './DepartmentTreeView'

export const FeishuDepartmentMainView: React.FC = () => {
  const [departmentNode, setDepartmentNode] = useState<FeishuDepartmentTree | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    MyRequest(FeishuSdkApis.FullDepartmentDataGet)
      .quickSend()
      .then((response) => {
        setDepartmentNode(response)
      })
  }, [version])

  if (!departmentNode) {
    return <Spin size='large' />
  }

  return (
    <div>
      <h3>组织架构</h3>
      <Divider />
      <DepartmentTreeView departmentNode={departmentNode} />
    </div>
  )
}
