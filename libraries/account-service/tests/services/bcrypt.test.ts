import * as bcrypt from 'bcrypt'

describe('Test bcrypt.test.ts', () => {
  it(`genSaltSync`, async () => {
    const password = 'password'
    const salt = bcrypt.genSaltSync()
    const encryptedPassword = bcrypt.hashSync(password, salt)
    console.info('password', password)
    console.info('salt', salt)
    console.info('encryptedPassword', encryptedPassword)
    console.info(bcrypt.compareSync(password, encryptedPassword))
    console.info(bcrypt.compareSync(password + 'wrong', encryptedPassword))
  })
})
