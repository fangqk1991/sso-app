import React, { useContext } from 'react'
import { SessionContext } from '../services/SessionContext'
import { Button } from 'antd'
import { AuthSdkHelper } from '../AuthSdkHelper'

export const ProfileView = () => {
  const { session } = useContext(SessionContext)
  const userInfo = session.userInfo!
  return (
    <div className='fc-sso-form'>
      {userInfo && <div className='mb-4'>Email: {userInfo.email}</div>}

      <Button
        type='primary'
        style={{ width: '100%' }}
        onClick={() => {
          window.location.href = AuthSdkHelper.logoutUrl()
        }}
      >
        登出
      </Button>
    </div>
  )
}
