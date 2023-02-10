import { Component } from 'vue-property-decorator'
import { MultiplePicker, TypicalDialog, TypicalDialogView } from '@fangcha/vue'
import {  P_GroupInfo, P_GroupParams } from '@fangcha/account-models'
import { MyAxios } from '@fangcha/vue/basic'
import { CommonAPI } from '@fangcha/app-request'
import { SelectOption } from '@fangcha/tools'
import { CommonAppApis } from '@web/sso-common/core-api'

@Component({
  components: {
    'typical-dialog-view': TypicalDialogView,
    'multiple-picker': MultiplePicker,
  },
  template: `
    <typical-dialog-view :title="title" width="40%" :callback="callback">
      <el-form class="fc-typical-form" size="mini" label-width="120px">
        <el-form-item v-if="forEditing" label="Alias">
          <el-input v-model="data.groupAlias" type="text" style="width: 100%;"> </el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="data.name" type="text" style="width: 100%;"> </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="data.remarks" type="text" style="width: 100%;"> </el-input>
        </el-form-item>
        <el-form-item v-if="forEditing" label="保留组?">
          <el-radio-group v-model="data.isRetained" size="mini">
            <el-radio-button :key="1" :label="1">是</el-radio-button>
            <el-radio-button :key="0" :label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <div slot="label">
            用作黑名单
            <el-tooltip effect="dark" content="若用作黑名单，该组相关成员将不会具备该组所勾选的权限项" placement="bottom">
              <span class="el-icon-question" />
            </el-tooltip>
          </div>
          <el-radio-group v-model="data.blackPermission" size="mini">
            <el-radio-button :key="1" :label="1">是</el-radio-button>
            <el-radio-button :key="0" :label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否有效">
          <el-radio-group v-model="data.isEnabled" size="mini">
            <el-radio-button :key="1" :label="1">是</el-radio-button>
            <el-radio-button :key="0" :label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="子集">
          <multiple-picker v-model="data.subGroupIdList" style="width: 100%;" :options="groupOptions" filterable />
        </el-form-item>
      </el-form>
    </typical-dialog-view>
  `,
})
export class GroupInfoDialog extends TypicalDialog {
  appid: string = ''

  data: P_GroupParams = {
    name: '',
    remarks: '',
    groupAlias: '',
    isRetained: 0,
    isEnabled: 1,
    blackPermission: 0,
    subGroupIdList: [],
  }
  forEditing = false
  categoryPickerAvailable = true

  groupOptions: SelectOption[] = []

  constructor() {
    super()
  }

  async viewDidLoad() {
    const request = MyAxios(new CommonAPI(CommonAppApis.AppAllGroupListGet, this.appid))
    const items = (await request.quickSend()) as P_GroupInfo[]
    this.groupOptions = items.map((item) => {
      return {
        label: item.name,
        value: item.groupId,
      }
    })
  }

  static dialogForCreate(appid: string) {
    const dialog = new GroupInfoDialog()
    dialog.title = '创建'
    dialog.appid = appid
    return dialog
  }

  static dialogForEdit(appid: string, data: P_GroupParams) {
    const dialog = new GroupInfoDialog()
    dialog.title = '编辑'
    dialog.forEditing = true
    dialog.appid = appid
    dialog.data = JSON.parse(JSON.stringify(data))
    return dialog
  }

  async onHandleResult() {
    return this.data
  }
}
