import { Component, Prop, ViewController } from '@fangcha/vue'
import { Watch } from 'vue-property-decorator'
import { ElTree } from 'element-ui/types/tree'
import { PermissionMeta } from '@fangcha/account-models'

interface CommonNode {
  permissionKey: string
  val: PermissionMeta
  label: string
  children: CommonNode[]
  disabled: boolean
}

@Component({
  template: `
    <el-tree
      v-if="rootNode"
      ref="tree"
      node-key="permissionKey"
      :data="[rootNode]"
      :props="defaultProps"
      :default-expand-all="expandAll"
      :check-on-click-node="true"
      :show-checkbox="true"
      :default-checked-keys="checkedKeys"
      class="fc-tree"
    >
      <div slot-scope="{ node, data }" style="line-height: 1.6; height: auto">
        <b>{{ data.label }}</b> ({{ data.val.permissionKey }})
        <el-tooltip class="item" effect="dark" placement="bottom">
          <span class="el-icon-question"/>
          <div slot="content">{{ data.val.description }}</div>
        </el-tooltip>
      </div>
    </el-tree>
  `,
})
export class PermissionTreeEditor extends ViewController {
  @Prop({ default: true, type: Boolean }) readonly expandAll!: boolean
  @Prop({ default: false, type: Boolean }) readonly disabled!: boolean
  @Prop({ default: null, type: Object }) readonly permissionMeta!: PermissionMeta
  @Prop({ default: () => [], type: Array }) readonly checkedKeys!: string[]

  rootNode: CommonNode | null = null
  defaultProps = {
    children: 'children',
    label: 'label',
  }

  @Watch('permissionMeta')
  onPermissionMeta() {
    this.reloadRootNode()
  }

  @Watch('disabled')
  onDisabledChanged() {
    this.reloadRootNode()
  }

  async reloadRootNode() {
    const rootNode: CommonNode = {
      permissionKey: this.permissionMeta.permissionKey,
      val: this.permissionMeta,
      label: this.permissionMeta.name,
      children: [],
      disabled: false,
    }

    let todoNodes = [rootNode] as CommonNode[]
    while (todoNodes.length > 0) {
      let nextTodoNodes: CommonNode[] = []
      for (const node of todoNodes) {
        const permissionItems: PermissionMeta[] = node.val.children || []
        node.children = permissionItems.map((item) => {
          return {
            permissionKey: item.permissionKey,
            val: item,
            label: item.name,
            children: [],
            disabled: false,
          }
        })
        nextTodoNodes = nextTodoNodes.concat(node.children)
      }
      todoNodes = nextTodoNodes
    }
    this.rootNode = rootNode
    this.$nextTick(() => {
      this.fillNodesInfos(rootNode)
    })
  }

  async viewDidLoad() {
    this.reloadRootNode()
  }

  getCheckedPermissions() {
    const tree = this.$refs.tree as ElTree<string, CommonNode>
    return tree.getCheckedKeys()
  }

  fillNodesInfos(node: CommonNode) {
    node.disabled = this.disabled
    for (const subNode of node.children) {
      this.fillNodesInfos(subNode)
    }
  }
}
