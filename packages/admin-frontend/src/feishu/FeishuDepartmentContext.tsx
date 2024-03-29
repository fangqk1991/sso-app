import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
  FeishuDepartmentMemberModel,
  FeishuDepartmentTree,
  FeishuSdkApis,
  FeishuUserModel,
} from '@fangcha/account-models'
import { MyRequest } from '@fangcha/auth-react'

export interface FeishuUserMapper {
  [unionId: string]: FeishuUserModel | null
}

interface Context {
  feishuValid: boolean
  departmentTree: FeishuDepartmentTree
  userMapper: FeishuUserMapper
  departmentMapper: { [openDepartmentId: string]: FeishuDepartmentTree }
  reloadDepartmentTree: () => void
  getDepartmentTree: (openDepartmentId: string | null) => FeishuDepartmentTree | null
  getDepartmentMembers: (openDepartmentId: string, withSubDepartments?: boolean) => FeishuDepartmentMemberModel[]
  getDepartmentName: (openDepartmentId: string) => string
  getFullDepartmentName: (openDepartmentId: string) => string
  fillUserMapper: (unionIdList: string[]) => void
}

const FeishuDepartmentContext = React.createContext<Context>(null as any)

export const useFeishuDepartmentCtx = () => {
  return useContext(FeishuDepartmentContext)
}

export const FeishuDepartmentProvider = ({ children, feishuValid }: React.ComponentProps<any>) => {
  const [departmentTree, setDepartmentTree] = useState<FeishuDepartmentTree>({
    feishuValid: false,
    departmentName: 'ROOT',
    hash: '',
    memberList: [],
    openDepartmentId: '',
    parentOpenDepartmentId: '',
    path: '',
    subDepartmentList: [],
  })
  const [userMapper, setUserMapper] = useState<FeishuUserMapper>({})

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
    feishuValid: feishuValid,
    userMapper: userMapper,
    departmentTree: departmentTree,
    departmentMapper: departmentMapper,
    reloadDepartmentTree: () => {
      MyRequest(FeishuSdkApis.FullDepartmentTreeGet)
        .quickSend()
        .then((response) => {
          setDepartmentTree(response)
        })
    },
    getDepartmentTree: (openDepartmentId) => {
      return openDepartmentId ? departmentMapper[openDepartmentId] : null
    },
    getDepartmentMembers: (openDepartmentId: string, withSubDepartments?: boolean) => {
      if (!departmentMapper[openDepartmentId]) {
        return []
      }
      if (!withSubDepartments) {
        return [...departmentMapper[openDepartmentId].memberList]
      }
      const items: FeishuDepartmentMemberModel[] = []
      const marked: { [unionId: string]: boolean } = {}
      const handler = (departmentId: string) => {
        const department = departmentMapper[departmentId]
        if (!department) {
          return
        }
        department.memberList
          .filter((item) => !marked[item.unionId])
          .forEach((member) => {
            items.push(member)
            marked[member.unionId] = true
          })
        department.subDepartmentList.forEach((item) => handler(item.openDepartmentId))
      }
      handler(openDepartmentId)
      return items
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
    fillUserMapper: async (unionIdList) => {
      const todoUnionIdList = unionIdList.filter((unionId) => !userMapper[unionId])
      if (todoUnionIdList.length > 0) {
        const request = MyRequest(FeishuSdkApis.FeishuStaffSearch)
        request.setBodyData({
          unionIdList: todoUnionIdList,
        })
        const items = await request.quickSend<FeishuUserModel[]>()
        const newMapper = { ...userMapper }
        items.forEach((item) => {
          newMapper[item.unionId] = item
        })
        setUserMapper(newMapper)
      }
    },
  }
  useEffect(() => {
    if (feishuValid) {
      departmentCtx.reloadDepartmentTree()
    }
  }, [])

  return <FeishuDepartmentContext.Provider value={departmentCtx}>{children}</FeishuDepartmentContext.Provider>
}
