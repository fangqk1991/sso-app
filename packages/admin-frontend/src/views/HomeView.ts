import { Component, ViewController } from '@fangcha/vue'
import { MyAxios } from '@fangcha/vue/basic'
import { RetainedHealthApis } from '@fangcha/backend-kit/lib/common/apis'

@Component({
  template: `
    <div>
      <h2>{{ $app.appName() }}</h2>
      <ul v-if="appInfo" class="mt-3">
        <li>版本: {{ appInfo.codeVersion }}</li>
        <li>环境: {{ appInfo.env }}</li>
        <li>主机: {{ appInfo.runningMachine }}</li>
        <li>
          <span>标签: </span>
          <el-tag v-for="(tag, index) in appInfo.tags" :key="index" size="mini" class="mr-2">{{ tag }}</el-tag>
        </li>
      </ul>
    </div>
  `,
})
export class HomeView extends ViewController {
  appInfo: {
    env: string
    tags: string[]
    codeVersion: string
    runningMachine: string
  } | null = null

  async viewDidLoad() {
    this.appInfo = await MyAxios(RetainedHealthApis.SystemInfoGet).quickSend()
  }
}
