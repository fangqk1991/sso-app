import React, { useContext, useEffect, useState } from 'react'
import { AuthSdkHelper, MyRequest, SessionContext } from '../../src'
import { Button, message } from 'antd'
import { ProfileApis } from '@fangcha/sso-models'
import { sleep } from '@fangcha/tools'
import { AccountProfile } from '@fangcha/account-models'
import { FlexibleFormDialog, LoadingView } from '@fangcha/react'
import { ProFormText } from '@ant-design/pro-components'

export const ProfileView = () => {
  const { session } = useContext(SessionContext)
  const userInfo = session.userInfo!

  const [profile, setProfile] = useState<AccountProfile>()

  useEffect(() => {
    const request = MyRequest(ProfileApis.ProfileInfoGet)
    request.quickSend().then((response) => setProfile(response))
  }, [session.userInfo])

  if (!profile) {
    return <LoadingView />
  }
  const emptyPassword = profile.emptyPassword

  return (
    <div className='fc-sso-form'>
      <div className='mb-4'>Email: {profile.email}</div>

      <Button
        style={{ width: '100%', marginBottom: '16px' }}
        onClick={() => {
          const dialog = new FlexibleFormDialog({
            title: '设置密码',
            formBody: (
              <>
                {!emptyPassword && <ProFormText.Password name='curPassword' label='当前密码' />}
                <ProFormText.Password name='newPassword' label='新密码' />
              </>
            ),
          })
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
        {emptyPassword ? '设置密码' : '修改密码'}
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
