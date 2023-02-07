import { Component } from 'vue-property-decorator'
import { ViewController } from '@fangcha/vue'
import './signin.scss'
import { MySession } from '../services/MySession'

@Component({
  template: `
    <div class="fc-sso-form">
      <div v-if="$session.curUser" class="mb-4">Email: {{ $session.curUser.email }}</div>
      <button class="btn btn-danger" style="width: 100%;" @click="onLogout">登出</button>
    </div>
  `,
})
export class ProfileView extends ViewController {
  async onLogout() {
    window.location.href = MySession.logoutApiPath
  }
}
