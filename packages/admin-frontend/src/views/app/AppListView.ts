import { Component, GridView, JsonImportDialog, MyTableView, TableViewProtocol, ViewController, } from '@fangcha/vue'
import { CommonAPI } from '@fangcha/app-request'
import { MyAxios } from '@fangcha/vue/basic'
import { AppImportParams, P_AppInfo } from '@web/auth-common/models'
import { Admin_AppApis } from '@web/auth-common/admin-api'
import { AppCard } from './AppCard'
import { AppInfoDialog } from './AppInfoDialog'

@Component({
  components: {
    'grid-view': GridView,
    'app-card': AppCard,
  },
  template: `
    <div>
      <h2>应用列表</h2>
      <el-form class="mt-2" label-position="top" :inline="true" size="mini" @submit.native.prevent>
        <el-form-item>
          <el-button type="primary" size="mini" @click="onClickCreate">创建应用</el-button>
          <el-button type="success" size="mini" @click="onImportApp">导入</el-button>
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
      <grid-view ref="tableView" :delegate="delegate">
        <app-card slot-scope="scope" :data="scope.data" @change="reloadData" />
      </grid-view>
    </div>
  `,
})
export default class AppListView extends ViewController {
  filterParams: any = this.initFilterParams(true)

  initFilterParams(useQuery = false) {
    const query = useQuery ? this.$route.query : {}
    return {
      keywords: query['keywords'] || '',
    }
  }

  async viewDidLoad() {
    this.tableView().resetFilter(true)
  }

  onFilterUpdate() {
    this.tableView().onFilterUpdate()
  }

  reloadData() {
    this.tableView().reloadData()
  }

  onClickCreate() {
    const dialog = AppInfoDialog.dialogForCreate()
    dialog.show(async (params: P_AppInfo) => {
      const request = MyAxios(new CommonAPI(Admin_AppApis.AppCreate))
      request.setBodyData(params)
      await request.quickSend()
      this.$message.success('创建成功')
      this.tableView().reloadData()
    })
  }

  resetFilter(useQuery = false) {
    this.filterParams = this.initFilterParams(useQuery)
    this.tableView().reloadData()
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
        const request = MyAxios(new CommonAPI(Admin_AppApis.AppPageDataGet))
        request.setQueryParams(params)
        return request.quickSend()
      },
      reactiveQueryParams: (retainQueryParams) => {
        return Object.assign({}, retainQueryParams, this.filterParams)
      },
    }
  }

  async onImportApp() {
    const dialog = JsonImportDialog.dialog()
    dialog.show(async (metadata: AppImportParams) => {
      const request = MyAxios(new CommonAPI(Admin_AppApis.AppFullCreate))
      request.setBodyData(metadata)
      await request.quickSend()
      this.$message.success('导入成功')
      this.tableView().reloadData()
    })
  }
}
