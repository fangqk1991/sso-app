process.env.NODE_ENV = 'production'
process.env.adminBaseURL = 'https://sso.example.com'

import { AuthConfig } from '../src/AuthConfig'

describe('Test config.test.ts', () => {
  it(`config merge`, async () => {
    console.info(AuthConfig)
  })
})
