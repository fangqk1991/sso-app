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

factory.prepare(OpenStaffApis.UserGroupMembersGet, async (ctx) => {
  const userGroup = (await MyFeishuServer.FeishuUserGroup.findWithUid(ctx.params.groupId))!
  assert.ok(!!userGroup, `Group[${ctx.params.groupId}] not exists`)

  const membersData = userGroup.membersData()
  const searcher = new MyFeishuServer.FeishuUser().fc_searcher()
  searcher.processor().addConditionKeyInArray('union_id', membersData.unionIdList)

  const membersList = await searcher.queryAllFeeds()
  ctx.body = membersList.map((item) => ({
    unionId: item.unionId,
    employeeId: item.employeeId,
    name: item.name,
  }))
})

export const OpenStaffSpecs = factory.buildSpecs()
