import React, { useEffect, useState } from 'react'
import { AuthSdkHelper, MyRequest, useSession, useUserInfo } from '../../src'
import { Button, message, List, Typography } from 'antd'
import { JointLoginApis, ProfileApis } from '@fangcha/sso-models'
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
    <div>
      <div style={{ padding: '15px' }}>
        <List style={{ margin: '40px auto', maxWidth: '500px' }} header={<b>账号信息</b>} bordered>
          <List.Item style={{ display: 'flex' }}>
            <b>昵称</b> <span>{profile.nickName}</span>
          </List.Item>
          <List.Item style={{ display: 'flex' }}>
            <b>邮箱</b>
            {emptyEmail ? (
              <a
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
              </a>
            ) : (
              <span>{profile.email}</span>
            )}
          </List.Item>
          <List.Item style={{ display: 'flex' }}>
            <b>Google</b> <span>未绑定</span>
          </List.Item>
          <List.Item style={{ display: 'flex' }}>
            <b>微信</b> <span>未绑定</span>
          </List.Item>
          <List.Item style={{ display: 'flex' }}>
            <b>飞书</b> <span>未绑定</span>
          </List.Item>
        </List>
      </div>
      <div className='fc-sso-form'>
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
    </div>
  )
}
