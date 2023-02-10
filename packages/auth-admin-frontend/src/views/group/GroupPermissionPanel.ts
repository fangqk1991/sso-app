import { Component, DiffInfosDialog, Prop, ViewController } from '@fangcha/vue'
import { P_AppInfo, P_GroupDetail } from '@web/auth-common/models'
import { DiffMapper } from '@fangcha/tools'
import { MyAxios } from '@fangcha/vue/basic'
import { CommonAPI } from '@fangcha/app-request'
import { NotificationCenter } from 'notification-center-js'
import { PermissionTreeEditor } from '../permission/PermissionTreeEditor'
import { CommonAppApis } from '@web/auth-common/core-api'
import { PermissionTreeDialog } from './PermissionTreeDialog'

@Component({
  components: {
    'permission-tree-editor': PermissionTreeEditor,
  },
  template: `
    <div v-if="groupInfo" v-loading="isLoading">
      <h4 v-if="!groupInfo.blackPermission">权限项</h4>
      <h4 v-else class="text-danger">权限项黑名单</h4>
      <template v-if="isEditing">
        <div>
          <el-button size="mini" @click="showChangedItems">查看变更</el-button>
          <el-button type="success" size="mini" @click="onSubmit">完成</el-button>
          <el-button type="danger" size="mini" @click="onDiscard">撤销</el-button>
        </div>
      </template>
      <template v-else>
        <div>
          <el-button type="primary" size="mini" @click="isEditing = true">编辑</el-button>
          <el-button v-if="false" type="success" size="mini" @click="showFullPermissionInfo()">查看权限(包含子集)</el-button>
        </div>
      </template>
      <hr />
      <permission-tree-editor
        ref="permissionEditor"
        :disabled="!isEditing"
        :permission-meta="appInfo.permissionMeta"
        :checked-keys="groupInfo.permissionKeys"
      />
    </div>
  `,
})
export class GroupPermissionPanel extends ViewController {
  @Prop({ default: null, type: Object }) readonly appInfo!: P_AppInfo
  @Prop({ default: null, type: Object }) readonly groupInfo!: P_GroupDetail

  isEditing = false

  async viewDidLoad() {
    this.onDiscard()
  }

  async onSubmit() {
    this.execHandler(async () => {
      const request = MyAxios(
        new CommonAPI(CommonAppApis.AppGroupPermissionUpdate, this.appInfo.appid, this.groupInfo.groupId)
      )
      request.setBodyData(this.getDiffItems())
      await request.quickSend()
      NotificationCenter.defaultCenter().postNotification('__onGroupInfoChanged')
      this.$message.success('变更成功')
      this.isEditing = false
    })
  }

  onDiscard() {
    this.isEditing = false
  }

  getDiffItems() {
    const prevCheckedMap = this.groupInfo!.permissionKeys.reduce((result, cur) => {
      result[cur] = true
      return result
    }, {})
    const permissionEditor = this.$refs['permissionEditor'] as PermissionTreeEditor
    const checkedMap = permissionEditor.getCheckedPermissions().reduce((result, cur) => {
      result[cur] = true
      return result
    }, {})
    return DiffMapper.diff(prevCheckedMap, checkedMap)
  }

  showChangedItems() {
    const dialog = DiffInfosDialog.dialog(this.getDiffItems())
    dialog.title = `变更项`
    dialog.show()
  }

  showFullPermissionInfo() {
    const dialog = PermissionTreeDialog.dialog(this.appInfo.permissionMeta, this.groupInfo.permissionKeys)
    dialog.title = '相关权限'
    dialog.show(() => {})
  }
}
