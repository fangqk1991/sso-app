import { SpecFactory } from '@fangcha/router'
import { OpenNotificationApis } from '@web/sso-common/power-api'
import { MyMpWechatProxy } from '../../../services/MyMpWechatProxy'
import { MyWeixinServer } from '../../../services/MyWeixinServer'
import assert from '@fangcha/assert'
import { MyAccountServer } from '../../../services/MyAccountServer'
import { CarrierType } from '@fangcha/account-models'
import { NotificationBatchNotifyParams, NotificationParams } from '@web/sso-common/user-models'

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

factory.prepare(OpenNotificationApis.WechatTemplateMessagesNotifyBatch, async (ctx) => {
  const options = ctx.request.body as NotificationBatchNotifyParams
  const accountUidList = options.accountUidList || []
  assert.ok(!!accountUidList, 'Weixin openId missing.')

  const searcher = new MyAccountServer.AccountCarrier().fc_searcher()
  searcher.processor().addConditionKV('carrier_type', CarrierType.Wechat)
  searcher.processor().addConditionKeyInArray('account_uid', accountUidList)
  const carrierList = await searcher.queryFeeds()

  const searcher2 = new MyWeixinServer.WeixinUser().fc_searcher()
  searcher2.processor().addConditionKeyInArray(
    'union_id',
    carrierList.map((item) => item.carrierUid)
  )
  const wxUserList = await searcher2.queryFeeds()

  for (const wxUser of wxUserList.filter((item) => !!item.officialOpenid)) {
    await MyMpWechatProxy.sendTemplateMessage({
      touser: wxUser.officialOpenid!,
      template_id: options.templateId,
      data: options.params,
      url: options.url,
    })
  }
  ctx.status = 200
})

export const OpenNotificationSpecs = factory.buildSpecs()
