import React, { useContext, useState } from 'react'
import { SessionConfig, SessionContext } from '../services/SessionContext'
import { AccountSimpleParams } from '@fangcha/account-models'
import { LoginApis } from '@fangcha/sso-models'
import { AxiosBuilder } from '@fangcha/app-request'
import { Input } from '../components/Input'
import { RetainedSessionApis } from '@fangcha/backend-kit/lib/common/apis'
import { SessionInfo } from '@fangcha/backend-kit/lib/common/models'

export const LoginForm = () => {
  const { session, setSession } = useContext(SessionContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const onSubmit = async () => {
    const params: AccountSimpleParams = {
      email: email,
      password: password,
    }
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
      <div className='input-group input-first'>
        <input
          type='text'
          className='form-control'
          placeholder='邮箱'
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className='input-group input-last'>
        <Input
          type='password'
          className='form-control'
          placeholder='密码'
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onEnter={onSubmit}
        />
      </div>
      <button className='btn btn-lg btn-primary' style={{ width: '100%' }} onClick={onSubmit}>
        登录
      </button>
      <p className='extras'>
        {/*<router-link :to="{ path: '/signup', query: $route.query }"> >> 没有账号，点击注册</router-link>*/}
        <span> {'>>'} 没有账号，点击注册</span>
      </p>
    </div>
  )
}
