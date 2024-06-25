import { MyDatabase } from './MyDatabase'
import { MyTableManager } from './MyTableManager'
import { WeixinServer } from '@fangcha/weixin-sdk'

export const MyWeixinServer = new WeixinServer({
  database: MyDatabase.ssoDB,
  tableName_WeixinUser: MyTableManager.tableName_WeixinUser(),
  tableName_WeixinOpenid: MyTableManager.tableName_WeixinOpenid(),
})
