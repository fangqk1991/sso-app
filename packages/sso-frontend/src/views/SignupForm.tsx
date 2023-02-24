import React, { useContext } from 'react'
import { SessionContext } from '../services/SessionContext'
import { AccountSimpleParams } from '@fangcha/account-models'
import { SignupApis } from '@fangcha/sso-models'
import { AxiosBuilder } from '@fangcha/app-request'
import { Button, Form, Input, message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

export const SignupForm = () => {
  const sessionCtx = useContext(SessionContext)
  const [messageApi, contextHolder] = message.useMessage()

  const onSubmit = async (params: AccountSimpleParams) => {
    const request = new AxiosBuilder()
    request.setApiOptions(SignupApis.SimpleSignup)
    request.setBodyData(params)
    await request.quickSend()

    messageApi.info('注册成功')

    sessionCtx.reloadSession()
  }

  return (
    <div className='fc-sso-form'>
      {contextHolder}
      <div className='logo mb-4' style={{ background: sessionCtx.session.config.logoCss }} />
      <div className='h3 mb-3 font-weight-normal'>注册账号</div>
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
            autoComplete='new-password'
          />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' style={{ width: '100%' }}>
            注册
          </Button>
        </Form.Item>
      </Form>
      <p className='extras'>
        <Link to='/login'> {'>>'} 已有账号，点击登录</Link>
      </p>
    </div>
  )
}
