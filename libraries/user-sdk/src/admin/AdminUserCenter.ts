import { LoopPerformer } from '@fangcha/tools'
import { _FangchaState, LoopPerformerHelper } from '@fangcha/backend-kit'
import { AdminAppChecker } from './AdminAppChecker'
import { SimpleUserService } from '../core/SimpleUserService'

export class _AdminUserCenter extends SimpleUserService<AdminAppChecker> {
  protected _checker = new AdminAppChecker()

  public getUserProxy() {
    return this._userProxy
  }

  private _loopPerformer!: LoopPerformer
  public autoReloadAppInfo() {
    if (!this._loopPerformer) {
      this._loopPerformer = LoopPerformerHelper.makeLoopPerformer(10 * 1000)
      this._loopPerformer.execute(async () => {
        if (await this.checkIfNeedToUpgrade()) {
          const appInfo = this.appInfo()
          _FangchaState.botProxy.notify(`${appInfo.name}[${appInfo.appid}] 检查到新的配置版本，正在更新`)
          await this.reloadAppInfo()
        }
      })
    }
  }
}

export const AdminUserCenter = new _AdminUserCenter()
