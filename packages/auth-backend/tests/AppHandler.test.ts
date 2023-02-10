import { MyPermissionServer } from '../src/services/MyPermissionServer'
import { AppType } from '@web/auth-common/models'

describe('Test AppHandler.test.ts', () => {
  it(`generateApp`, async () => {
    const app = await MyPermissionServer.generateApp({
      appid: 'demo-admin',
      name: 'Demo Admin',
      appType: AppType.Admin,
      remarks: '',
      configData: {},
      permissionMeta: {
        permissionKey: '*',
        name: 'ALL',
        description: '',
      },
      powerUserList: [],
    })
    console.info(app.modelForClient())
  })

  it(`generateApp user-system`, async () => {
    const app = await MyPermissionServer.generateApp({
      appid: 'user-system',
      name: 'User System',
      appType: AppType.Admin,
      remarks: '',
      configData: {},
      permissionMeta: {
        permissionKey: '*',
        name: 'ALL',
        description: '',
      },
      powerUserList: [],
      author: 'work@fangqk.com',
    })
    console.info(app.modelForClient())
  })
})
