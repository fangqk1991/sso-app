import React, { useContext, useEffect, useMemo, useState } from 'react'
import { FeishuDepartmentTree, FeishuSdkApis } from '@fangcha/account-models'
import { MyRequest } from '@fangcha/auth-react'

interface Context {
  departmentTree: FeishuDepartmentTree
  departmentMapper: { [openDepartmentId: string]: FeishuDepartmentTree }
  reloadDepartmentTree: () => void
  getDepartmentTree: (openDepartmentId: string | null) => FeishuDepartmentTree | null
  getDepartmentName: (openDepartmentId: string) => string
  getFullDepartmentName: (openDepartmentId: string) => string
}

const FeishuDepartmentContext = React.createContext<Context>(null as any)

export const useFeishuDepartmentCtx = () => {
  return useContext(FeishuDepartmentContext)
}

export const FeishuDepartmentProvider = ({ children }: React.ComponentProps<any>) => {
  const [departmentTree, setDepartmentTree] = useState<FeishuDepartmentTree>({
    departmentName: 'ROOT',
    hash: '',
    memberList: [],
    openDepartmentId: '',
    parentOpenDepartmentId: '',
    path: '',
    subDepartmentList: [],
  })

  const departmentMapper = useMemo(() => {
    const mapper: { [openDepartmentId: string]: FeishuDepartmentTree } = {}
    let todoItems = [departmentTree]
    while (todoItems.length > 0) {
      for (const item of todoItems) {
        mapper[item.openDepartmentId] = item
      }
      const nextItems: FeishuDepartmentTree[] = []
      for (const item of todoItems) {
        nextItems.push(...item.subDepartmentList)
      }
      todoItems = nextItems
    }
    return mapper
  }, [departmentTree])

  const departmentCtx: Context = {
    departmentTree: departmentTree,
    departmentMapper: departmentMapper,
    reloadDepartmentTree: () => {
      MyRequest(FeishuSdkApis.FullDepartmentDataGet)
        .quickSend()
        .then((response) => {
          setDepartmentTree(response)
        })
    },
    getDepartmentTree: (openDepartmentId) => {
      return openDepartmentId ? departmentMapper[openDepartmentId] : null
    },
    getDepartmentName: (openDepartmentId) => {
      const departmentTree = departmentMapper[openDepartmentId]
      if (!departmentTree) {
        return ''
      }
      return departmentTree.departmentName
    },
    getFullDepartmentName: (openDepartmentId) => {
      const departmentTree = departmentMapper[openDepartmentId]
      if (!departmentTree) {
        return ''
      }
      return departmentTree.path
        .split(',')
        .map((item) => departmentMapper[item.trim()])
        .filter((item) => !!item)
        .map((item) => item.departmentName)
        .join(' > ')
    },
  }
  useEffect(() => {
    departmentCtx.reloadDepartmentTree()
  }, [])

  return <FeishuDepartmentContext.Provider value={departmentCtx}>{children}</FeishuDepartmentContext.Provider>
}
