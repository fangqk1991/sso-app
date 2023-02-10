import { Component } from 'vue-property-decorator'
import { StringListPanel, TypicalDialog, TypicalDialogView } from '@fangcha/vue'
import { AppType, AppTypeDescriptor, P_AppInfo, P_AppParams, PermissionHelper } from '@fangcha/account-models'

@Component({
  components: {
    'typical-dialog-view': TypicalDialogView,
    'string-list-panel': StringListPanel,
  },
  template: `
    <typical-dialog-view :title="title" width="40%" :callback="callback">
      <el-form class="fc-typical-form" size="mini" label-width="100px">
        <el-form-item label="Appid" :required="true" class="my-form-item">
          <el-input v-model="data.appid" type="text" style="width: 100%;" :disabled="forEditing"> </el-input>
        </el-form-item>
        <el-form-item label="应用名" class="my-form-item">
          <el-input v-model="data.name" type="text" style="width: 100%;"> </el-input>
        </el-form-item>
        <el-form-item label="应用类型" class="my-form-item">
          <el-radio-group v-model="data.appType" :disabled="forEditing">
            <el-radio-button v-for="option in appTypeOptions" :key="option.value" :label="option.value">{{ option.label }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" class="my-form-item">
          <el-input v-model="data.remarks" type="text" style="width: 100%;"> </el-input>
        </el-form-item>
        <el-form-item label="管理员" class="my-form-item">
          <string-list-panel v-model="data.powerUserList" />
        </el-form-item>
      </el-form>
    </typical-dialog-view>
  `,
})
export class AppInfoDialog extends TypicalDialog {
  appTypeOptions = AppTypeDescriptor.options()

  data: P_AppParams = {
    appid: '',
    appType: AppType.Admin,
    name: '',
    remarks: '',
    author: '',
    configData: {},
    permissionMeta: PermissionHelper.defaultPermissionMeta(),
    powerUserList: [],
    version: 0,
  }
  forEditing = false

  constructor() {
    super()
  }

  viewDidLoad() {}

  static dialogForCreate() {
    const dialog = new AppInfoDialog()
    dialog.title = '创建应用'
    return dialog
  }

  static dialogForEdit(data: P_AppInfo) {
    const dialog = new AppInfoDialog()
    dialog.title = '编辑应用'
    dialog.forEditing = true
    dialog.data = JSON.parse(JSON.stringify(data))
    return dialog
  }

  async onHandleResult() {
    return this.data
  }
}
