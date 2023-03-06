import React from 'react'
import { Tooltip, Tree } from 'antd'
import { PermissionMeta } from '@fangcha/account-models'
import { DownOutlined, InfoCircleFilled } from '@ant-design/icons'
import { DataNode } from 'antd/es/tree'

interface Props {
  permissionMeta: PermissionMeta
  defaultExpandAll?: boolean
}

interface MyDataNode extends DataNode {
  val: PermissionMeta
  children: MyDataNode[]
}

export const PermissionTreeView: React.FC<Props> = ({ permissionMeta, defaultExpandAll = true }) => {
  const rootNode: MyDataNode = {
    val: permissionMeta,
    title: permissionMeta.name,
    key: permissionMeta.permissionKey,
    children: [],
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
        }
      })
      nextTodoNodes = nextTodoNodes.concat(node.children)
    }
    todoNodes = nextTodoNodes
  }

  return (
    <Tree
      showLine
      switcherIcon={<DownOutlined />}
      defaultExpandAll={defaultExpandAll}
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
  )
}
