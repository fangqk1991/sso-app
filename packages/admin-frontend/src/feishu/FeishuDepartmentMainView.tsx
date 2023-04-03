import React, { useState } from 'react'
import { Divider } from 'antd'

export const FeishuDepartmentMainView: React.FC = () => {
  const [version, setVersion] = useState(0)
  return (
    <div>
      <h3>组织架构</h3>
      <Divider />
    </div>
  )
}
