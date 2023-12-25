import ReactDOM from 'react-dom/client'
import React from 'react'
import { App } from './App'
import { FullLaunchContainer } from '@fangcha/auth-react/router'

const app = ReactDOM.createRoot(document.getElementById('app')!)
app.render(
  <React.StrictMode>
    <FullLaunchContainer allowAnonymous={true}>
      <App />
    </FullLaunchContainer>
  </React.StrictMode>
)
