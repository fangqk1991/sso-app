import { IResqueTask } from '@fangcha/resque'
import { MyFeishuSync } from '../../services/MyFeishuSync'

export class FeishuDepartmentSyncTask implements IResqueTask {
  public async perform() {
    await MyFeishuSync.syncRemoteDepartmentsAndUsers()
    // _FangchaState.botProxy.notify(`飞书组织架构已同步`)
  }
}
