import { Component, ConfirmDialog, MyTagsPanel, Prop, ViewController } from '@fangcha/vue'
import { P_AppInfo } from '@fangcha/account-models'
import { AppInfoDialog } from './AppInfoDialog'
import { MyAxios } from '@fangcha/vue/basic'
import { CommonAPI } from '@fangcha/app-request'
import { CommonAppApis } from '@web/sso-common/core-api'
import { Admin_AppApis } from '@web/sso-common/admin-api'

@Component({
  components: {
    'my-tags-panel': MyTagsPanel,
  },
  template: `
    <div class="fc-card mr-2" style="width: 300px;">
      <h5 class="fc-single-line">
        {{ data.name }}
        <el-tooltip
          class="item"
          effect="dark"
          placement="top"
        >
          <ul slot="content" class="fc-clean-ul" style="line-height: 2">
            <li>
              <b>Appid</b>: {{ data.appid }}
            </li>
            <li>
              <b>管理员</b>: <my-tags-panel style="display: inline-block" :values="data.powerUserList" />
            </li>
            <li>
              <b>创建时间</b>: {{ data.createTime }}
            </li>
          </ul>
          <small class="el-icon-question" />
        </el-tooltip>
      </h5>
      <ul class="fc-clean-ul">
        <li>
          <b>Appid</b>: {{ data.appid }}
          <el-tag size="mini" type="success">{{ data.appType }}</el-tag>
        </li>
        <li>
          <b>管理员</b>: <my-tags-panel style="display: inline-block" :values="data.powerUserList" />
        </li>
        <li><hr /></li>
        <li>
          <router-link :to="{ name: 'AppDetailView', params: { appid: data.appid } }">
            查看详情
          </router-link>
          |
          <a class="text-success" href="javascript:" @click="onClickCreate()">复制</a>
          |
          <a href="javascript:" @click="onEditItem()">编辑</a>
          |
          <a class="text-danger" href="javascript:" @click="onDeleteItem()">删除</a>
        </li>
      </ul>
    </div>
  `,
})
export class AppCard extends ViewController {
  @Prop({ default: null, type: Object }) readonly data!: P_AppInfo

  onClickCreate() {
    this.$message('开发中……')
    // const dialog = ClientInfoDialog.dialogForCreate(this.data)
    // dialog.show(async (params: SsoClientParams) => {
    //   const request = MyAxios(new CommonAPI(Admin_SsoClientApis.ClientCreate))
    //   request.setBodyData(params)
    //   const data = (await request.quickSend()) as SsoClientModel
    //   this.$emit('change')
    //   MessageBox.alert(`请保存此 App Secret [${data.clientSecret}]（只在本次展示）`, '创建成功', {
    //     confirmButtonText: '关闭',
    //     showClose: false,
    //   })
    // })
  }

  onEditItem() {
    const dialog = AppInfoDialog.dialogForEdit(this.data)
    dialog.show(async (params: P_AppInfo) => {
      const request = MyAxios(new CommonAPI(CommonAppApis.AppUpdate, this.data.appid))
      request.setBodyData(params)
      await request.quickSend()
      this.$message.success('更新成功')
      this.$emit('change')
    })
  }

  onDeleteItem() {
    const dialog = ConfirmDialog.strongDialog()
    dialog.title = `请确认`
    dialog.content = `确定要删除应用 ${this.data.name}[${this.data.appid}] 吗？`
    dialog.show(async () => {
      const request = MyAxios(new CommonAPI(Admin_AppApis.AppDelete, this.data.appid))
      await request.quickSend()
      this.$message.success('删除成功')

      this.$emit('change')
    })
  }
}
