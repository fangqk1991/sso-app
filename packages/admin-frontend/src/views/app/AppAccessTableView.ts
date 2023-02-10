import {
  AlertTools,
  Component,
  ConfirmDialog,
  MySelect,
  MyTableView,
  Prop,
  TableViewProtocol,
  ViewController,
} from '@fangcha/vue'
import { MyAxios } from '@fangcha/vue/basic'
import { CommonAPI } from '@fangcha/app-request'
import { P_AccessInfo } from '@web/auth-common/models'
import { CommonAppApis } from '@web/auth-common/core-api'

@Component({
  components: {
    'my-select': MySelect,
    'my-table-view': MyTableView,
  },
  template: `
    <div>
      <h4>密钥管理</h4>
      <el-form class="mt-2" label-position="top" :inline="true" size="mini" @submit.native.prevent>
        <el-form-item>
          <el-button type="primary" size="mini" @click="onClickCreate">创建密钥</el-button>
        </el-form-item>
      </el-form>
      <my-table-view ref="tableView" :delegate="delegate" :reactive-query="false">
        <el-table-column label="App Secret">
          <template slot-scope="scope">
            <span>{{ scope.row.appSecret }}</span>
            |
            <a href="javascript:" @click="onShowAppSecret(scope.row)">显示</a>
          </template>
        </el-table-column>
        <el-table-column label="创建者">
          <template slot-scope="scope">
            <el-tag size="mini">{{ scope.row.author }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间 / 更新时间">
          <template slot-scope="scope">
            {{ scope.row.createTime | ISO8601 }}<br />
            {{ scope.row.updateTime | ISO8601 }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a href="javascript:" @click="onDeleteItem(scope.row)">删除</a>
          </template>
        </el-table-column>
      </my-table-view>
    </div>
  `,
})
export class AppAccessTableView extends ViewController {
  @Prop({ default: '', type: String }) readonly appid!: string

  async viewDidLoad() {
    this.tableView().reloadData()
  }

  onFilterUpdate() {
    this.tableView().onFilterUpdate()
  }

  async onClickCreate() {
    const request = MyAxios(new CommonAPI(CommonAppApis.AppAccessCreate, this.appid))
    const data = (await request.quickSend()) as P_AccessInfo
    this.tableView().reloadData()
    AlertTools.showAlert(`创建成功，请保存此 App Secret [${data.appSecret}]`, '创建成功')
  }

  async onShowAppSecret(item: P_AccessInfo) {
    const request = MyAxios(new CommonAPI(CommonAppApis.AppAccessInfoRequest, this.appid, item.accessId))
    const data = (await request.quickSend()) as P_AccessInfo
    AlertTools.showAlert(data.appSecret, 'App Secret')
  }

  onDeleteItem(item: P_AccessInfo) {
    const dialog = new ConfirmDialog()
    dialog.content = `确定要删除吗？`
    dialog.show(async () => {
      const request = MyAxios(new CommonAPI(CommonAppApis.AppAccessDelete, this.appid, item.accessId))
      await request.quickSend()
      this.$message.success('删除成功')
      this.tableView().reloadData()
    })
  }

  tableView() {
    return this.$refs.tableView as MyTableView
  }
  get delegate(): TableViewProtocol {
    return {
      loadData: async (retainParams) => {
        const params: any = {
          ...retainParams,
        }
        const request = MyAxios(new CommonAPI(CommonAppApis.AppAccessPageDataGet, this.appid))
        request.setQueryParams(params)
        return request.quickSend()
      },
      // reactiveQueryParams: (retainQueryParams) => {
      //   return Object.assign({}, retainQueryParams, this.filterParams)
      // },
    }
  }
}
