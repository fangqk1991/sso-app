import { SpecFactory } from '@fangcha/router'
import { FeishuSdkApis } from '@fangcha/account-models'
import { FeishuServer } from '../services/FeishuServer'

const factory = new SpecFactory('Feishu Department')

factory.prepare(FeishuSdkApis.FullDepartmentTreeGet, async (ctx) => {
  const feishuServer = ctx.feishuServer as FeishuServer
  ctx.body = await feishuServer.getFullStructureInfo()
})

factory.prepare(FeishuSdkApis.FeishuStaffSearch, async (ctx) => {
  const feishuServer = ctx.feishuServer as FeishuServer
  ctx.body = await feishuServer.getMembersInfo(ctx.request.body)
})

export const DepartmentSpecs = factory.buildSpecs()
