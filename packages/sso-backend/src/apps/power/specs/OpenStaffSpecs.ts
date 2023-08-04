import { SpecFactory } from '@fangcha/router'
import assert from '@fangcha/assert'
import { OpenStaffApis } from '@web/sso-common/power-api'
import { MyFeishuServer } from '../../../services/MyFeishuServer'
import { FeishuUserModel } from '@fangcha/account-models'

const factory = new SpecFactory('Staffs')

factory.prepare(OpenStaffApis.SearchStaffsByEmployeeIds, async (ctx) => {
  const employeeIds = ctx.request.body

  assert.ok(Array.isArray(employeeIds), 'bodyData must be an array')
  const searcher = new MyFeishuServer.FeishuUser().fc_searcher()
  searcher.processor().addConditionKeyInArray('employee_id', employeeIds)
  const feeds = await searcher.queryAllFeeds()
  const staffData: { [employeeId: string]: FeishuUserModel } = {}
  feeds.forEach((feed) => {
    if (feed.employeeId) {
      staffData[feed.employeeId] = feed.modelForClient()
    }
  })
  ctx.body = staffData
})

export const OpenStaffSpecs = factory.buildSpecs()
