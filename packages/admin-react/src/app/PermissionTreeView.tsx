import React, { useEffect, useMemo, useState } from 'react'
import { Button, Space, Tooltip, Tree } from 'antd'
import { PermissionMeta } from '@fangcha/account-models'
import { DownOutlined, InfoCircleFilled } from '@ant-design/icons'
import { DataNode } from 'antd/es/tree'

interface Props {
  permissionMeta: PermissionMeta
  defaultExpandAll?: boolean
  checkable?: boolean
  defaultCheckedKeys?: (string | number)[]
  onCheckedKeysChanged?: (checkedKeys: (string | number)[]) => void
  readonly?: boolean
}

interface MyDataNode extends DataNode {
  val: PermissionMeta
  children: MyDataNode[]
}

export const PermissionTreeView: React.FC<Props> = ({
  permissionMeta,
  defaultExpandAll = true,
  checkable = false,
  defaultCheckedKeys = [],
  readonly = false,
  onCheckedKeysChanged,
}) => {
  const rootNode = useMemo(() => {
    const rootNode: MyDataNode = {
      val: permissionMeta,
      title: permissionMeta.name,
      key: permissionMeta.permissionKey,
      children: [],
      disableCheckbox: readonly,
    }
    let todoNodes = [rootNode] as MyDataNode[]
    while (todoNodes.length > 0) {
      let nextTodoNodes: MyDataNode[] = []
      for (const node of todoNodes) {
        const permissionItems: PermissionMeta[] = node.val.children || []
        node.children = permissionItems.map((item) => {
          return {
            val: item,
            title: item.name,
            key: item.permissionKey,
            children: [],
            disableCheckbox: readonly,
          }
        })
        nextTodoNodes = nextTodoNodes.concat(node.children)
      }
      todoNodes = nextTodoNodes
    }
    return rootNode
  }, [permissionMeta])
  const allKeys = useMemo(() => {
    const keys: string[] = []
    let todoMetaList = [permissionMeta]
    while (todoMetaList.length > 0) {
      let nextTodoMetaList: PermissionMeta[] = []
      for (const todoMeta of todoMetaList) {
        keys.push(todoMeta.permissionKey)
        if (todoMeta.children) {
          nextTodoMetaList = nextTodoMetaList.concat(todoMeta.children)
        }
      }
      todoMetaList = nextTodoMetaList
    }
    return keys
  }, [permissionMeta])

  const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>(defaultExpandAll ? allKeys : [])
  const [checkedKeys, setCheckedKeys] = useState<(string | number)[]>([])
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
              <b>{meta.name}</b> ({meta.permissionKey})
              {meta.description && (
                <Tooltip title={meta.description}>
                  <InfoCircleFilled style={{ marginLeft: '4px' }} />
                </Tooltip>
              )}
            </div>
          )
        }}
      />
    </>
  )
}
