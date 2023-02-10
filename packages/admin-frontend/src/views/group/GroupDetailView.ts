import { Component, FragmentProtocol, JsonImportDialog, ViewController } from '@fangcha/vue'
import { CommonAPI } from '@fangcha/app-request'
import {
  AppImportParams,
  AppType,
  P_AppInfo,
  P_GroupDetail,
} from '@fangcha/account-models'
import { MyAxios } from '@fangcha/vue/basic'
import { NotificationCenter } from 'notification-center-js'
import { GroupPermissionPanel } from './GroupPermissionPanel'
import { GroupMemberPanel } from './GroupMemberPanel'
import { GroupAccessTableView } from './GroupAccessTableView'
import { GroupInfoDialog } from './GroupInfoDialog'
import { AppBreadcrumb } from '../app/AppBreadcrumb'
import { CommonAppApis } from '@web/auth-common/core-api'
import { UserHTTP } from '../../services/UserHTTP'
import { RouteHelper } from '../../extensions/RouteHelper'

@Component({
  components: {
    'group-permission-panel': GroupPermissionPanel,
    'group-member-panel': GroupMemberPanel,
    'group-access-table-view': GroupAccessTableView,
    'app-breadcrumb': AppBreadcrumb,
  },
  template: `
    <div>
      <app-breadcrumb :app-info="appInfo" :group-info="groupInfo" />
      <hr />
      <el-tabs v-if="groupInfo" v-model="curTab" type="border-card" @tab-click="onTabClick">
        <el-tab-pane label="基本信息" name="basic-info" :lazy="true">
          <div>
            <h4>
              {{ title }}
              <small style="font-size: 70%;"><a href="javascript:" @click="onEditItem()">编辑</a></small>
            </h4>
            <el-form label-position="left" label-width="120px">
              <el-form-item class="card-form-item" label="ID">
                {{ groupInfo.groupId }}
              </el-form-item>
              <el-form-item class="card-form-item" label="Alias ID">
                {{ groupInfo.groupAlias }}
              </el-form-item>
              <el-form-item class="card-form-item" label="名称">
                {{ groupInfo.name }}
              </el-form-item>
              <el-form-item v-if="groupInfo.blackPermission" class="card-form-item" label="特别说明">
                <el-tag size="mini" type="danger">黑名单权限组</el-tag>
                <el-tooltip effect="dark" content="该组相关成员不会具备该组所勾选的权限项" placement="bottom">
                  <span class="el-icon-question" />
                </el-tooltip>
              </el-form-item>
              <el-form-item class="card-form-item" label="备注">
                {{ groupInfo.remarks }}
              </el-form-item>
              <el-form-item class="card-form-item" label="是否有效">
                <el-tag v-if="groupInfo.isEnabled" size="mini" type="success">Enabled</el-tag>
                <el-tag v-else size="mini" type="danger">Disabled</el-tag>
              </el-form-item>
              <el-form-item class="card-form-item" label="子集">
                <template v-for="groupId in groupInfo.subGroupIdList">
                  <router-link
                    v-if="groupInfo.subGroupMapper[groupId]"
                    :to="RouteHelper.to_GroupDetailView(groupInfo.subGroupMapper[groupId])"
                    class="mr-2"
                  >
                    <el-tag size="mini" :type="groupInfo.subGroupMapper[groupId].isEnabled ? '' : 'info'">
                      {{ groupInfo.subGroupMapper[groupId].name }}
                    </el-tag>
                  </router-link>
                  <el-tag v-else size="mini" type="info">{{ groupId }} (Invalid)</el-tag>
                </template>
              </el-form-item>
              <el-form-item class="card-form-item" label="创建者">
                <staff-span :use-tag="true" :email="groupInfo.author" />
              </el-form-item>
              <el-form-item class="card-form-item" label="创建时间">
                {{ groupInfo.createTime | ISO8601 }}
              </el-form-item>
              <el-form-item class="card-form-item" label="更新时间">
                {{ groupInfo.updateTime | ISO8601 }}
              </el-form-item>
              <el-form-item class="card-form-item" label="操作">
                <el-button size="mini" type="primary" @click="onExportGroup">导出</el-button>
                <el-button size="mini" type="danger" @click="onUpdateFullGroupInfo">导入更新信息</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="appInfo" label="权限信息" name="permission-info" :lazy="true">
          <group-permission-panel :app-info="appInfo" :group-info="groupInfo" />
        </el-tab-pane>
        <el-tab-pane v-if="isAppTypeAdmin" label="成员信息" name="member-info" :lazy="true">
          <group-member-panel class="mt-4" title="成员列表" :appid="appid" :group-id="groupId" />
          <template v-if="groupInfo.subGroupIdList.length > 0">
            <hr />
            <h4>完整子集信息</h4>
            <template v-for="groupId in groupInfo.subGroupIdList">
              <router-link
                v-if="groupInfo.subGroupMapper[groupId]"
                :to="RouteHelper.to_GroupDetailView(groupInfo.subGroupMapper[groupId])"
                class="mr-2"
              >
                <el-tag size="mini" :type="groupInfo.subGroupMapper[groupId].isEnabled ? '' : 'info'">
                  {{ groupInfo.subGroupMapper[groupId].name }}
                </el-tag>
              </router-link>
              <el-tag v-else size="mini" type="info">{{ groupId }} (Invalid)</el-tag>
            </template>
            <hr />
            <h4>完整成员（包含子集）</h4>
            <staff-email-list-panel :emails="fullMembers" :readonly="true" />
          </template>
        </el-tab-pane>
        <el-tab-pane label="密钥管理" name="secret-management" :lazy="true">
          <group-access-table-view :appid="appid" :group-id="groupId" />
        </el-tab-pane>
      </el-tabs>
    </div>
  `,
})
export class GroupDetailView extends ViewController {
  appInfo: P_AppInfo | null = null
  groupInfo: P_GroupDetail | null = null

  RouteHelper = RouteHelper
  fullMembers: string[] = []

  get appid() {
    return this.$route.params.appid
  }

  get groupId() {
    return this.$route.params.groupId
  }

  get isAppTypeAdmin() {
    return !!this.appInfo && this.appInfo.appType === AppType.Admin
  }

  get title() {
    return this.isAppTypeAdmin ? '用户组' : '访客信息'
  }

  async viewDidLoad() {
    UserHTTP.getAppInfo(this.appid).then((info) => {
      this.appInfo = info
      if (this.isAppTypeAdmin) {
        const query = this.$route.query as any
        this.curTab = query.curTab || 'basic-info'
      }
    })
    NotificationCenter.defaultCenter().addObserver('__onGroupInfoChanged', this.reloadData)
    this.reloadData()
  }

  viewWillUnload() {
    NotificationCenter.defaultCenter().removeObserver('__onGroupInfoChanged', this.reloadData)
  }

  async reloadData() {
    const request = MyAxios(new CommonAPI(CommonAppApis.AppGroupInfoGet, this.appid, this.groupId))
    this.groupInfo = await request.quickSend()

    {
      const request = MyAxios(new CommonAPI(CommonAppApis.AppGroupFullMembersGet, this.appid, this.groupId))
      this.fullMembers = await request.quickSend()
    }
  }

  onEditItem() {
    const dialog = GroupInfoDialog.dialogForEdit(this.appid, this.groupInfo!)
    dialog.categoryPickerAvailable = this.isAppTypeAdmin
    dialog.show(async (params: P_AppInfo) => {
      const request = MyAxios(new CommonAPI(CommonAppApis.AppGroupInfoUpdate, this.appid, this.groupId))
      request.setBodyData(params)
      await request.quickSend()
      this.$message.success('更新成功')
      this.reloadData()
    })
  }

  onExportGroup() {
    window.location.href = new CommonAPI(CommonAppApis.AppGroupInfoExport, this.appid, this.groupId).api
  }

  async onUpdateFullGroupInfo() {
    const dialog = JsonImportDialog.dialog()
    dialog.description =
      '请参考导出的组信息结构进行更新导入，被传递的一级节点相关属性会被覆盖式更新 (包括 permissionKeys 或 members)'
    dialog.show(async (metadata: AppImportParams) => {
      const request = MyAxios(new CommonAPI(CommonAppApis.AppFullGroupInfoUpdate, this.appid, this.groupId))
      request.setBodyData(metadata)
      await request.quickSend()
      this.$message.success('更新成功')
      window.location.reload()
    })
  }

  curTab = 'basic-info'

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
