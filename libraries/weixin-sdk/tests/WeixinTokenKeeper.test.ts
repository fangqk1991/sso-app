import { CustomRequestFollower } from '@fangcha/backend-kit'
import { GlobalAppConfig } from 'fc-config'
import { WeixinTokenKeeper } from '../src/official-mp/WeixinTokenKeeper'

const weixinTokenKeeper = new WeixinTokenKeeper(GlobalAppConfig.FangchaAuth.JointLogin.WechatMP, CustomRequestFollower)

describe('Test WeixinTokenKeeper.test.ts', () => {
  it(`refreshAccessToken`, async () => {
    const accessToken = await weixinTokenKeeper.refreshAccessToken()
    console.info(accessToken)
  })
})
