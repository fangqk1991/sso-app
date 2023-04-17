import React from 'react'
import { Tag } from 'antd'
import { FeishuDepartmentMemberModel } from '@fangcha/account-models'
import { useFeishuDepartmentCtx } from './FeishuDepartmentContext'
import { FeishuUserInfoDialog } from './FeishuUserInfoDialog'

interface Props {
  member: FeishuDepartmentMemberModel
}

export const FeishuUserTag: React.FC<Props> = ({ member }) => {
  const departmentCtx = useFeishuDepartmentCtx()
  const feishuUser = departmentCtx.userMapper[member.unionId]!
  return (
    <Tag
      color={member.isLeader ? 'red' : 'geekblue'}
      key={member.unionId}
      onClick={(e) => {
        e.stopPropagation()
        if (feishuUser) {
          FeishuUserInfoDialog.previewData(feishuUser)
        }
      }}
    >
      {member.name}
    </Tag>
  )
}
