import { Component } from 'vue-property-decorator'
import { MyTagsPanel, Prop, ViewController } from '@fangcha/vue'
import { ClientInfoDialog } from './ClientInfoDialog'
import { MyAxios } from '@fangcha/vue/basic'
import { CommonAPI } from '@fangcha/app-request'
import { NotificationCenter } from 'notification-center-js'
import { SsoClientModel, SsoClientParams } from '@fangcha/sso-models'
import { Admin_SsoClientApis } from '@web/sso-common/admin-api'

@Component({
  components: {
    'my-tags-panel': MyTagsPanel,
  },
  template: `
    <el-card>
      <h4>基本信息</h4>
      <el-button type="primary" size="mini" @click="onEditItem()">编辑</el-button>
      <el-form label-position="left" label-width="120px">
        <el-form-item label="clientId" class="card-form-item">
          <span>{{ client.clientId }}</span>
        </el-form-item>
        <el-form-item label="应用名" class="card-form-item">
          <span>{{ client.name }}</span>
        </el-form-item>
        <el-form-item label="grants" class="card-form-item">
          <my-tags-panel :values="client.grantList" />
        </el-form-item>
        <el-form-item label="scopes" class="card-form-item">
          <my-tags-panel :values="client.scopeList" />
        </el-form-item>
        <el-form-item label="redirectUris" class="card-form-item">
          <my-tags-panel :values="client.redirectUriList" />
        </el-form-item>
        <el-form-item label="notifyUrl" class="card-form-item">
          <el-tag class="adaptive-tag">{{ client.notifyUrl }}</el-tag>
        </el-form-item>
        <el-form-item label="events" class="card-form-item">
          <my-tags-panel :values="client.eventList" />
        </el-form-item>
        <el-form-item class="card-form-item" label="管理员">
          <my-tags-panel :values="client.powerUsers" />
        </el-form-item>
        <el-form-item label="创建时间" class="card-form-item">
          <span>{{ client.createTime | ISO8601 }}</span>
        </el-form-item>
        <el-form-item label="更新时间" class="card-form-item">
          <span>{{ client.updateTime | ISO8601 }}</span>
        </el-form-item>
      </el-form>
    </el-card>
  `,
})
export class ClientInfoPanel extends ViewController {
  @Prop({ default: null, type: Object }) readonly client!: SsoClientModel

  constructor() {
    super()
  }

  onEditItem() {
    const dialog = ClientInfoDialog.dialogForEdit(this.client)
    dialog.show(async (params: SsoClientParams) => {
      const request = MyAxios(new CommonAPI(Admin_SsoClientApis.ClientInfoUpdate, this.client.clientId))
      request.setBodyData(params)
      await request.quickSend()
      this.$message.success('更新成功')
      NotificationCenter.defaultCenter().postNotification('__onClientInfoChanged')
    })
  }
}
