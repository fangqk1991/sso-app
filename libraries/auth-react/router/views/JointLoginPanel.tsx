import React, { useMemo } from 'react'
import { useSessionConfig } from '../../src'
import { Divider, Space } from 'antd'
import { JointLoginApis } from '@fangcha/sso-models'
const IconGoogle = require('../assets/icon-google.svg').default
const IconFeishu = require('../assets/icon-feishu.png').default
const IconWechat = require('../assets/icon-wechat.svg').default

export const JointLoginPanel = () => {
  const config = useSessionConfig()

  const inWechat = useMemo(() => navigator.userAgent.indexOf('MicroMessenger') !== -1, [])

  if (!config.useGoogleLogin && !config.useFeishuLogin && !config.useWechatLogin && !config.useWechatMPLogin) {
    return <></>
  }

  return (
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
  )
}
