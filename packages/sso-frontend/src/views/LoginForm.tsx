import React, { useContext, useState } from 'react'
import { SessionConfig, SessionContext } from '../services/SessionContext'
import { AccountSimpleParams } from '@fangcha/account-models'
import { LoginApis } from '@fangcha/sso-models'
import { AxiosBuilder } from '@fangcha/app-request'
// import { Input } from '../components/Input'
import { RetainedSessionApis } from '@fangcha/backend-kit/lib/common/apis'
import { SessionInfo } from '@fangcha/backend-kit/lib/common/models'
import { Button, Checkbox, Form, Input } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'

export const LoginForm = () => {
  const { session, setSession } = useContext(SessionContext)
  const onSubmit = async (params: AccountSimpleParams) => {
    const request = new AxiosBuilder()
    request.setApiOptions(LoginApis.LoginWithEmail)
    request.setBodyData(params)
    await request.quickSend()
    {
      console.info('reload session')
      const request = new AxiosBuilder()
      request.setApiOptions(RetainedSessionApis.SessionInfoGet)
      request
        .quickSend<SessionInfo<SessionConfig>>()
        .then((response) => {
          setSession(response)
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }

  return (
    <div className='fc-sso-form'>
      <div className='logo mb-4' style={{ background: session.config.logoCss }} />
      <div className='h3 mb-3 font-weight-normal'>请登录</div>
      <Form onFinish={onSubmit}>
        <Form.Item name='email' rules={[{ required: true, message: 'Please input your email!' }]}>
          <Input prefix={<UserOutlined className='site-form-item-icon' />} placeholder='Username' />
        </Form.Item>
        <Form.Item name='password' rules={[{ required: true, message: 'Please input your Password!' }]}>
          <Input prefix={<LockOutlined className='site-form-item-icon' />} type='password' placeholder='Password' />
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
