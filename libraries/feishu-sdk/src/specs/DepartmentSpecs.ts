import { SpecFactory } from '@fangcha/router'
import { FeishuSdkApis } from '@fangcha/account-models'
import { FeishuServer } from '@fangcha/account'

const factory = new SpecFactory('Feishu Department')

factory.prepare(FeishuSdkApis.FullDepartmentDataGet, async (ctx) => {
  const feishuServer = ctx.feishuServer as FeishuServer
  ctx.body = await feishuServer.getFullStructureInfo()
})

export const DepartmentSpecs = factory.buildSpecs()
