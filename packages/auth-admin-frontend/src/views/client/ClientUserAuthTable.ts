import { Component, MyTableView, MyTagsPanel, Prop, TableViewProtocol, ViewController } from '@fangcha/vue'
import { CommonAPI } from '@fangcha/app-request'
import { MyAxios } from '@fangcha/vue/basic'
import { Admin_SsoClientApis } from '@web/auth-common/admin-api'

@Component({
  components: {
    'my-table-view': MyTableView,
    'my-tags-panel': MyTagsPanel,
  },
  template: `
    <div>
      <h2>已授权的用户</h2>
      <my-table-view ref="tableView" :delegate="delegate">
        <el-table-column label="用户 ID">
          <template slot-scope="scope">
            <span>{{ scope.row.userUid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="授权范围">
          <template slot-scope="scope">
            <my-tags-panel :values="scope.row.scopeList" />
          </template>
        </el-table-column>
        <el-table-column label="授权时间 / 更新时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | ISO8601 }}</span><br />
            <span>{{ scope.row.updateTime | ISO8601 }}</span>
          </template>
        </el-table-column>
      </my-table-view>
    </div>
  `,
})
export default class ClientUserAuthTable extends ViewController {
  @Prop({ default: '', type: String }) readonly clientId!: string

  filterParams: any = this.initFilterParams(true)

  initFilterParams(useQuery = false) {
    const query = useQuery ? this.$route.query : {}
    return {
      isEnabled: query['isEnabled'] || '',
    }
  }

  async viewDidLoad() {
    this.tableView().resetFilter(true)
  }

  onFilterUpdate() {
    this.tableView().onFilterUpdate()
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
      defaultSettings: {
        pageSize: 10,
      },
      loadData: async (retainParams) => {
        const params: any = {
          ...retainParams,
          ...this.filterParams,
        }
        const request = MyAxios(new CommonAPI(Admin_SsoClientApis.ClientAuthPageDataGet, this.clientId))
        request.setQueryParams(params)
        return request.quickSend()
      },
    }
  }
}
