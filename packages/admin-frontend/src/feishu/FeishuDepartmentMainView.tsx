import React from 'react'
import { Divider } from 'antd'
import { DepartmentTreeView } from './DepartmentTreeView'
import { useFeishuDepartmentCtx } from './FeishuDepartmentContext'

export const FeishuDepartmentMainView: React.FC = () => {
  const departmentCtx = useFeishuDepartmentCtx()
  return (
    <div>
      <h3>组织架构</h3>
      <Divider />
      <DepartmentTreeView departmentNode={departmentCtx.departmentTree} defaultExpandAll={true} showMembers={true} />
    </div>
  )
}
