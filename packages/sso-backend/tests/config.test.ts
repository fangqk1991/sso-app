process.env.NODE_ENV = 'production'
process.env.adminBaseURL = 'https://sso.example.com'

import { SsoConfig } from '../src/SsoConfig'

describe('Test config.test.ts', () => {
  it(`config merge`, async () => {
    console.info(SsoConfig)
  })
})
