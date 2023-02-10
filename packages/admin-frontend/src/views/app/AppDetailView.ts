import { Component, FragmentProtocol, JsonEditorDialog, JsonPre, ViewController } from '@fangcha/vue'
import { AppInfoPanel } from './AppInfoPanel'
import { NotificationCenter } from 'notification-center-js'
import { UserHTTP } from '../../services/UserHTTP'
import { P_AppInfo, PermissionHelper, PermissionMeta } from '@fangcha/account-models'
import { AppBreadcrumb } from './AppBreadcrumb'
import { PermissionTreeView } from '../permission/PermissionTreeView'
import { PermissionMetaDialog } from '../permission/PermissionMetaDialog'
import { GroupTableView } from '../group/GroupTableView'

@Component({
  components: {
    'group-table-view': GroupTableView,
    'permission-tree-view': PermissionTreeView,
    'json-pre': JsonPre,
    'app-info-panel': AppInfoPanel,
    'app-breadcrumb': AppBreadcrumb,
  },
  template: `
    <div>
      <app-breadcrumb :app-info="appInfo" />
      <hr />
      <el-tabs v-if="appInfo" v-model="curTab" type="border-card" @tab-click="onTabClick">
        <el-tab-pane label="基本信息" name="basic-info" :lazy="true">
          <app-info-panel :app-info="appInfo" />
        </el-tab-pane>
        <el-tab-pane label="应用配置" name="app-config" :lazy="true">
          <div class="mb-2">
            <el-button type="primary" size="mini" @click="onEditConfigData()">编辑应用配置</el-button>
          </div>
          <json-pre :value="appInfo.configData" />
        </el-tab-pane>
        <el-tab-pane label="权限描述" name="permission-meta" :lazy="true">
          <div class="mb-2">
            <el-button size="mini" type="primary" @click="onEditPermissionInfo()">编辑权限描述</el-button>
<!--            <router-link :to="UserSdkRouteHelper.to_AppPermissionView(appInfo.appid)">-->
<!--              <el-button size="mini" type="success">高级检索</el-button>-->
<!--            </router-link>-->
          </div>
          <permission-tree-view :permission-meta="appInfo.permissionMeta" :expand-all="true" />
        </el-tab-pane>
        <el-tab-pane label="用户组 / 访客" name="user-group" :lazy="true">
          <group-table-view :app-info="appInfo" />
        </el-tab-pane>
      </el-tabs>
    </div>
  `,
})
export class AppDetailView extends ViewController {
  appInfo: P_AppInfo | null = null

  curTab = ''

  get appid() {
    return this.$route.params.appid || '_'
  }

  permissionTreeExpand() {
    return this.appInfo && PermissionHelper.flattenPermissionMeta(this.appInfo.permissionMeta).length <= 10
  }

  async viewDidLoad() {
    NotificationCenter.defaultCenter().addObserver('__onAppInfoChanged', this.reloadData)

    const query = this.$route.query as any
    this.curTab = query.curTab || 'basic-info'
    this.reloadData()
  }

  viewWillUnload() {
    NotificationCenter.defaultCenter().removeObserver('__onAppInfoChanged', this.reloadData)
  }

  async reloadData() {
    this.appInfo = await UserHTTP.getAppInfo(this.appid)
  }

  onEditPermissionInfo() {
    const dialog = PermissionMetaDialog.dialogForEdit(this.appInfo!.permissionMeta)
    dialog.show(async (permissionMeta: PermissionMeta) => {
      await UserHTTP.updateApp(
        {
          permissionMeta: permissionMeta,
        },
        this.appid
      )
      this.$message.success('更新成功')
      this.reloadData()
    })
  }

  onEditConfigData() {
    const dialog = JsonEditorDialog.dialogForEdit(this.appInfo!.configData)
    dialog.show(async (configData: {}) => {
      await UserHTTP.updateApp(
        {
          configData: configData,
        },
        this.appid
      )
      this.$message.success('更新成功')
      this.reloadData()
    })
  }

  onTabClick() {
    this.updateQuery()
    const fragment: FragmentProtocol | any = this.$refs[this.curTab]
    if (fragment) {
      fragment.resetFilter()
    }
  }

  updateQuery() {
    const queryParams = {}
    queryParams['curTab'] = this.curTab
    this.$router.replace({
      name: this.$route.name as string,
      query: queryParams,
    })
  }
}
