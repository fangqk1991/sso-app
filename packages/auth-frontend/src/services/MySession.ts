import { AuthSession } from './AuthSession'

export interface SessionConfig {
  appName: string
  logoCss: string
  background: string
  signupAble: boolean
  hidePromotion: boolean
}

const config: SessionConfig = {
  appName: 'Fangcha',
  background: '#f5f5f5',
  logoCss: 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)',
  signupAble: false,
  hidePromotion: false,
}

export const MySession = new AuthSession(config)
