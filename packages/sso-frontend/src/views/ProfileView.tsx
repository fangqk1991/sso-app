import React, { useContext } from 'react'
import { SessionContext } from '../services/SessionContext'

export const ProfileView = () => {
  const { session } = useContext(SessionContext)
  const userInfo = session.userInfo!
  return (
    <div className='fc-sso-form'>
      {userInfo && <div className='mb-4'>Email: {userInfo.email}</div>}
      {/*<button class="btn btn-danger" style="width: 100%;" @click="onLogout">登出</button>*/}
    </div>
  )
}
