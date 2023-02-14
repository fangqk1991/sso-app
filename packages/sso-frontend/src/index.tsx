import ReactDOM from 'react-dom/client'
import React from 'react'
import { App } from './App'
import './assets/main.scss'
import 'antd/dist/reset.css';
import { ConfigProvider } from 'antd';

const app = ReactDOM.createRoot(document.getElementById('app')!)
app.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: 'rgb(221 115 164)',
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
)
