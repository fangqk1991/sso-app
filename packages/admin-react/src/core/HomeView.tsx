import React, { useEffect, useState } from 'react'
import { MyRequest } from '@fangcha/auth-react'
import { RetainedHealthApis } from '@fangcha/backend-kit/lib/common/apis'
import { Tag } from 'antd'

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
      <ul className='mt-3'>
        <li>版本: {appInfo.codeVersion}</li>
        <li>环境: {appInfo.env}</li>
        <li>主机: {appInfo.runningMachine}</li>
        <li>
          {appInfo.tags.map((tag) => (
            <Tag color='green'>{tag}</Tag>
          ))}
        </li>
      </ul>
    </div>
  )
}
