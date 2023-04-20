import assert from '@fangcha/assert'
import { UserAppChecker } from './UserAppChecker'
import { UserServiceProtocol } from './UserServiceProtocol'
import { ChannelTask, LoopPerformer } from '@fangcha/tools'

export class SimpleUserService<T extends UserAppChecker = UserAppChecker> {
  protected _protocol!: UserServiceProtocol
  protected _refreshingTask: ChannelTask

  public onDataChanged?: () => Promise<void>

  public constructor() {
    this._refreshingTask = new ChannelTask(async () => {
      const appInfo = await this.getAppFullInfo()
      this._checker.setAppInfo(appInfo)
      if (this.onDataChanged) {
        await this.onDataChanged()
      }
    })
  }

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

  public setProtocol(protocol: UserServiceProtocol) {
    this._protocol = protocol
    return this
  }

  public getProtocol() {
    assert.ok(!!this._protocol, '_protocol is null', 500)
    return this._protocol
  }

  public assertValid() {
    assert.ok(!!this.appInfo(), '_appInfo is null', 500)
  }

  public async checkIfNeedToUpgrade() {
    const latestVersion = await this.getProtocol().getAppVersion()
    const appInfo = this.appInfo()
    return !appInfo || appInfo.version !== latestVersion
  }

  protected async getAppFullInfo() {
    return this.getProtocol().getAppFullInfo()
  }

  public async reloadAppInfo() {
    return this._refreshingTask.execute()
  }

  public appInfo() {
    return this._checker.appInfo()
  }

  public configData<T = {}>() {
    return this.appInfo().configData as T
  }

  private _loopPerformer!: LoopPerformer
  public autoReloadAppInfo() {
    if (!this._loopPerformer) {
      this._loopPerformer = new LoopPerformer({
        period: 10 * 1000,
        errorHandler: (e) => {
          console.error(e)
        },
      })
      this._loopPerformer.execute(async () => {
        const latestVersion = await this.getProtocol().getAppVersion()
        const appInfo = this.appInfo()
        if (!appInfo) {
          await this.reloadAppInfo()
          return
        }
        if (appInfo.version === latestVersion) {
          return
        }
        const infoMsg = `${appInfo.name}[${appInfo.appid}] 检查到新的配置版本 (${appInfo.version} -> ${latestVersion})，正在更新`
        console.info(infoMsg)
        await this.reloadAppInfo()
      })
    }
  }

  public useAutoReloadingChecker(protocol: UserServiceProtocol) {
    this.setProtocol(protocol)
    this.autoReloadAppInfo()
    return this._checker as T
  }

  public async waitForReady() {
    if (!this.appInfo()) {
      await this.reloadAppInfo()
    }
  }
}
