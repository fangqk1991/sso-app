import { Api, buildSwaggerSchema } from '@fangcha/swagger'

export const OpenStaffApis = {
  SearchStaffsByEmployeeIds: {
    method: 'POST',
    route: '/api/v1/staff/search-staffs-by-employee-ids',
    description: '根据工号查询员工信息',
    parameters: [
      {
        name: 'bodyData',
        type: 'object',
        in: 'body',
        schema: buildSwaggerSchema(['XXX']),
      },
    ],
  } as Api,
  UserGroupMembersGet: {
    method: 'GET',
    route: '/api/v1/user-group/:groupId/member',
    description: '查询指定组成员信息',
  } as Api,
}
