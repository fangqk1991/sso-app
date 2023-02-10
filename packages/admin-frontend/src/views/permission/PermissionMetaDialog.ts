import { Component } from 'vue-property-decorator'
import { AlertTools, TypicalDialog, TypicalDialogView } from '@fangcha/vue'
import { PermissionTreeView } from './PermissionTreeView'
import { PermissionHelper, PermissionMeta } from '@fangcha/account-models'

@Component({
  components: {
    'typical-dialog-view': TypicalDialogView,
    'permission-tree-view': PermissionTreeView,
  },
  template: `
    <typical-dialog-view :title="title" width="70%" :callback="callback">
      <p>
        权限描述必须为标准的 JSON 格式，具体格式: PermissionMeta<br />
        PermissionMeta 定义: { permissionKey: string; name: string; description: string; children: PermissionMeta[] }
      </p>
      <div>
        <el-input v-model="permissionInfo" :rows="10" type="textarea"></el-input>
      </div>
      <div class="mt-2">
        <el-button type="primary" size="mini" @click="formatPermissionMeta">格式化校验并刷新预览</el-button>
      </div>
      <permission-tree-view class="mt-2 bordered-content" :permission-meta="permissionMeta" />
    </typical-dialog-view>
  `,
})
export class PermissionMetaDialog extends TypicalDialog {
  permissionMeta: PermissionMeta = PermissionHelper.defaultPermissionMeta()
  forEditing = false
  permissionInfo = ''

  constructor() {
    super()
  }

  viewDidLoad() {
    this.permissionInfo = JSON.stringify(this.permissionMeta, null, 2)
  }

  static dialogForEdit(data: PermissionMeta) {
    const dialog = new PermissionMetaDialog()
    dialog.title = '编辑权限'
    dialog.forEditing = true
    dialog.permissionMeta = JSON.parse(JSON.stringify(data))
    return dialog
  }

  async onHandleResult() {
    try {
      this.permissionMeta = JSON.parse(this.permissionInfo)
    } catch (e) {
      this.$message.error(`JSON 格式有误`)
      throw e
    }
    return this.permissionMeta
  }

  formatPermissionMeta() {
    try {
      const permissionMeta = JSON.parse(this.permissionInfo)
      PermissionHelper.checkPermissionMeta(permissionMeta)
      this.permissionMeta = permissionMeta
      this.permissionInfo = JSON.stringify(permissionMeta, null, 2)
    } catch (e: any) {
      AlertTools.showAlert(e.message)
    }
  }
}
