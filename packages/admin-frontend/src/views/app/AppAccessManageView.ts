import { Component, ViewController } from '@fangcha/vue'
import { AppAccessTableView } from './AppAccessTableView'
import { P_AppInfo } from '@web/auth-common/models'
import { AppBreadcrumb } from './AppBreadcrumb'
import { UserHTTP } from '../../services/UserHTTP'

@Component({
  components: {
    'app-access-table-view': AppAccessTableView,
    'app-breadcrumb': AppBreadcrumb,
  },
  template: `
    <div>
      <app-breadcrumb :app-info="appInfo">
        <el-breadcrumb-item>
          <span>密钥管理</span>
        </el-breadcrumb-item>
      </app-breadcrumb>
      <hr />
      <el-card>
        <app-access-table-view :appid="appid" />
      </el-card>
    </div>
  `,
})
export class AppAccessManageView extends ViewController {
  appInfo: P_AppInfo | null = null

  get appid() {
    return this.$route.params.appid
  }

  async viewDidLoad() {
    this.reloadData()
  }

  async reloadData() {
    this.appInfo = await UserHTTP.getAppInfo(this.appid)
  }
}
