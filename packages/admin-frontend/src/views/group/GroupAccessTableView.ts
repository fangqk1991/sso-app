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
import { P_GroupAccessInfo } from '@fangcha/account-models'
import { MyAxios } from '@fangcha/vue/basic'
import { CommonAPI } from '@fangcha/app-request'
import { CommonAppApis } from '@web/sso-common/core-api'

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
        <el-table-column label="Group Secret">
          <template slot-scope="scope">
            <span>{{ scope.row.groupSecret }}</span>
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
export class GroupAccessTableView extends ViewController {
  @Prop({ default: '', type: String }) readonly appid!: string
  @Prop({ default: '', type: String }) readonly groupId!: string

  async viewDidLoad() {
    this.tableView().resetFilter(true)
  }

  async onClickCreate() {
    const request = MyAxios(new CommonAPI(CommonAppApis.AppGroupAccessCreate, this.appid, this.groupId))
    const data = (await request.quickSend()) as P_GroupAccessInfo
    this.tableView().reloadData()
    AlertTools.showAlert(`创建成功，请保存此 Secret [${data.groupSecret}]`, '创建成功')
  }

  async onShowAppSecret(item: P_GroupAccessInfo) {
    const request = MyAxios(
      new CommonAPI(CommonAppApis.AppGroupAccessInfoRequest, this.appid, this.groupId, item.accessId)
    )
    const data = (await request.quickSend()) as P_GroupAccessInfo
    AlertTools.showAlert(data.groupSecret, 'Secret')
  }

  onDeleteItem(item: P_GroupAccessInfo) {
    const dialog = new ConfirmDialog()
    dialog.content = `确定要删除吗？`
    dialog.show(async () => {
      const request = MyAxios(new CommonAPI(CommonAppApis.AppGroupAccessDelete, this.appid, this.groupId, item.accessId))
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
        const request = MyAxios(new CommonAPI(CommonAppApis.AppGroupAccessPageDataGet, this.appid, this.groupId))
        request.setQueryParams(params)
        return request.quickSend()
      },
    }
  }
}
