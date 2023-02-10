import { Component, GridView, MyTableView, TableViewProtocol, ViewController, } from '@fangcha/vue'
import { MyAxios } from '@fangcha/vue/basic'
import { CommonAPI } from '@fangcha/app-request'
import { ClientInfoDialog } from './ClientInfoDialog'
import { MessageBox } from 'element-ui'
import { SsoClientModel, SsoClientParams } from '@fangcha/sso-models'
import { ClientCard } from './ClientCard'
import { Admin_SsoClientApis } from '@web/auth-common/admin-api'

@Component({
  components: {
    'grid-view': GridView,
    'client-card': ClientCard,
  },
  template: `
    <div>
      <h2>SSO 客户端</h2>
      <el-form :inline="true" size="mini" @submit.prevent.native="onFilterUpdate">
        <el-form-item>
          <el-button type="primary" size="mini" @click="onClickCreate()">创建客户端</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true" size="mini" @submit.prevent.native="onFilterUpdate">
        <el-form-item>
          <el-input v-model="filterParams.keywords" clearable placeholder="Keywords" style="width: 330px">
            <template slot="append">
              <el-button size="mini" @click="onFilterUpdate">Search</el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <grid-view ref="tableView" :delegate="delegate">
        <client-card slot-scope="scope" :data="scope.data" @change="reloadData" />
      </grid-view>
    </div>
  `,
})
export default class ClientListView extends ViewController {
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

  resetFilter(useQuery = false) {
    this.filterParams = this.initFilterParams(useQuery)
    this.tableView().reloadData()
  }

  reloadData() {
    this.tableView().reloadData()
  }

  tableView() {
    return this.$refs.tableView as MyTableView
  }
  get delegate(): TableViewProtocol {
    return {
      defaultSettings: {
        sortDirection: 'descending',
      },
      loadData: async (retainParams) => {
        const params: any = {
          ...retainParams,
          ...this.filterParams,
        }
        const request = MyAxios(new CommonAPI(Admin_SsoClientApis.ClientPageDataGet))
        request.setQueryParams(params)
        return request.quickSend()
      },
      reactiveQueryParams: (retainQueryParams) => {
        return Object.assign({}, retainQueryParams, this.filterParams)
      },
    }
  }

  onClickCreate() {
    const dialog = ClientInfoDialog.dialogForCreate()
    dialog.show(async (params: SsoClientParams) => {
      const request = MyAxios(new CommonAPI(Admin_SsoClientApis.ClientCreate))
      request.setBodyData(params)
      const data = (await request.quickSend()) as SsoClientModel
      this.tableView().reloadData()
      MessageBox.alert(`请保存此 App Secret [${data.clientSecret}]（只在本次展示）`, '创建成功', {
        confirmButtonText: '关闭',
        showClose: false,
      })
    })
  }
}
