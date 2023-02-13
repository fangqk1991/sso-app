import React, { useContext } from 'react'
import { SessionContext } from '../services/SessionContext'
import { AccountSimpleParams } from '@fangcha/account-models'
import { LoginApis } from '@fangcha/sso-models'
import { AxiosBuilder } from '@fangcha/app-request'
import { Input } from '../components/Input'

export const LoginForm = () => {
  const session = useContext(SessionContext)
  return (
    <div className='fc-sso-form'>
      <div className='logo mb-4' style={{ background: session.config.logoCss }} />
      <div className='h3 mb-3 font-weight-normal'>请登录</div>
      <div className='input-group input-first'>
        <input type='text' className='form-control' placeholder='邮箱' required autoFocus />
      </div>
      <div className='input-group input-last'>
        <Input type='password' className='form-control' placeholder='密码' required onEnter={() => {
          console.info('!!!')
        }} />
      </div>
      <button
        className='btn btn-lg btn-primary'
        style={{ width: '100%' }}
        onClick={() => {
          //
          ;async (params: AccountSimpleParams) => {
            const request = new AxiosBuilder()
            request.setApiOptions(LoginApis.LoginWithEmail)
            request.setBodyData(params)
            await request.quickSend()
          }
        }}
      >
        登录
      </button>
      <p className='extras'>
        {/*<router-link :to="{ path: '/signup', query: $route.query }"> >> 没有账号，点击注册</router-link>*/}
        <span> {'>>'} 没有账号，点击注册</span>
      </p>
    </div>
  )
}
