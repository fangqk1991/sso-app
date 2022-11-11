import { BasicApp } from '@fangcha/vue/app'
import { AuthPluginForServer } from '@fangcha/vue/auth'

const app = new BasicApp({
  appName: 'Fangcha Inc.',
  plugins: [AuthPluginForServer()],
})
app.launch()
