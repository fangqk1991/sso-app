import { __App } from '../auto-build/__App'
import { FilterOptions } from 'fc-feed'
import { Transaction } from 'sequelize'
import assert from '@fangcha/assert'
import {
  AppExportInfo,
  AppType,
  AppTypeDescriptor,
  P_AppInfo,
  P_AppParams,
  PermissionHelper,
  PermissionMeta,
} from '@fangcha/account-models'
import { ApiVisitorV2 } from '@fangcha/tools'
import { _AppAccess } from './_AppAccess'
import { _Group } from './_Group'

export class _App extends __App {
  public static AppAccess: { new (): _AppAccess } & typeof _AppAccess
  public static Group: { new (): _Group } & typeof _Group

  appType!: AppType

  public getClass() {
    return this.constructor as typeof _App
  }

  public constructor() {
    super()
  }

  public fc_searcher(params: FilterOptions = {}) {
    const searcher = super.fc_searcher(params)
    if (params['lockedUser']) {
      searcher.processor().addSpecialCondition('FIND_IN_SET(?, power_users)', params['lockedUser'])
    }
    if (params['keywords']) {
      searcher.processor().addSpecialCondition('appid LIKE ?', `%${params['keywords']}%`)
    }
    return searcher
  }

  public static checkValidParams(params: P_AppParams, onlyCheckDefinedKeys = false) {
    assert.ok(/^[a-z][a-z0-9_-]{1,31}$/.test(params.appid), 'appid 需满足规则 /^[a-z][a-z0-9_-]{1,31}$/')
    if (!onlyCheckDefinedKeys || params.permissionMeta) {
      PermissionHelper.checkPermissionMeta(params.permissionMeta)
    }
    if (!onlyCheckDefinedKeys || params.appType) {
      assert.ok(AppTypeDescriptor.checkValueValid(params.appType), 'appType 有误')
    }

    params.appType
  }

  public modelForClient(): P_AppInfo {
    return {
      appid: this.appid,
      appType: this.appType,
      name: this.name,
      remarks: this.remarks,
      author: this.author,
      configData: this.configData(),
      permissionMeta: this.permissionMeta(),
      powerUserList: this.powerUserList(),
      createTime: this.createTime,
      updateTime: this.updateTime,
      version: this.version,
    }
  }

  public toJSON() {
    return this.modelForClient()
  }

  public permissionMeta(): PermissionMeta {
    try {
      return JSON.parse(this.permissionInfo) || PermissionHelper.defaultPermissionMeta()
    } catch (e) {}
    return PermissionHelper.defaultPermissionMeta()
  }

  public configData(): {} {
    try {
      return JSON.parse(this.configInfo) || {}
    } catch (e) {}
    return {}
  }

  public powerUserList() {
    return (this.powerUsers || '')
      .split(',')
      .map((item) => item.trim())
      .filter((item) => !!item)
  }

  public async getAccessList() {
    const AppAccess = this.getClass().AppAccess
    const searcher = new AppAccess().fc_searcher()
    searcher.processor().addConditionKV('appid', this.appid)
    return searcher.queryAllFeeds()
  }

  public static async prepareVisitorsForOpen(): Promise<ApiVisitorV2[]> {
    const AppAccess = this.AppAccess
    const searcher = new this().fc_searcher()
    searcher.processor().setColumns(['appid', 'name'])
    const appList = await searcher.queryAllFeeds()
    const searcher2 = new AppAccess().fc_searcher()
    searcher2.processor().setColumns(['appid', 'app_secret'])
    const accessList = await searcher2.queryAllFeeds()
    const secretsData: { [appid: string]: string[] } = {}
    for (const accessItem of accessList) {
      if (!secretsData[accessItem.appid]) {
        secretsData[accessItem.appid] = []
      }
      secretsData[accessItem.appid].push(accessItem.appSecret)
    }
    return appList.map((app) => {
      return {
        appid: app.appid,
        name: app.name,
        secrets: secretsData[app.appid] || [],
        isEnabled: true,
        secureMode: false,
        bindAddress: '',
      }
    })
  }

  public async getGroupList() {
    const Group = this.getClass().Group
    const searcher = new Group().fc_searcher()
    searcher.processor().addConditionKV('appid', this.appid)
    return searcher.queryAllFeeds()
  }

  public async getEnabledGroupList() {
    const Group = this.getClass().Group
    const searcher = new Group().fc_searcher()
    searcher.processor().addConditionKV('appid', this.appid)
    searcher.processor().addConditionKV('is_enabled', 1)
    return searcher.queryAllFeeds()
  }

  public async getExportInfo(): Promise<AppExportInfo> {
    const data = this.modelForClient() as AppExportInfo
    data.groupList = []
    const groups = await this.getGroupList()
    for (const group of groups) {
      data.groupList.push(await group.getGroupExportInfo())
    }
    return data
  }

  public async increaseVersion(transaction: Transaction) {
    this.fc_edit()
    ++this.version
    await this.updateToDB(transaction)
  }

  public async prepareGroup(groupId: string) {
    const group = await this.findGroup(groupId)
    assert.ok(!!group, `Group[${groupId}] 不存在`)
    return group!
  }

  public async findGroup(groupId: string, transaction?: Transaction) {
    const Group = this.getClass().Group
    {
      const feed = await Group.findOne(
        {
          appid: this.appid,
          group_alias: groupId,
        },
        transaction
      )
      if (feed) {
        return feed
      }
    }
    {
      const feed = await Group.findOne(
        {
          appid: this.appid,
          group_id: groupId,
        },
        transaction
      )
      if (feed) {
        return feed
      }
    }
  }
}
