import { FCDatabase } from 'fc-sql'
import { FeedBase } from 'fc-feed'
import { FullAccountModel } from '../../common/models'

export class _FullAccount extends FeedBase {
  public accountUid!: string
  public password!: string
  public isEnabled!: number
  public nickName!: string
  public registerIp!: string
  public createTime!: string
  public updateTime!: string
  public email!: string
  public phone!: string

  protected static _database: FCDatabase
  protected static _table: string

  public static setOptions(database: FCDatabase, table: string) {
    this._database = database
    this._table = table
  }

  public constructor() {
    super()
    this.setDBProtocolV2({
      database: this.constructor['_database'],
      table: this.constructor['_table'],
      primaryKey: 'account.account_uid',
      cols: [
        'account.account_uid AS accountUid',
        'account.password AS password',
        'account.is_enabled AS isEnabled',
        'account.nick_name AS nickName',
        'account.register_ip AS registerIp',
        'account.create_time AS createTime',
        'account.update_time AS updateTime',
        'email_carrier.carrier_uid AS email',
        'phone_carrier.carrier_uid AS phone',
      ],
      insertableCols: [],
      modifiableCols: [],
      timestampTypeCols: [],
    })
  }

  public fc_propertyMapper() {
    return {
      accountUid: 'accountUid',
      password: 'password',
      isEnabled: 'isEnabled',
      nickName: 'nickName',
      registerIp: 'registerIp',
      createTime: 'createTime',
      updateTime: 'updateTime',
      email: 'email',
      phone: 'phone',
    }
  }

  public modelForClient() {
    const data = this.fc_pureModel() as FullAccountModel
    data.password = '***'
    return data
  }

  public toJSON() {
    return this.modelForClient()
  }
}
