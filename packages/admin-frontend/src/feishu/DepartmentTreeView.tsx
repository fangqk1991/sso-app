import React, { useEffect, useMemo, useState } from 'react'
import { Button, Space, Tree } from 'antd'
import { FeishuDepartmentTree } from '@fangcha/account-models'
import { DownOutlined } from '@ant-design/icons'
import { DataNode } from 'antd/es/tree'

interface Props {
  departmentNode: FeishuDepartmentTree
  defaultExpandAll?: boolean
  checkable?: boolean
  defaultCheckedKeys?: (string | number)[]
  onCheckedKeysChanged?: (checkedKeys: (string | number)[]) => void
  readonly?: boolean
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
}) => {
  const rootNode = useMemo(() => {
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
        const items = node.val.subDepartmentList || []
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
    return rootNode
  }, [departmentNode])
  const allKeys = useMemo(() => {
    const keys: string[] = []
    let todoMetaList = [rootNode]
    while (todoMetaList.length > 0) {
      let nextTodoMetaList: MyDataNode[] = []
      for (const todoMeta of todoMetaList) {
        keys.push(todoMeta.val.openDepartmentId)
        if (todoMeta.children) {
          nextTodoMetaList = nextTodoMetaList.concat(todoMeta.children)
        }
      }
      todoMetaList = nextTodoMetaList
    }
    return keys
  }, [rootNode])
  console.info(rootNode)

  const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>(defaultExpandAll ? allKeys : [])
  const [checkedKeys, setCheckedKeys] = useState<(string | number)[]>()
  useEffect(() => {
    setCheckedKeys(checkable ? defaultCheckedKeys || [] : [])
  }, [checkable, defaultCheckedKeys])

  return (
    <>
      <Space style={{ marginBottom: '8px' }}>
        <Button type={'primary'} size={'small'} onClick={() => setExpandedKeys(allKeys)}>
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
            <div>
              <b>{meta.departmentName}</b>
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
