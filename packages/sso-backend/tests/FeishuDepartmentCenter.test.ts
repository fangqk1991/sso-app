import { FeishuDepartmentCenter } from '../src/services/FeishuDepartmentCenter'

describe('Test FeishuDepartmentCenter.test.ts', () => {
  it(`getFullDepartmentMembersData`, async () => {
    await FeishuDepartmentCenter.reloadData()
    const data = FeishuDepartmentCenter.getFullDepartmentMembersData()
    console.info(JSON.stringify(data, null, 2))
  })
})
