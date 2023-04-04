import { MyFeishuSync } from '../src/services/MyFeishuSync'

describe('Test MyFeishuSync.test.ts', () => {
  it(`fetchRemoteDepartmentsAndUsers`, async () => {
    await MyFeishuSync.fetchRemoteDepartmentsAndUsers()
  })

  it(`syncRemoteDepartmentsAndUsers`, async () => {
    await MyFeishuSync.syncRemoteDepartmentsAndUsers()
  })
})
