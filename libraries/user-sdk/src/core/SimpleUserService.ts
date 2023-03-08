import assert from '@fangcha/assert'
import { UserAppChecker } from './UserAppChecker'
import { UserProxy } from './UserProxy'

export class SimpleUserService<T extends UserAppChecker = UserAppChecker> {
  protected _userProxy!: UserProxy

  public onDataChanged?: () => Promise<void>

  public constructor() {}

  protected _checker = new UserAppChecker()
  public checker() {
    return this._checker as T
  }
  public setChecker(checker: T) {
    this._checker = checker
  }

  public getPowerUserList() {
    return this.appInfo().powerUserList
  }

  public setUserProxy(userProxy: UserProxy) {
    this._userProxy = userProxy
    return this
  }

  public getUserProxy() {
    assert.ok(!!this._userProxy, 'userProxy is null', 500)
    return this._userProxy
  }

  public assertValid() {
    assert.ok(!!this.appInfo(), '_appInfo is null', 500)
  }

  public async checkIfNeedToUpgrade() {
    const latestVersion = await this.getUserProxy().getAppVersion()
    const appInfo = this.appInfo()
    return !appInfo || appInfo.version !== latestVersion
  }

  protected async getAppFullInfo() {
    return this.getUserProxy().getAppFullInfo()
  }

  public async reloadAppInfo() {
    const appInfo = await this.getAppFullInfo()
    this._checker.setAppInfo(appInfo)
    if (this.onDataChanged) {
      await this.onDataChanged()
    }
  }

  public appInfo() {
    return this._checker.appInfo()
  }

  public configData<T = {}>() {
    return this.appInfo().configData as T
  }
}
