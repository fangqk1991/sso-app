import ReactDOM from 'react-dom/client'
import React from 'react'
import { App } from './App'
import './assets/main.scss'
import 'antd/dist/reset.css'

const app = ReactDOM.createRoot(document.getElementById('app')!)
app.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
