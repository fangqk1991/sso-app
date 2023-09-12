import { SsoConfig } from '../SsoConfig'

export class TableManager {
  public prefix = ''

  public constructor(prefix: string) {
    this.prefix = prefix ? `${prefix}_` : ''
  }

  public tableName_Account() {
    return this.prefix + 'fc_account'
  }

  public tableName_AccountCarrier() {
    return this.prefix + 'fc_account_carrier'
  }

  public tableName_AccountCarrierExtras() {
    return this.prefix + 'fc_account_carrier_extras'
  }

  public tableName_SsoClient() {
    return this.prefix + 'fc_sso_client'
  }

  public tableName_UserAuth() {
    return this.prefix + 'fc_user_auth'
  }

  public tableName_App() {
    return this.prefix + 'fc_app'
  }

  public tableName_AppAccess() {
    return this.prefix + 'fc_app_access'
  }

  public tableName_Group() {
    return this.prefix + 'fc_group'
  }

  public tableName_GroupAccess() {
    return this.prefix + 'fc_group_access'
  }

  public tableName_GroupMember() {
    return this.prefix + 'fc_group_member'
  }

  public tableName_GroupPermission() {
    return this.prefix + 'fc_group_permission'
  }

  public tableName_FeishuDepartment() {
    return this.prefix + 'fc_feishu_department'
  }

  public tableName_FeishuDepartmentMember() {
    return this.prefix + 'fc_feishu_department_member'
  }

  public tableName_FeishuUser() {
    return this.prefix + 'fc_feishu_user'
  }

  public tableName_FeishuUserGroup() {
    return this.prefix + 'fc_feishu_user_group'
  }
}

export const MyTableManager = new TableManager(SsoConfig.sqlTablePrefix)
