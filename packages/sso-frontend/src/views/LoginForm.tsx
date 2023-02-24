import React, { useContext } from 'react'
import { SessionContext } from '../services/SessionContext'
import { AccountSimpleParams } from '@fangcha/account-models'
import { LoginApis } from '@fangcha/sso-models'
import { Button, Form, Input, message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Link, useLocation } from 'react-router-dom'
import { MyRequest } from '../services/HttpRequest'

export const LoginForm = () => {
  const sessionCtx = useContext(SessionContext)
  const { search } = useLocation()

  const onSubmit = async (params: AccountSimpleParams) => {
    const request = MyRequest(LoginApis.LoginWithEmail)
    request.setBodyData(params)
    await request.quickSend()

    message.success('登录成功')

    sessionCtx.reloadSession()
  }

  return (
    <div className='fc-sso-form'>
      <div className='logo mb-4' style={{ background: sessionCtx.session.config.logoCss }} />
      <div className='h3 mb-3 font-weight-normal'>请登录</div>
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
      <p className='extras'>
        <Link to={{ pathname: '/signup', search: search }}> {'>>'} 没有账号，点击注册</Link>
      </p>
    </div>
  )
}
