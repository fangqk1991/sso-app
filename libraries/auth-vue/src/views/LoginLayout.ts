import { Component } from 'vue-property-decorator'
import { MySession } from '../services/MySession'
import { ViewController } from '@fangcha/vue'
import './signin.scss'

@Component({
  template: `
    <div style="width: 100vw; height: 100vh;" :style="style">
      <div class="pr-3 pt-3 fc-app-promotion" style="text-align: right">{{ $session.config.appName }}.
        <template v-if="!$session.config.hidePromotion">
          Powered by <a target="_blank" href="https://github.com/fangqk1991/sso-app"> fangqk1991/sso-app</a>
        </template>
      </div>
      <router-view />
      <div v-if="$session.config.beianText" class="fc-app-promotion" style="position: fixed; bottom: 8px; left: 0; right: 0; text-align: center;">
        <a href="https://beian.miit.gov.cn/" target="_blank">{{ $session.config.beianText }}</a>
      </div>
    </div>
  `,
})
export class LoginLayout extends ViewController {
  params = {
    email: '',
    password: '',
  }

  viewDidLoad() {
    MySession.redirectIfNeed()
  }

  get style() {
    return {
      background: this.$session.config.background,
    }
  }

  async onSubmit() {
    await this.execHandler(async () => {
      await MySession.submitLogin(this.params)
      await MySession.onLoginSuccess()
    })
  }
}
