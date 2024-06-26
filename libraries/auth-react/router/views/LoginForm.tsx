import React, { useMemo } from 'react'
import { AuthSdkHelper, useSession, useSessionConfig } from '../../src'
import { AccountSimpleParams } from '@fangcha/account-models'
import { Button, Divider, Form, Input, message, Space } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Link, useLocation } from 'react-router-dom'
import { JointLoginApis } from '@fangcha/sso-models'
const IconGoogle = require('../assets/icon-google.svg').default
const IconFeishu = require('../assets/icon-feishu.png').default
const IconWechat = require('../assets/icon-wechat.svg').default

export const LoginForm = () => {
  const sessionCtx = useSession()
  const config = useSessionConfig()
  const { search } = useLocation()

  const inWechat = useMemo(() => navigator.userAgent.indexOf('MicroMessenger') !== -1, [])

  const onSubmit = async (params: AccountSimpleParams) => {
    await AuthSdkHelper.submitLogin(params)
    message.success('登录成功')

    sessionCtx.reloadSession()
  }

  return (
    <div className='fc-sso-form'>
      <div className='logo mb-4' style={{ background: config.logoCss }} />
      <div className='h3 mb-3 font-weight-normal'>请登录</div>
      {config.useEmailLogin && (
        <Form onFinish={onSubmit}>
          <Form.Item name='email' rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input
              prefix={<UserOutlined className='site-form-item-icon' />}
              placeholder='Username'
              autoComplete='username'
            />
          </Form.Item>
          <Form.Item name='password' rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input
              prefix={<LockOutlined className='site-form-item-icon' />}
              type='password'
              placeholder='Password'
              autoComplete='current-password'
            />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' style={{ width: '100%' }}>
              登录
            </Button>
          </Form.Item>
        </Form>
      )}
      {(config.useGoogleLogin || config.useFeishuLogin || config.useWechatLogin || config.useWechatMPLogin) && (
        <>
          <Divider />
          <Space
            styles={{
              item: {
                marginLeft: '4px',
                marginRight: '4px',
                // height: '40px',
              },
            }}
          >
            {config.useGoogleLogin && (
              <a href={JointLoginApis.GoogleLogin.route}>
                <img height={40} src={IconGoogle} alt={'Google Login'} />
              </a>
            )}
            {inWechat && config.useWechatMPLogin && (
              <a href={JointLoginApis.WechatMPLogin.route}>
                {/*https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html*/}
                <img height={40} src={IconWechat} alt={'Wechat Login'} />
              </a>
            )}
            {!inWechat && config.useWechatLogin && (
              <a href={JointLoginApis.WechatLogin.route}>
                {/*https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html*/}
                <img height={40} src={IconWechat} alt={'Wechat Login'} />
              </a>
            )}
            {config.useFeishuLogin && (
              <a
                onClick={() => {
                  window.location.href = JointLoginApis.FeishuLogin.route
                }}
              >
                <img height={40} src={IconFeishu} alt={'Feishu Login'} />
              </a>
            )}
          </Space>
        </>
      )}
      {config.signupAble && (
        <>
          <Divider />
          <p className='extras'>
            <Link to={{ pathname: '/signup', search: search }}> {'>>'} 没有账号，点击注册</Link>
          </p>
        </>
      )}
    </div>
  )
}
