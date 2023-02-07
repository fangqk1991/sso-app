import { Component } from 'vue-property-decorator'
import { MySession } from '../services/MySession'
import { ViewController } from '@fangcha/vue'
import './signin.scss'

@Component({
  template: `
    <div class="fc-sso-form">
      <div class="logo mb-4" :style="logoStyle" />
      <div class="h3 mb-3 font-weight-normal">请登录</div>
      <div class="input-group input-first">
        <input v-model="params.email" type="text" class="form-control" placeholder="邮箱" required autofocus />
      </div>
      <div class="input-group input-last">
        <input v-model="params.password" type="password" class="form-control" placeholder="密码" required @keyup.enter="onSubmit"/>
      </div>
      <button class="btn btn-lg btn-primary" style="width: 100%;" :disabled="isLoading" @click="onSubmit">登录</button>
      <p v-if="$session.config.signupAble" class="extras">
        <router-link :to="{ path: '/signup', query: $route.query }"> >> 没有账号，点击注册</router-link>
      </p>
    </div>
  `,
})
export class LoginView extends ViewController {
  params = {
    email: '',
    password: '',
  }

  viewDidLoad() {
    MySession.redirectIfNeed()
  }

  get logoStyle() {
    return {
      'background': this.$session.config.logoCss,
    }
  }

  async onSubmit() {
    await this.execHandler(async () => {
      await MySession.submitLogin(this.params)
      await MySession.onLoginSuccess()
    })
  }
}
