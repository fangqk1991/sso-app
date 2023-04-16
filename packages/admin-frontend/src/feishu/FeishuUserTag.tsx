import React from 'react'
import { Tag, Tooltip } from 'antd'
import { FeishuDepartmentMemberModel } from '@fangcha/account-models'
import { InfoCircleFilled } from '@ant-design/icons'

interface Props {
  member: FeishuDepartmentMemberModel
}

export const FeishuUserTag: React.FC<Props> = ({ member }) => {
  return (
    <Tag color={member.isLeader ? 'red' : 'geekblue'} key={member.unionId}>
      {member.name}{' '}
      <Tooltip
        placement='right'
        title={
          <ul>
            <li>unionId: {member.unionId}</li>
            <li>name: {member.name}</li>
          </ul>
        }
      >
        <InfoCircleFilled />
      </Tooltip>
    </Tag>
  )
}
