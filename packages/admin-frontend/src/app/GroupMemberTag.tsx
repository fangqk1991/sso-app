import React from 'react'
import { Tag } from 'antd'
import { P_MemberInfo } from '@fangcha/account-models'

interface Props {
  member: P_MemberInfo
}

export const GroupMemberTag: React.FC<Props> = ({ member }) => {
  return (
    <Tag
      color={'geekblue'}
      key={member.userId}
      closable={true}
      onClose={(e) => {
        e.preventDefault()
      }}
    >
      {member.userId}
    </Tag>
  )
}
