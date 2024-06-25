import { __FeishuUserGroup } from '../auto-build/__FeishuUserGroup'
import { FeishuUserGroupModel } from '@fangcha/account-models'

export class _FeishuUserGroup extends __FeishuUserGroup {
  public constructor() {
    super()
  }

  public membersData(): {
    unionIdList: string[]
    departmentIdList: string[]
  } {
    const defaultData = {
      unionIdList: [],
      departmentIdList: [],
    }
    try {
      return JSON.parse(this.membersInfo) || defaultData
    } catch (e) {}
    return defaultData
  }

  public toJSON() {
    return this.modelForClient()
  }

  public modelForClient() {
    const data = this.fc_pureModel() as FeishuUserGroupModel
    data.memberData = this.membersData()
    delete data['memberInfo']
    return data
  }
}
