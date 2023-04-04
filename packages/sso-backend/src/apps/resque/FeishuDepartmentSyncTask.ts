import { IResqueTask } from '@fangcha/resque'
import { MyFeishuSync } from '../../services/MyFeishuSync'

export class FeishuDepartmentSyncTask implements IResqueTask {
  public async perform() {
    await MyFeishuSync.syncRemoteDepartmentsAndUsers()
  }
}
