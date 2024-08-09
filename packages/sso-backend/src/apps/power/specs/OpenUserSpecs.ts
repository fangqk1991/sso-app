import { SpecFactory } from '@fangcha/router'
import { OpenUserApis } from '@web/sso-common/power-api'
import { MyWeixinServer } from '../../../services/MyWeixinServer'
import assert from '@fangcha/assert'
import { MyAccountServer } from '../../../services/MyAccountServer'
import { CarrierType } from '@fangcha/account-models'

const factory = new SpecFactory('用户相关')

factory.prepare(OpenUserApis.WechatSubscriptionCheck, async (ctx) => {
  const accountUid = ctx.params.accountUid

  const account = await MyAccountServer.findAccount(accountUid)
  assert.ok(!!account, `账号不存在`)

  const carrier = await account.findCarrier(CarrierType.Wechat)
  assert.ok(!!carrier, `未绑定微信`)

  const unionId = carrier.carrierUid
  const wxUser = (await MyWeixinServer.WeixinUser.findWithUid(unionId))!
  assert.ok(!!wxUser && !!wxUser.officialOpenid, '未关注服务号')

  ctx.status = 200
})

export const OpenUserSpecs = factory.buildSpecs()
