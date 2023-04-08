import React, { useEffect, useState } from 'react'
import { ProFormSelect } from '@ant-design/pro-components'
import { MyRequest } from '@fangcha/auth-react'
import { CommonSearchApis } from '@web/sso-common/core-api'
import { FeishuDepartmentDetailInfo } from '@fangcha/account-models'

export const DepartmentSelector: React.FC = () => {
  const [departments, setDepartments] = useState<FeishuDepartmentDetailInfo[]>([])

  const searchKeywords = (keywords: string) => {
    MyRequest(CommonSearchApis.DepartmentSearch)
      .setQueryParams({
        keywords: keywords,
      })
      .quickSend()
      .then((response) => {
        setDepartments(response)
      })
  }

  useEffect(() => {
    searchKeywords('')
  }, [])

  return (
    <ProFormSelect
      name='departmentId'
      label='绑定部门'
      fieldProps={{
        showSearch: true,
        options: (departments || []).map((item) => {
          return {
            label: item.fullPathName,
            value: item.openDepartmentId,
          }
        }),
        onSearch: searchKeywords,
      }}
    />
  )
}
