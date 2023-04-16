import { Api } from '@fangcha/swagger'

export const FeishuSdkApis = {
  FullDepartmentDataGet: {
    method: 'GET',
    route: '/api/feishu-sdk/v1/full-department',
    description: '飞书完整组织架构信息获取',
  } as Api,
  MembersSearch: {
    method: 'POST',
    route: '/api/feishu-sdk/v1/search-members',
    description: '飞书员工信息查询',
  } as Api,
}
