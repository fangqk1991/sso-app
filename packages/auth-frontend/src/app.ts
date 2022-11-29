import { BasicApp } from '@fangcha/vue/app'
import { AuthPluginForServer, MySession } from '@fangcha/vue/auth'

const app = new BasicApp({
  appName: 'Fangcha SSO',
  plugins: [AuthPluginForServer()],
  session: MySession,
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
  ],
})
app.launch()
