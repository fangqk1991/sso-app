import { MainLayout } from './views/MainLayout'
import { _defaultTheme, ThemeContext } from './services/ThemeContext'
import './assets/main.scss'

export const App = () => {
  return (
    <ThemeContext.Provider value={_defaultTheme}>
      <MainLayout />
    </ThemeContext.Provider>
  )
}
