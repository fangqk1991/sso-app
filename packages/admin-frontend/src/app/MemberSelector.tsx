import React, { useEffect, useState } from 'react'
import { ProFormSelect } from '@ant-design/pro-components'
import { MyRequest } from '@fangcha/auth-react'
import { CommonSearchApis } from '@web/sso-common/core-api'
import { FeishuUserModel } from '@fangcha/account-models'

interface Props {
  name: string
}

export const MemberSelector: React.FC<Props> = ({ name }) => {
  const [users, setUsers] = useState<FeishuUserModel[]>([])

  const searchKeywords = (keywords: string) => {
    MyRequest(CommonSearchApis.StaffSearch)
      .setQueryParams({
        keywords: keywords,
      })
      .quickSend()
      .then((response) => {
        setUsers(response)
      })
  }

  useEffect(() => {
    searchKeywords('')
  }, [])

  return (
    <ProFormSelect
      name={name}
      fieldProps={{
        showSearch: true,
        filterOption: false,
        options: (users || []).map((item) => {
          return {
            label: item.name,
            value: item.unionId,
          }
        }),
        onSearch: searchKeywords,
      }}
    />
  )
}
