import { MyFeishuSync } from '../src/services/MyFeishuSync'
import { sleep } from '@fangcha/tools'

describe('Test MyFeishuSync.test.ts', () => {
  it(`fetchRemoteDepartmentsAndUsers`, async () => {
    await MyFeishuSync.fetchRemoteDepartmentsAndUsers()
  })

  it(`syncRemoteDepartmentsAndUsers`, async () => {
    await MyFeishuSync.syncRemoteDepartmentsAndUsers()
    await sleep(1000)
  })
})
