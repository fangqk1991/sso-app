import { SpecFactory } from '@fangcha/router'
import { FeishuSdkApis } from '@fangcha/account-models'
import { FeishuServer } from '@fangcha/account'

const factory = new SpecFactory('Feishu Department')

factory.prepare(FeishuSdkApis.FullDepartmentDataGet, async (ctx) => {
  const feishuServer = ctx.feishuServer as FeishuServer
  ctx.body = await feishuServer.getFullStructureInfo()
})

factory.prepare(FeishuSdkApis.MembersSearch, async (ctx) => {
  const feishuServer = ctx.feishuServer as FeishuServer
  ctx.body = await feishuServer.getMembersInfo(ctx.request.body)
})

export const DepartmentSpecs = factory.buildSpecs()
