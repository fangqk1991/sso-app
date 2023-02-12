import styled from '@emotion/styled'
import React, { useContext, useEffect } from 'react'
import { ThemeContext } from '../services/ThemeContext'
import { LoginForm } from './LoginForm'

const Main = styled.main(`
  width: 100vw;
  height: 100vh;
`)

const PromotionDiv = styled.div(`
  text-align: right;
  padding-top: 12px;
  padding-right: 12px;

  a {
    text-decoration: unset;
    &:hover {
      text-decoration: none;
    }
  }
`)

export const MainLayout: React.FC = () => {
  const theme = useContext(ThemeContext)
  useEffect(() => {
    // const request = MyAxios(RetainedSessionApis.SessionInfoGet)
    // request.setMute(true)
    // try {
    //   const response = await request.quickSend<SessionInfo<T>>()
    //   this.codeVersion = response.codeVersion || ''
    //   this.curUser = response.userInfo
    //   Object.assign(this.config, response.config)
    //   return response
    // } catch (err) {
    //   console.error(err)
    // }
    // return null
  }, [theme])
  return (
    <Main style={{ background: theme.background }}>
      <PromotionDiv className='fc-app-promotion'>
        {`${theme.appName}. `}
        {!theme.hidePromotion && (
          <>
            <span>Powered by </span>
            <a target='_blank' href='https://github.com/fangqk1991/sso-app'>
              fangqk1991/sso-app
            </a>
          </>
        )}
      </PromotionDiv>
      <LoginForm />
    </Main>
  )
}
