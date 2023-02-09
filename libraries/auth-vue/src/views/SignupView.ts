import { Component } from 'vue-property-decorator'
import { MySession } from '../services/MySession'
import { ViewController } from '@fangcha/vue'
import './signin.scss'
import { SignupApis } from '@fangcha/sso-models'
import { MyAxios } from '@fangcha/vue/basic'

@Component({
  template: `
    <div class="fc-sso-form">
      <div class="logo mb-4" :style="logoStyle" />
      <div class="h3 mb-3 font-weight-normal">注册账号</div>
      <div class="input-group input-first">
        <input v-model="params.email" type="text" class="form-control" placeholder="邮箱" required autofocus />
      </div>
      <div class="input-group input-last">
        <input v-model="params.password" type="password" class="form-control" placeholder="密码" autocomplete="new-password" required @keyup.enter="onSubmit"/>
      </div>
      <button class="btn btn-lg btn-primary" style="width: 100%;" :disabled="isLoading" @click="onSubmit">注册</button>
      <p class="extras">
        <router-link :to="{ path: '/login', query: $route.query }"> >> 已有账号，点击登录</router-link>
      </p>
    </div>
  `,
})
export class SignupView extends ViewController {
  params = {
    email: '',
    password: '',
  }

  viewDidLoad() {
    MySession.redirectIfNeed()
  }

  get logoStyle() {
    return {
      background: this.$session.config.logoCss,
    }
  }

  onSubmit() {
    this.execHandler(async () => {
      const request = MyAxios(SignupApis.SimpleSignup)
      request.setBodyData(this.params)
      await request.quickSend()
      await MySession.onLoginSuccess()
    })
  }
}
