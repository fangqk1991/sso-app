import { Component, ConfirmDialog, MyTagsPanel, Prop, ViewController } from '@fangcha/vue'
import { SsoClientModel, SsoClientParams } from '@fangcha/sso-models'
import { RouteHelper } from '../../extensions/RouteHelper'
import { ClientInfoDialog } from './ClientInfoDialog'
import { MyAxios } from '@fangcha/vue/basic'
import { CommonAPI } from '@fangcha/app-request'
import { MessageBox } from 'element-ui'
import { Admin_SsoClientApis } from '@web/sso-common/admin-api'

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
          <ul slot="content" class="fc-clean-ul">
            <li>
              <b>Client ID</b>: {{ data.clientId }}
            </li>
            <li>
              <b>redirectUris</b>: <my-tags-panel style="display: inline-block" :values="data.redirectUriList" />
            </li>
            <li>
              <b>管理员</b>: <my-tags-panel style="display: inline-block" :values="data.powerUsers" />
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
          <b>Client ID</b>: {{ data.clientId }}
        </li>
        <li>
          <b>管理员</b>: <my-tags-panel style="display: inline-block" :values="data.powerUsers" />
        </li>
        <li><hr /></li>
        <li>
          <router-link :to="clientDetailRoute">
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
export class ClientCard extends ViewController {
  @Prop({ default: null, type: Object }) readonly data!: SsoClientModel

  get clientDetailRoute() {
    return RouteHelper.to_ClientDetailView(this.data)
  }

  onClickCreate() {
    const dialog = ClientInfoDialog.dialogForCreate(this.data)
    dialog.show(async (params: SsoClientParams) => {
      const request = MyAxios(new CommonAPI(Admin_SsoClientApis.ClientCreate))
      request.setBodyData(params)
      const data = (await request.quickSend()) as SsoClientModel
      this.$emit('change')
      MessageBox.alert(`请保存此 App Secret [${data.clientSecret}]（只在本次展示）`, '创建成功', {
        confirmButtonText: '关闭',
        showClose: false,
      })
    })
  }

  onEditItem() {
    const dialog = ClientInfoDialog.dialogForEdit(this.data)
    dialog.show(async (params: SsoClientParams) => {
      const request = MyAxios(new CommonAPI(Admin_SsoClientApis.ClientInfoUpdate, this.data.clientId))
      request.setBodyData(params)
      await request.quickSend()
      this.$message.success('更新成功')
      this.$emit('change')
    })
  }

  onDeleteItem() {
    const dialog = ConfirmDialog.strongDialog()
    dialog.title = `请确认`
    dialog.content = `确定删除此客户端 [${this.data.name}] 吗`
    dialog.show(async () => {
      const request = MyAxios(new CommonAPI(Admin_SsoClientApis.ClientDelete, this.data.clientId))
      await request.quickSend()
      this.$message.success('删除成功')

      this.$emit('change')
    })
  }
}
