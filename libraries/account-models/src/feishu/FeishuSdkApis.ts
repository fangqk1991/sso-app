import { Api } from '@fangcha/swagger'

export const FeishuSdkApis = {
  FullDepartmentDataGet: {
    method: 'GET',
    route: '/api/feishu-sdk/v1/full-department',
    description: '飞书完整组织架构信息获取',
  } as Api,
}
