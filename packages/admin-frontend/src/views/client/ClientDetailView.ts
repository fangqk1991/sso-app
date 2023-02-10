import { Component, ViewController } from '@fangcha/vue'
import { RouteHelper } from '../../extensions/RouteHelper'
import { ClientUtils } from '../../services/ClientUtils'
import { CommonAPI } from '@fangcha/app-request'
import { ClientInfoPanel } from './ClientInfoPanel'
import ClientUserAuthTable from './ClientUserAuthTable'
import { MyAxios } from '@fangcha/vue/basic'
import { NotificationCenter } from 'notification-center-js'
import { SsoClientModel } from '@fangcha/sso-models'
import { Admin_SsoClientApis } from '@web/sso-common/admin-api'

@Component({
  components: {
    'client-info-panel': ClientInfoPanel,
    'client-user-auth-table': ClientUserAuthTable,
  },
  template: `
    <div>
      <el-breadcrumb separator="/" class="mb-4 mt-2" style="font-size: 16px">
        <el-breadcrumb-item :to="RouteHelper.to_MyClientListView()">
          我的客户端
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <span>{{ clientInfo.name }} [{{ clientInfo.clientId }}]</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <hr />
      <client-info-panel :client="clientInfo" />
      <el-card class="mt-4">
        <client-user-auth-table :client-id="clientId" />
      </el-card>
    </div>
  `,
})
export default class ClientDetailView extends ViewController {
  RouteHelper = RouteHelper

  clientInfo: SsoClientModel = ClientUtils.init_clientModel()

  async viewDidLoad() {
    NotificationCenter.defaultCenter().addObserver('__onClientInfoChanged', this.reloadInfo)
    this.reloadInfo()
  }

  get clientId() {
    return this.$route.params.clientId
  }

  async reloadInfo() {
    const request = MyAxios(new CommonAPI(Admin_SsoClientApis.ClientInfoGet, this.clientId))
    this.clientInfo = await request.quickSend()
  }

  viewWillUnload() {
    NotificationCenter.defaultCenter().removeObserver('__onClientInfoChanged', this.reloadInfo)
  }
}
