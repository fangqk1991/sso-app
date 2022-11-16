import VueRouter from 'vue-router'
import { Session } from '@fangcha/vue/auth'

declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter
    $session: Session
  }
}
