import {
  Component,
  JsonImportDialog,
  JsonPre,
  MyTableView,
  Prop,
  TextPreviewDialog,
  ViewController,
} from '@fangcha/vue'
import { AppInfoDialog } from './AppInfoDialog'
import { CommonAPI } from '@fangcha/app-request'
import { MyAxios } from '@fangcha/vue/basic'
import { AppImportParams, P_AppInfo } from '@web/auth-common/models'
import { UserHTTP } from '../../services/UserHTTP'
import { CommonAppApis } from '@web/auth-common/core-api'

@Component({
  components: {
    'my-table-view': MyTableView,
    'json-pre': JsonPre,
  },
  template: `
    <div v-if="appInfo">
      <el-button type="primary" size="mini" @click="onEditItem()">编辑</el-button>
      <el-form label-position="left" label-width="120px">
        <el-form-item class="card-form-item" label="Appid">
          {{ appInfo.appid }}
        </el-form-item>
        <el-form-item class="card-form-item" label="应用类型">
          {{ appInfo.appType }}
        </el-form-item>
        <el-form-item class="card-form-item" label="应用名">
          {{ appInfo.name }}
        </el-form-item>
        <el-form-item class="card-form-item" label="备注">
          {{ appInfo.remarks }}
        </el-form-item>
        <el-form-item class="card-form-item" label="版本号">
          {{ appInfo.version }}
        </el-form-item>
        <el-form-item class="card-form-item" label="创建者">
          <staff-span :email="appInfo.author" :use-tag="true" />
        </el-form-item>
        <el-form-item class="card-form-item" label="创建时间">
          {{ appInfo.createTime | ISO8601 }}
        </el-form-item>
        <el-form-item class="card-form-item" label="更新时间">
          {{ appInfo.updateTime | ISO8601 }}
        </el-form-item>
        <el-form-item class="card-form-item" label="管理员">
          <staff-span v-for="item in appInfo.powerUserList" :key="item" :email="item" :use-tag="true" class="mr-2" />
        </el-form-item>
<!--        <el-form-item class="card-form-item" label="API 文档">-->
<!--          <a :href="appInfo.swaggerPageUrl" target="_blank">{{ appInfo.swaggerPageUrl }}</a>-->
<!--          |-->
<!--          <router-link :to="UserSdkRouteHelper.to_AppAccessManageView(appInfo.appid)">-->
<!--            密钥管理-->
<!--          </router-link>-->
<!--        </el-form-item>-->
        <el-form-item class="card-form-item" label="操作">
          <el-button size="mini" type="primary" @click="onExportApp">导出结构</el-button>
          <el-button size="mini" type="success" @click="onPreview">预览数据</el-button>
          <el-button size="mini" type="danger" @click="onUpdateFullAppInfo">导入更新信息</el-button>
        </el-form-item>
      </el-form>
    </div>
  `,
})
export class AppInfoPanel extends ViewController {
  @Prop({ default: null, type: Object }) readonly appInfo!: P_AppInfo

  onEditItem() {
    const dialog = AppInfoDialog.dialogForEdit(this.appInfo!)
    dialog.show(async (params: P_AppInfo) => {
      await UserHTTP.updateApp(params, this.appInfo.appid)
      this.$message.success('更新成功')
    })
  }

  onExportApp() {
    window.location.href = new CommonAPI(CommonAppApis.AppInfoExport, this.appInfo.appid).api
  }

  async onPreview() {
    const request = MyAxios(new CommonAPI(CommonAppApis.AppOpenInfoPreview, this.appInfo.appid))
    const response = await request.quickSend()
    TextPreviewDialog.previewJSON(response)
  }

  async onUpdateFullAppInfo() {
    const dialog = JsonImportDialog.dialog()
    dialog.description = '请参考导出的应用信息结构进行更新导入，导入前不会清空现有的用户组'
    dialog.show(async (metadata: AppImportParams) => {
      const request = MyAxios(new CommonAPI(CommonAppApis.AppFullInfoUpdate, this.appInfo.appid))
      request.setBodyData(metadata)
      await request.quickSend()
      this.$message.success('更新成功')
      window.location.reload()
    })
  }
}
