import React, { useEffect, useMemo, useState } from 'react'
import { AuthSdkHelper, MyRequest, useSession, useSessionConfig, useUserInfo } from '../../src'
import { Button, List, message, Switch } from 'antd'
import { JointBindApis, ProfileApis } from '@fangcha/sso-models'
import { sleep } from '@fangcha/tools'
import { AccountProfile, CarrierType } from '@fangcha/account-models'
import { ConfirmDialog, FlexibleFormDialog, LoadingView, SimpleInputDialog } from '@fangcha/react'
import { ProFormText } from '@ant-design/pro-components'
import { CommonAPI } from '@fangcha/app-request'

export const ProfileView = () => {
  const sessionCtx = useSession()
  const userInfo = useUserInfo()
  const config = useSessionConfig()

  const [profile, setProfile] = useState<AccountProfile>()
  const inWechat = useMemo(() => navigator.userAgent.indexOf('MicroMessenger') !== -1, [])

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
        <List
          style={{ margin: '40px auto', maxWidth: '500px' }}
          header={
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <b>账号信息</b>{' '}
              <a
                onClick={() => {
                  const dialog = new FlexibleFormDialog({
                    title: '账号信息',
                    formBody: (
                      <>
                        <ProFormText name='nickName' label='昵称' />
                      </>
                    ),
                    placeholder: userInfo,
                  })
                  dialog.show(async (params) => {
                    const request = MyRequest(ProfileApis.ProfileInfoUpdate)
                    request.setBodyData(params)
                    await request.quickSend()
                    message.success('修改成功')
                    sessionCtx.reloadSession()
                  })
                }}
              >
                修改
              </a>
            </div>
          }
          bordered
        >
          <List.Item style={{ display: 'flex' }}>
            <span>昵称</span> <span>{profile.nickName}</span>
          </List.Item>
          <List.Item style={{ display: 'flex' }}>
            <span>邮箱</span>
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
          {config.useGoogleLogin && (
            <List.Item style={{ display: 'flex' }}>
              <span>Google</span>
              <Switch
                size={'small'}
                checked={!!profile.extras[CarrierType.Google]}
                onChange={async (checked) => {
                  if (checked) {
                    window.location.href = JointBindApis.GoogleLoginBindGoto.route
                  } else {
                    const dialog = new ConfirmDialog({
                      content: `确定要解除绑定吗？`,
                    })
                    dialog.show(async () => {
                      const request = MyRequest(new CommonAPI(JointBindApis.JointLoginUnlink, CarrierType.Google))
                      await request.quickSend()
                      message.success(`解绑成功`)
                      sessionCtx.reloadSession()
                    })
                  }
                }}
              />
            </List.Item>
          )}
          {((inWechat && config.useWechatMPLogin) || (!inWechat && config.useWechatLogin)) && (
            <List.Item style={{ display: 'flex' }}>
              <span>微信</span>
              <Switch
                size={'small'}
                checked={!!profile.extras[CarrierType.Wechat]}
                onChange={async (checked) => {
                  if (checked) {
                    window.location.href = `${JointBindApis.WechatLoginBindGoto.route}?formMP=${inWechat ? '1' : ''}`
                  } else {
                    const dialog = new ConfirmDialog({
                      content: `确定要解除绑定吗？`,
                    })
                    dialog.show(async () => {
                      const request = MyRequest(new CommonAPI(JointBindApis.JointLoginUnlink, CarrierType.Wechat))
                      await request.quickSend()
                      message.success(`解绑成功`)
                      sessionCtx.reloadSession()
                    })
                  }
                }}
              />
            </List.Item>
          )}
          {config.useFeishuLogin && (
            <List.Item style={{ display: 'flex' }}>
              <span>飞书</span>
              <Switch
                size={'small'}
                checked={!!profile.extras[CarrierType.Feishu]}
                onChange={async (checked) => {
                  if (checked) {
                    window.location.href = JointBindApis.FeishuLoginBindGoto.route
                  } else {
                    const dialog = new ConfirmDialog({
                      content: `确定要解除绑定吗？`,
                    })
                    dialog.show(async () => {
                      const request = MyRequest(new CommonAPI(JointBindApis.JointLoginUnlink, CarrierType.Feishu))
                      await request.quickSend()
                      message.success(`解绑成功`)
                      sessionCtx.reloadSession()
                    })
                  }
                }}
              />
            </List.Item>
          )}
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
