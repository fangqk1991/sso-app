import VueRouter from 'vue-router'
import { AuthSession, SessionConfig } from '@fangcha/auth-vue'

declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter
    $session: AuthSession<SessionConfig>
  }
}
