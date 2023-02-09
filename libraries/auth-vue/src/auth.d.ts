import VueRouter from 'vue-router'
import { Session } from './services/MySession'

declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter
    $session: Session
  }
}
