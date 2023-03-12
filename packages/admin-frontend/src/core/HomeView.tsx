import React, { useEffect, useState } from 'react'
import { MyRequest } from '@fangcha/auth-react'
import { Tag } from 'antd'
import { RetainedHealthApis } from '@fangcha/app-models'

export const HomeView: React.FC = () => {
  const [appInfo, setAppInfo] = useState({
    env: '',
    tags: [],
    codeVersion: '',
    runningMachine: '',
  })

  useEffect(() => {
    ;(async () => {
      setAppInfo(await MyRequest(RetainedHealthApis.SystemInfoGet).quickSend())
    })()
  }, [])

  return (
    <div>
      <h3>HomeView</h3>
      <ul className='mt-3'>
        <li>版本: {appInfo.codeVersion}</li>
        <li>环境: {appInfo.env}</li>
        <li>主机: {appInfo.runningMachine}</li>
        <li>
          {appInfo.tags.map((tag) => (
            <Tag color='green' key={tag}>
              {tag}
            </Tag>
          ))}
        </li>
      </ul>
    </div>
  )
}
