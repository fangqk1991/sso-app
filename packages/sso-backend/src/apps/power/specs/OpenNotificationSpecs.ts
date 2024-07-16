import { SpecFactory } from '@fangcha/router'
import { OpenNotificationApis } from '@web/sso-common/power-api'
import { MyMpWechatProxy } from '../../../services/MyMpWechatProxy'
import { MyWeixinServer } from '../../../services/MyWeixinServer'
import assert from '@fangcha/assert'
import { MyAccountServer } from '../../../services/MyAccountServer'
import { CarrierType } from '@fangcha/account-models'
import { NotificationParams } from '@web/sso-common/user-models'

const factory = new SpecFactory('通知中心')

factory.prepare(OpenNotificationApis.WechatTemplateMessagesNotify, async (ctx) => {
  const options = ctx.request.body as NotificationParams
  let openId = options.openId!
  let unionId = options.unionId!
  let accountUid = options.accountUid!
  if (!openId) {
    if (!unionId) {
      assert.ok(!!accountUid, 'Weixin unionId missing.')

      const account = await MyAccountServer.findAccount(accountUid)
      assert.ok(!!account, `Account[${accountUid}] missing.`)

      const carrier = await account.findCarrier(CarrierType.Wechat)
      assert.ok(!!carrier, `Weixin account[${accountUid}] missing.`)
      unionId = carrier.carrierUid
    }
    assert.ok(!!unionId, 'Weixin unionId missing.')
    const wxUser = (await MyWeixinServer.WeixinUser.findWithUid(unionId))!
    assert.ok(!!wxUser, 'Weixin User missing.')
    openId = wxUser.officialOpenid!
  }
  assert.ok(!!openId, 'Weixin openId missing.')
  await MyMpWechatProxy.sendTemplateMessage({
    touser: openId,
    template_id: options.templateId,
    data: options.params,
    url: options.url,
  })
  ctx.status = 200
})

export const OpenNotificationSpecs = factory.buildSpecs()
