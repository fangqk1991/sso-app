import { Component } from 'vue-property-decorator'
import { MySwitch, StringListPanel, TypicalDialog, TypicalDialogView } from '@fangcha/vue'
import { SsoClientParams } from '@fangcha/sso-models'

@Component({
  components: {
    'typical-dialog-view': TypicalDialogView,
    'string-list-panel': StringListPanel,
    'my-switch': MySwitch,
  },
  template: `
    <typical-dialog-view :title="title" width="60%" :callback="callback">
      <el-form class="fc-typical-form" size="mini" label-width="120px">
        <el-form-item label="clientId" :required="true">
          <el-input v-model="client.clientId" type="text" :disabled="forEditing" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="名称" :required="true">
          <el-input v-model="client.name" type="text" style="width: 100%;" />
        </el-form-item>
        <el-form-item v-if="highVisible" label="scopes">
          <string-list-panel v-model="client.scopeList" />
        </el-form-item>
        <el-form-item label="redirectUris">
          <string-list-panel v-model="client.redirectUriList" />
        </el-form-item>
        <el-form-item v-if="highVisible">
          <template slot="label">
            特权应用
            <el-tooltip class="item" effect="dark" content="无需用户点击，自动获得授权 (针对可信应用)" placement="bottom">
              <span class="el-icon-question" />
            </el-tooltip>
          </template>
          <my-switch v-model="client.autoGranted" />
        </el-form-item>
        <el-form-item v-if="highVisible">
          <template slot="label">
            合作商
            <el-tooltip class="item" effect="dark" content="合作商可以创建公司" placement="bottom">
              <span class="el-icon-question" />
            </el-tooltip>
          </template>
          <my-switch v-model="client.isPartner" />
        </el-form-item>
        <el-form-item v-if="client.autoGranted">
          <template slot="label">
            通知地址
            <el-tooltip class="item" effect="dark" content="仅作用于特权应用" placement="bottom">
              <span class="el-icon-question" />
            </el-tooltip>
          </template>
          <el-input v-model="client.notifyUrl" type="text" style="width: 100%;" />
        </el-form-item>
        <el-form-item v-if="highVisible">
          <template slot="label">
            events
            <el-tooltip class="item" effect="dark" content="仅作用于特权应用" placement="bottom">
              <span class="el-icon-question" />
            </el-tooltip>
          </template>
          <string-list-panel v-model="client.eventList" />
        </el-form-item>
        <el-form-item label="管理员">
          <string-list-panel v-model="client.powerUsers" />
        </el-form-item>
      </el-form>
    </typical-dialog-view>
  `,
})
export class ClientInfoDialog extends TypicalDialog {
  client: SsoClientParams = {
    clientId: '',
    name: '',
    grantList: [],
    scopeList: [],
    eventList: [],
    redirectUriList: [],
    accessTokenLifeTime: 0,
    refreshTokenLifeTime: 0,
    isPartner: 0,
    autoGranted: 0,
    isEnabled: 0,
    powerUsers: [],
    notifyUrl: '',
  }
  forEditing = false

  constructor() {
    super()
  }

  static dialogForCreate(data?: SsoClientParams) {
    const dialog = new ClientInfoDialog()
    dialog.title = '创建客户端信息'
    if (data) {
      dialog.client = JSON.parse(JSON.stringify(data))
    }
    return dialog
  }

  static dialogForEdit(data: SsoClientParams) {
    const dialog = new ClientInfoDialog()
    dialog.title = '编辑客户端信息'
    dialog.forEditing = true
    dialog.client = JSON.parse(JSON.stringify(data))
    return dialog
  }

  onHandleResult() {
    return this.client
  }

  get highVisible() {
    return true
  }
}
