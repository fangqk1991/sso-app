import { __GroupMember } from '../auto-build/__GroupMember'
import { P_MemberInfo } from '@web/auth-common/models'
import { Transaction } from 'sequelize'

export class _GroupMember extends __GroupMember {
  public constructor() {
    super()
  }

  public async updateLevel(isAdmin: number, transaction?: Transaction) {
    this.fc_edit()
    this.isAdmin = isAdmin
    await this.updateToDB(transaction)
  }

  public modelForClient(): P_MemberInfo {
    return {
      groupId: this.groupId,
      member: this.member,
      isAdmin: this.isAdmin,
      createTime: this.createTime,
      updateTime: this.updateTime,
    }
  }
}
