import React, { useEffect, useState } from 'react'
import { AuthSdkHelper, MyRequest, useSession, useUserInfo } from '../../src'
import { Button, message } from 'antd'
import { ProfileApis } from '@fangcha/sso-models'
import { sleep } from '@fangcha/tools'
import { AccountProfile } from '@fangcha/account-models'
import { FlexibleFormDialog, LoadingView, SimpleInputDialog } from '@fangcha/react'
import { ProFormText } from '@ant-design/pro-components'

export const ProfileView = () => {
  const sessionCtx = useSession()
  const userInfo = useUserInfo()

  const [profile, setProfile] = useState<AccountProfile>()

  useEffect(() => {
    const request = MyRequest(ProfileApis.ProfileInfoGet)
    request.quickSend().then((response) => setProfile(response))
  }, [userInfo])

  if (!profile) {
    return <LoadingView />
  }
  const emptyPassword = profile.emptyPassword
  const emptyEmail = profile.emptyEmail

  return (
    <div className='fc-sso-form' style={{ marginTop: '40px' }}>
      <div className='mb-4'>{profile.nickName}</div>
      {emptyEmail ? (
        <Button
          type={'primary'}
          style={{ width: '100%', marginBottom: '16px' }}
          onClick={() => {
            const dialog = new SimpleInputDialog({
              title: '新的邮箱',
            })
            dialog.show(async (email) => {
              const request = MyRequest(ProfileApis.EmailUpdate)
              request.setBodyData({
                email: email,
              })
              await request.quickSend()
              message.success('邮箱设置成功')
              sessionCtx.reloadSession()
            })
          }}
        >
          设置邮箱
        </Button>
      ) : (
        <div className='mb-4'>{profile.email}</div>
      )}

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
        danger={true}
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
