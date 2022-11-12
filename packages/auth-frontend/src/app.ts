import { BasicApp } from '@fangcha/vue/app'
import { AuthPluginForServer } from '@fangcha/vue/auth'

const app = new BasicApp({
  appName: 'Fangcha SSO',
  plugins: [AuthPluginForServer()],
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
  ]
})
app.launch()
