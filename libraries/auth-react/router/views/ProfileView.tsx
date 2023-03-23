import React, { useContext } from 'react'
import { AuthSdkHelper, MyRequest, SessionContext } from '../../src'
import { Button, message } from 'antd'
import { ProfileApis } from '@fangcha/sso-models'
import { PasswordFormDialog } from './PasswordFormDialog'
import { sleep } from '@fangcha/tools'

export const ProfileView = () => {
  const { session } = useContext(SessionContext)
  const userInfo = session.userInfo!
  return (
    <div className='fc-sso-form'>
      {userInfo && <div className='mb-4'>Email: {userInfo.email}</div>}

      <Button
        style={{ width: '100%', marginBottom: '16px' }}
        onClick={() => {
          const dialog = new PasswordFormDialog({})
          dialog.show(async (params) => {
            const request = MyRequest(ProfileApis.PasswordUpdate)
            request.setBodyData(params)
            await request.quickSend()
            message.success('密码修改成功')
            sleep(1000).then(() => {
              window.location.href = AuthSdkHelper.logoutUrl()
            })
          })
        }}
      >
        修改密码
      </Button>

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
