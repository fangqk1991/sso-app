import { IResqueTask } from '@fangcha/resque'
import { MyMpWechatProxy } from '../../services/MyMpWechatProxy'
import { MyWeixinServer } from '../../services/MyWeixinServer'
import { SQLBulkAdder } from 'fc-sql'

export class WeixinMPSyncTask implements IResqueTask {
  public async perform() {
    const openIdList = await MyMpWechatProxy.getOpenIdList()
    const userList = await MyMpWechatProxy.getUserInfosBatch(openIdList)

    {
      const dbSpec = new MyWeixinServer.WeixinOpenid().dbSpec()
      const bulkAdder = new SQLBulkAdder(dbSpec.database)
      bulkAdder.setTable(dbSpec.table)
      bulkAdder.useUpdateWhenDuplicate()
      bulkAdder.setInsertKeys(['openid', 'union_id', 'appid'])
      for (const item of userList) {
        const feed = new MyWeixinServer.WeixinOpenid()
        feed.openid = item.openid
        feed.unionId = item.unionid
        feed.appid = MyMpWechatProxy.appid()
        bulkAdder.putObject(feed.fc_encode())
      }
      await bulkAdder.execute()
    }

    {
      const dbSpec = new MyWeixinServer.WeixinUser().dbSpec()
      const bulkAdder = new SQLBulkAdder(dbSpec.database)
      bulkAdder.setTable(dbSpec.table)
      bulkAdder.useUpdateWhenDuplicate()
      bulkAdder.setInsertKeys(['union_id', 'official_openid'])
      for (const item of userList) {
        const feed = new MyWeixinServer.WeixinUser()
        feed.officialOpenid = item.openid
        feed.unionId = item.unionid
        bulkAdder.putObject(feed.fc_encode())
      }
      await bulkAdder.execute()
    }
  }
}
