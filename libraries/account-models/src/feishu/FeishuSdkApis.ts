import { Api, makeSwaggerBodyDataParameters } from '@fangcha/swagger'
import { FeishuSwaggerModels } from './FeishuSwaggerModels'

export const FeishuSdkApis = {
  FullDepartmentTreeGet: {
    method: 'GET',
    route: '/api/feishu-sdk/v1/department-tree',
    description: '飞书完整组织架构信息获取',
    responseSchemaRef: FeishuSwaggerModels.Swagger_FeishuDepartmentTree,
  } as Api,
  FeishuStaffSearch: {
    method: 'POST',
    route: '/api/feishu-sdk/v1/search-staffs',
    description: '飞书员工信息查询',
    parameters: makeSwaggerBodyDataParameters(FeishuSwaggerModels.Swagger_FeishuStaffSearchParams),
    responseSchemaRef: FeishuSwaggerModels.Swagger_FeishuUserList,
  } as Api,
}
