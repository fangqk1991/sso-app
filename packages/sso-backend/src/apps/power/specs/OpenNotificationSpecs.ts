import { SpecFactory } from '@fangcha/router'
import { OpenNotificationApis } from '@web/sso-common/power-api'

const factory = new SpecFactory('通知中心')

factory.prepare(OpenNotificationApis.WechatTemplateMessagesNotify, async (ctx) => {
  ctx.status = 200
})

export const OpenNotificationSpecs = factory.buildSpecs()
