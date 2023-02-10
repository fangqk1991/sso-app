import { Component, Prop, ViewController } from '@fangcha/vue'
import { Watch } from 'vue-property-decorator'
import { PermissionMeta } from '@web/auth-common/models'

interface CommonNode {
  val: PermissionMeta
  label: string
  children: CommonNode[]
}

@Component({
  template: `
    <el-tree
      v-if="rootNode"
      :data="[rootNode]"
      :props="defaultProps"
      :default-expand-all="expandAll"
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
export class PermissionTreeView extends ViewController {
  @Prop({ default: true, type: Boolean }) readonly expandAll!: boolean
  @Prop({ default: null, type: Object }) readonly permissionMeta!: PermissionMeta

  rootNode: CommonNode | null = null
  defaultProps = {
    children: 'children',
    label: 'label',
  }

  @Watch('permissionMeta')
  onValueChanged() {
    this.reloadRootNode()
  }

  async reloadRootNode() {
    const rootNode: CommonNode = {
      val: this.permissionMeta,
      label: this.permissionMeta.name,
      children: [],
    }

    let todoNodes = [rootNode] as CommonNode[]
    while (todoNodes.length > 0) {
      let nextTodoNodes: CommonNode[] = []
      for (const node of todoNodes) {
        const permissionItems: PermissionMeta[] = node.val.children || []
        node.children = permissionItems.map((item) => {
          return {
            val: item,
            label: item.name,
            children: [],
          }
        })
        nextTodoNodes = nextTodoNodes.concat(node.children)
      }
      todoNodes = nextTodoNodes
    }
    this.rootNode = rootNode
  }

  async viewDidLoad() {
    this.reloadRootNode()
  }
}
