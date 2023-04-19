import { OAuthClient } from '../src/OAuthClient'
import { GlobalAppConfig } from 'fc-config'

describe('Test OAuthClient.test.ts', () => {
  const client = new OAuthClient(GlobalAppConfig.test_oauthConfig)

  it(`getAccessTokenFromPassword`, async () => {
    const { email, password } = GlobalAppConfig.test_userInfo
    const tokenData = await client.getAccessTokenFromPassword(email, password)
    console.info(tokenData)
    const userInfo = await client.getUserInfo(tokenData.access_token)
    console.info(userInfo)
  })
})
