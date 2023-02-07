import VueRouter from 'vue-router'
import { AuthSession } from './services/AuthSession'
import { SessionConfig } from './services/MySession'

declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter
    $session: AuthSession<SessionConfig>
  }
}
