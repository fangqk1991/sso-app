import ReactDOM from 'react-dom/client'
import React from 'react'
import { App } from './App'
import { FullLaunchContainer } from '@fangcha/auth-react/router'
import { LaunchContainer } from '@fangcha/auth-react'

const app = ReactDOM.createRoot(document.getElementById('app')!)
app.render(
  <React.StrictMode>
    <LaunchContainer allowAnonymous={true}>
      <App />
    </LaunchContainer>
  </React.StrictMode>
)
