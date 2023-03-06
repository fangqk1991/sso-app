import React from 'react'
import { Tree } from 'antd'
import { PermissionMeta } from '@fangcha/account-models'
import { DownOutlined } from '@ant-design/icons'
import type { DataNode } from 'antd/es/tree'

interface Props {
  permissionMeta: PermissionMeta
}

interface MyDataNode extends DataNode {
  val: PermissionMeta
  children: MyDataNode[]
}

const treeData: DataNode[] = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
          },
          {
            title: 'leaf',
            key: '0-0-0-2',
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [
          {
            title: 'leaf',
            key: '0-0-1-0',
          },
        ],
      },
      {
        title: 'parent 1-2',
        key: '0-0-2',
        children: [
          {
            title: 'leaf',
            key: '0-0-2-0',
          },
          {
            title: 'leaf',
            key: '0-0-2-1',
          },
        ],
      },
    ],
  },
]

export const PermissionTreeView: React.FC<Props> = ({ permissionMeta }) => {
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

  return <Tree showLine switcherIcon={<DownOutlined />} defaultExpandAll={true} treeData={[rootNode]} />
}
