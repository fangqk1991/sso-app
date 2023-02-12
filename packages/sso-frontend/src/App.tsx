import { MainLayout } from './views/MainLayout'
import { _defaultSession, SessionContext } from './services/SessionContext'
import './assets/main.scss'
import { useState } from 'react'

export const App = () => {
  const [session, setSession] = useState(_defaultSession)
  return (
    <SessionContext.Provider value={session}>
      <MainLayout />
    </SessionContext.Provider>
  )
}
