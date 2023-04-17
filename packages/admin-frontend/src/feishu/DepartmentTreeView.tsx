import React, { useEffect, useMemo, useState } from 'react'
import { Button, Space, Tooltip, Tree } from 'antd'
import { FeishuDepartmentTree } from '@fangcha/account-models'
import { DownOutlined, InfoCircleFilled } from '@ant-design/icons'
import { DataNode } from 'antd/es/tree'
import { FeishuUserTag } from './FeishuUserTag'
import { useFeishuDepartmentCtx } from './FeishuDepartmentContext'

interface Props {
  departmentNode: FeishuDepartmentTree
  defaultExpandAll?: boolean
  checkable?: boolean
  defaultCheckedKeys?: (string | number)[]
  onCheckedKeysChanged?: (checkedKeys: (string | number)[]) => void
  readonly?: boolean
  showMembers?: boolean
  showRootMembers?: boolean
}

interface MyDataNode extends DataNode {
  val: FeishuDepartmentTree
  children: MyDataNode[]
}

export const DepartmentTreeView: React.FC<Props> = ({
  departmentNode,
  defaultExpandAll = true,
  checkable = false,
  defaultCheckedKeys,
  readonly = false,
  onCheckedKeysChanged,
  showMembers,
  showRootMembers,
}) => {
  const departmentCtx = useFeishuDepartmentCtx()
  const { rootNode, unionIdList, openDepartmentIdList } = useMemo(() => {
    const openDepartmentIdList: string[] = []
    const unionIdList: string[] = []
    const rootNode: MyDataNode = {
      val: departmentNode,
      title: departmentNode.departmentName,
      key: departmentNode.openDepartmentId,
      children: [],
      disableCheckbox: readonly,
    }
    let todoNodes = [rootNode] as MyDataNode[]
    while (todoNodes.length > 0) {
      let nextTodoNodes: MyDataNode[] = []
      for (const node of todoNodes) {
        const department = node.val
        openDepartmentIdList.push(department.openDepartmentId)
        unionIdList.push(...department.memberList.map((item) => item.unionId))
        const items = department.subDepartmentList || []
        node.children = items.map((item) => {
          return {
            val: item,
            title: item.departmentName,
            key: item.openDepartmentId,
            children: [],
            disableCheckbox: readonly,
          }
        })
        nextTodoNodes = nextTodoNodes.concat(node.children)
      }
      todoNodes = nextTodoNodes
    }
    return {
      rootNode: rootNode,
      unionIdList: unionIdList,
      openDepartmentIdList: openDepartmentIdList,
    }
  }, [departmentNode])

  const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>(defaultExpandAll ? openDepartmentIdList : [])
  const [checkedKeys, setCheckedKeys] = useState<(string | number)[]>()

  useEffect(() => {
    setCheckedKeys(checkable ? defaultCheckedKeys || [] : [])
  }, [checkable, defaultCheckedKeys])

  useEffect(() => {
    setExpandedKeys(defaultExpandAll ? openDepartmentIdList : [])
    departmentCtx.fillUserMapper(unionIdList)
  }, [rootNode])

  return (
    <>
      <Space style={{ marginBottom: '8px' }}>
        <Button type={'primary'} size={'small'} onClick={() => setExpandedKeys(openDepartmentIdList)}>
          全部展开
        </Button>
        <Button size={'small'} onClick={() => setExpandedKeys([])}>
          全部收起
        </Button>
      </Space>
      <Tree
        showLine
        checkable={checkable}
        switcherIcon={<DownOutlined />}
        expandedKeys={expandedKeys}
        checkedKeys={checkedKeys}
        onExpand={(expandedKeys, { expanded, node }) => {
          setExpandedKeys(expandedKeys)
        }}
        onCheck={(checkedKeys) => {
          setCheckedKeys(checkedKeys as string[])
          if (onCheckedKeysChanged) {
            onCheckedKeysChanged(checkedKeys as string[])
          }
        }}
        treeData={[rootNode]}
        style={{ padding: '8px' }}
        titleRender={(node) => {
          const meta = node.val
          return (
            <div
              onClick={() => {
                const keySet = new Set(expandedKeys)
                if (keySet.has(node.key)) {
                  keySet.delete(node.key)
                } else {
                  keySet.add(node.key)
                }
                setExpandedKeys([...keySet])
              }}
            >
              <b>{meta.departmentName}</b>
              <span style={{ display: 'none' }}>
                {' '}
                <Tooltip placement='right' title={<>openDepartmentId: {meta.openDepartmentId}</>}>
                  <InfoCircleFilled />
                </Tooltip>
              </span>
              {(showMembers || (showRootMembers && meta.openDepartmentId === departmentNode.openDepartmentId)) &&
                meta.memberList.length > 0 && (
                  <div>
                    {meta.memberList.map((member) => (
                      <FeishuUserTag key={member.unionId} member={member} />
                    ))}
                  </div>
                )}
              {/*{meta.description && (*/}
              {/*  <Tooltip title={meta.description}>*/}
              {/*    <InfoCircleFilled style={{ marginLeft: '4px' }} />*/}
              {/*  </Tooltip>*/}
              {/*)}*/}
            </div>
          )
        }}
      />
    </>
  )
}
