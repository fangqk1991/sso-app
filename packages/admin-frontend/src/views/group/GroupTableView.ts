import {
  AlertTools,
  Component,
  ConfirmDialog,
  JsonImportDialog,
  MySelect,
  MyTableView,
  Prop,
  TableViewProtocol,
  ViewController,
} from '@fangcha/vue'
import {
  AppType,
  GroupImportParams,
  P_AppInfo,
  P_GroupDetail,
  P_GroupInfo,
  P_GroupParams,
  PermissionHelper,
} from '@fangcha/account-models'
import { MyAxios } from '@fangcha/vue/basic'
import { CommonAPI } from '@fangcha/app-request'
import { CommonAppApis } from '@web/auth-common/core-api'
import { PermissionTreeEditor } from '../permission/PermissionTreeEditor'
import { GroupInfoDialog } from './GroupInfoDialog'
import { RouteHelper } from '../../extensions/RouteHelper'

@Component({
  components: {
    'my-select': MySelect,
    'my-table-view': MyTableView,
    'permission-tree-editor': PermissionTreeEditor,
  },
  template: `
    <div>
      <h4>{{ title }}</h4>
      <el-form class="mt-2" label-position="top" :inline="true" size="mini" @submit.native.prevent>
        <el-form-item>
          <el-button type="primary" size="mini" @click="onClickCreate">创建</el-button>
          <el-button type="success" size="mini" @click="onImportGroup">导入</el-button>
          <el-button type="danger" size="mini" @click="onDestroyAllGroups">移除所有</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true" size="mini" label-position="top" @submit.native.prevent="onFilterUpdate">
        <el-form-item label="包含权限项">
          <el-select
            v-model="filterParams.includingPermission"
            placeholder="Permission Key"
            filterable
            clearable
            style="width: 300px"
            @change="onFilterUpdate"
          >
            <el-option v-for="item in permissionMetaList" :key="item.permissionKey" :value="item.permissionKey">
              {{ item.name }}({{ item.permissionKey }})
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="isAppTypeAdmin" label="包含用户">
          <el-input
            v-model="filterParams.includingMember"
            clearable
            placeholder="Email"
            style="width: 300px"
            @keyup.enter.native="onFilterUpdate"
          >
            <template slot="append">
              <el-button size="mini" @click="onFilterUpdate">搜索</el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <el-form :inline="true" size="mini" label-position="top" @submit.native.prevent="onFilterUpdate">
        <el-form-item>
          <el-input
            v-model="filterParams.keywords"
            clearable
            placeholder="关键字"
            style="width: 300px"
            @keyup.enter.native="onFilterUpdate"
          >
            <template slot="append">
              <el-button size="mini" @click="onFilterUpdate">搜索</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" @click="resetFilter()">重置过滤器</el-button>
        </el-form-item>
      </el-form>
      <my-table-view ref="tableView" :delegate="delegate" :row-class-name="tableRowClassName">
        <el-table-column>
          <template v-slot:header>
            <span v-if="isAppTypeAdmin">
              组信息
            </span>
            <span v-else>
              访客信息
            </span>
          </template>
          <template slot-scope="scope">
            <div>
              <router-link :to="RouteHelper.to_GroupDetailView(scope.row)">
                {{ scope.row.groupId }}
              </router-link>
            </div>
            <div v-if="scope.row.groupAlias !== scope.row.groupId">
              <el-tag type="success" size="mini">Alias: {{ scope.row.groupAlias }}</el-tag>
            </div>
            <div>名称: {{ scope.row.name }}</div>
            <div v-if="scope.row.remarks">备注: {{ scope.row.remarks }}</div>
            <div v-if="scope.row.isRetained" style="font-size: 12px;">
              <el-tag size="mini" type="success">系统保留组</el-tag>
            </div>
            <div v-if="scope.row.blackPermission" style="font-size: 12px;">
              <el-tag size="mini" type="danger">黑名单权限组</el-tag>
            </div>
            <div>
              操作:
              <a href="javascript:" @click="onEditItem(scope.row)">编辑</a> |
              <a href="javascript:" @click="onExportGroup(scope.row)">导出</a> |
              <a href="javascript:" @click="onDeleteItem(scope.row)">删除</a>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="权限" min-width="200%">
          <template slot-scope="scope">
            <permission-tree-editor
              :disabled="true"
              :expand-all="false"
              :permission-meta="permissionMeta"
              :checked-keys="scope.row.permissionKeys"
            />
          </template>
        </el-table-column>
      </my-table-view>
    </div>
  `,
})
export class GroupTableView extends ViewController {
  RouteHelper = RouteHelper

  @Prop({ default: null, type: Object }) readonly appInfo!: P_AppInfo

  get appid() {
    return this.appInfo.appid
  }

  get permissionMeta() {
    return this.appInfo.permissionMeta
  }

  get isAppTypeAdmin() {
    return this.appInfo.appType === AppType.Admin
  }

  get title() {
    return this.isAppTypeAdmin ? '用户组' : '访客'
  }

  filterParams: any = this.initFilterParams(true)

  initFilterParams(useQuery = false) {
    const query = useQuery ? this.$route.query : {}
    return {
      keywords: query['keywords'] || '',
      groupCategory: query['groupCategory'] || '',
      includingPermission: query['includingPermission'] || '',
      includingMember: query['includingMember'] || '',
    }
  }

  tableRowClassName({ row }: { row: P_GroupInfo }) {
    if (!row.isEnabled) {
      return 'row-disabled'
    }
    return ''
  }

  get permissionMetaList() {
    return PermissionHelper.flattenPermissionMeta(this.permissionMeta)
  }

  async viewDidLoad() {
    this.reloadData()
  }

  onFilterUpdate() {
    this.tableView().onFilterUpdate()
  }

  async reloadData() {
    this.tableView().reloadData()
    this.reloadDepartmentGroups()
  }

  groups: P_GroupDetail[] = []
  async reloadDepartmentGroups() {
    const request = MyAxios(new CommonAPI(CommonAppApis.AppDepartmentGroupListGet, this.appid))
    this.groups = (await request.quickSend()) as P_GroupDetail[]
  }

  onClickCreate() {
    const dialog = GroupInfoDialog.dialogForCreate(this.appid)
    dialog.categoryPickerAvailable = this.isAppTypeAdmin
    dialog.show(async (params: P_GroupParams) => {
      const request = MyAxios(new CommonAPI(CommonAppApis.AppGroupCreate, this.appid))
      request.setBodyData(params)
      const group = (await request.quickSend()) as P_GroupInfo
      this.$message.success('创建成功')
      this.reloadData()
      AlertTools.showConfirm(`创建成功，是否跳转到 ${group.name} 页面`).then(() => {
        this.$goto(RouteHelper.to_GroupDetailView(group))
      })
    })
  }

  onEditItem(item: P_GroupInfo) {
    const dialog = GroupInfoDialog.dialogForEdit(this.appid, item)
    dialog.categoryPickerAvailable = this.isAppTypeAdmin
    dialog.show(async (params: P_GroupParams) => {
      const request = MyAxios(new CommonAPI(CommonAppApis.AppGroupInfoUpdate, this.appid, item.groupId))
      request.setBodyData(params)
      await request.quickSend()
      this.$message.success('更新成功')
      this.reloadData()
    })
  }

  onDeleteItem(item: P_GroupInfo) {
    const dialog = new ConfirmDialog()
    dialog.content = `确定要删除应用组 ${item.name}[${item.groupId}] 吗？`
    dialog.show(async () => {
      const request = MyAxios(new CommonAPI(CommonAppApis.AppGroupDelete, this.appid, item.groupId))
      await request.quickSend()
      this.$message.success('删除成功')
      this.reloadData()
    })
  }

  onExportGroup(group: P_GroupInfo) {
    window.location.href = new CommonAPI(CommonAppApis.AppGroupInfoExport, this.appid, group.groupId).api
  }

  async onDestroyAllGroups() {
    const dialog = ConfirmDialog.strongDialog()
    dialog.title = '移除所有组'
    dialog.content = `确定要移除所有组吗？`
    dialog.show(async () => {
      const request = MyAxios(new CommonAPI(CommonAppApis.AppGroupsDestroy, this.appid))
      await request.quickSend()
      this.$message.success('移除成功')
      this.reloadData()
    })
  }

  async onImportGroup() {
    const dialog = JsonImportDialog.dialog()
    dialog.show(async (metadata: GroupImportParams) => {
      const request = MyAxios(new CommonAPI(CommonAppApis.AppGroupFullCreate, this.appid))
      request.setBodyData(metadata)
      await request.quickSend()
      this.$message.success('导入成功')
      this.reloadData()
    })
  }

  resetFilter(useQuery = false) {
    this.filterParams = this.initFilterParams(useQuery)
    this.reloadData()
  }

  tableView() {
    return this.$refs.tableView as MyTableView
  }
  get delegate(): TableViewProtocol {
    return {
      loadData: async (retainParams) => {
        const params: any = {
          ...retainParams,
          ...this.filterParams,
        }
        const request = MyAxios(new CommonAPI(CommonAppApis.AppGroupPageDataGet, this.appid))
        request.setQueryParams(params)
        return request.quickSend()
      },
      reactiveQueryParams: (retainQueryParams) => {
        return Object.assign({}, retainQueryParams, this.filterParams)
      },
    }
  }
}
