import React, { useContext } from 'react'
import { SessionContext } from '../services/SessionContext'
import { AccountSimpleParams } from '@fangcha/account-models'
import { LoginApis } from '@fangcha/sso-models'
import { AxiosBuilder } from '@fangcha/app-request'
// import { Input } from '../components/Input'
import { Button, Form, Input } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'

export const LoginForm = () => {
  const sessionCtx = useContext(SessionContext)
  const onSubmit = async (params: AccountSimpleParams) => {
    const request = new AxiosBuilder()
    request.setApiOptions(LoginApis.LoginWithEmail)
    request.setBodyData(params)
    await request.quickSend()

    sessionCtx.reloadSession()
  }

  return (
    <div className='fc-sso-form'>
      <div className='logo mb-4' style={{ background: sessionCtx.session.config.logoCss }} />
      <div className='h3 mb-3 font-weight-normal'>请登录</div>
      <Form onFinish={onSubmit}>
        <Form.Item name='email' rules={[{ required: true, message: 'Please input your email!' }]}>
          <Input prefix={<UserOutlined className='site-form-item-icon' />} placeholder='Username' autoComplete='username'/>
        </Form.Item>
        <Form.Item name='password' rules={[{ required: true, message: 'Please input your Password!' }]}>
          <Input
            prefix={<LockOutlined className='site-form-item-icon' />}
            type='password'
            placeholder='Password'
            autoComplete='current-password'
          />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' style={{ width: '100%' }}>
            Log in
          </Button>
        </Form.Item>
      </Form>
      <p className='extras'>
        {/*<router-link :to="{ path: '/signup', query: $route.query }"> >> 没有账号，点击注册</router-link>*/}
        <span> {'>>'} 没有账号，点击注册</span>
      </p>
    </div>
  )
}
