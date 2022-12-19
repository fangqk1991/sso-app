import React from 'react'

interface SessionConfig {
  appName: string
  logoCss: string
  background: string
  signupAble: boolean
  hidePromotion: boolean
}

export const _defaultTheme: SessionConfig = {
  appName: 'Fangcha',
  background: '#f5f5f5',
  logoCss: 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)',
  signupAble: false,
  hidePromotion: false,
}

export const ThemeContext = React.createContext(_defaultTheme)
