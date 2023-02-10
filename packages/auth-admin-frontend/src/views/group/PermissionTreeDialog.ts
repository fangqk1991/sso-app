import { Component, TypicalDialog, TypicalDialogView } from '@fangcha/vue'
import { PermissionMeta } from '@web/auth-common/models'
import { PermissionTreeEditor } from '../permission/PermissionTreeEditor'

@Component({
  components: {
    'typical-dialog-view': TypicalDialogView,
    'permission-tree-editor': PermissionTreeEditor,
  },
  template: `
    <typical-dialog-view class="fc-theme" :title="title" width="80%" :callback="callback">
      <permission-tree-editor
        :disabled="!isEditing"
        :permission-meta="permissionMeta"
        :checked-keys="permissionKeys"
      />
    </typical-dialog-view>
  `,
})
export class PermissionTreeDialog extends TypicalDialog {
  isEditing = false
  permissionMeta!: PermissionMeta
  permissionKeys!: string[]

  constructor() {
    super()
  }

  async viewDidLoad() {}

  static dialog(permissionMeta: PermissionMeta, permissionKeys: string[]) {
    const dialog = new PermissionTreeDialog()
    dialog.title = '相关权限'
    dialog.permissionMeta = permissionMeta
    dialog.permissionKeys = permissionKeys
    return dialog
  }
}
