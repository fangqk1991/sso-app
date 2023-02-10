import { Component, Prop, ViewController } from '@fangcha/vue'
import { P_AppInfo, P_GroupDetail } from '@web/auth-common/models'

@Component({
  template: `
    <el-breadcrumb separator="/" class="mb-4 mt-2" style="font-size: 16px">
      <el-breadcrumb-item to="/v1/app">应用列表</el-breadcrumb-item>
      <el-breadcrumb-item v-if="appInfo" :to="{ name: 'AppDetailView', params: { appid: appInfo.appid } }">
        <span>{{ appInfo.name }}</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-if="groupInfo">
        <span>{{ groupInfo.name }}</span>
      </el-breadcrumb-item>
      <slot />
    </el-breadcrumb>
  `,
})
export class AppBreadcrumb extends ViewController {
  @Prop({ default: null, type: Object }) readonly appInfo!: P_AppInfo
  @Prop({ default: null, type: Object }) readonly groupInfo!: P_GroupDetail
}
