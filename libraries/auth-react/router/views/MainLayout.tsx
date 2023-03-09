import styled from '@emotion/styled'
import React, { useContext } from 'react'
import { SessionContext } from '../../src'
import { Outlet } from 'react-router-dom'

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
  const { session } = useContext(SessionContext)
  return (
    <Main style={{ background: session.config.background }}>
      <PromotionDiv className='fc-app-promotion'>
        {`${session.config.appName}. `}
        {!session.config.hidePromotion && (
          <>
            <span>Powered by </span>
            <a target='_blank' href='https://github.com/fangqk1991/sso-app'>
              fangqk1991/sso-app
            </a>
          </>
        )}
      </PromotionDiv>
      <Outlet />
      {session.config.beianText && (
        <div
          className='fc-app-promotion'
          style={{
            position: 'fixed',
            bottom: '8px',
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          <a href='https://beian.miit.gov.cn/' target='_blank'>
            {session.config.beianText}
          </a>
        </div>
      )}
    </Main>
  )
}
