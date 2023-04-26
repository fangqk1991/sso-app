import { SpecFactory } from '@fangcha/router'
import { JointLoginApis } from '@web/sso-common/web-api'
import { _SessionApp } from '@fangcha/session'
import { SsoConfig } from '../../../SsoConfig'

const factory = new SpecFactory('Feishu Login', { skipAuth: true })

factory.prepare(JointLoginApis.FeishuLogin, async (ctx) => {
  const redirectUri = `${_SessionApp.getBaseURL('')}${JointLoginApis.FeishuCallback.route}`
  ctx.redirect(
    `https://open.feishu.cn/open-apis/authen/v1/index?redirect_uri=${encodeURIComponent(redirectUri)}&app_id=${
      SsoConfig.FeishuSDK.appid
    }&state=STATE`
  )
})

factory.prepare(JointLoginApis.FeishuCallback, async (ctx) => {
  // const { code, state: ticket } = ctx.request.query

  ctx.redirect(_SessionApp.getBaseURL(''))
})

export const FeishuLoginSpecs = factory.buildSpecs()
