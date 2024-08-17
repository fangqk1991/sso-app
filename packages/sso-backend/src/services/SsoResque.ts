import { Resque, ResqueJob } from '@fangcha/resque'
import { SsoConfig } from '../SsoConfig'

Resque.setRedisBackend(SsoConfig.ssoResque)

export class SsoResque {
  public static redis() {
    return Resque.redis()
  }

  public static async enqueue_FeishuDepartmentSyncTask() {
    const resqueJob = ResqueJob.generate('FeishuQueue', 'FeishuDepartmentSyncTask')
    await resqueJob.addToQueue()
  }

  public static async enqueue_WeixinMPSyncTask() {
    const resqueJob = ResqueJob.generate('WeixinMPQueue', 'WeixinMPSyncTask')
    await resqueJob.addToQueue()
  }
}
