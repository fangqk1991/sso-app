import { Api, buildSwaggerSchema, SwaggerParameter } from '@fangcha/swagger'

export const Admin_AppApis = {
  AppPageDataGet: {
    method: 'GET',
    route: '/api/v1/app',
    description: 'App 分页数据获取',
  } as Api,
  AppCreate: {
    method: 'POST',
    route: '/api/v1/app',
    description: 'App 创建',
  } as Api,
  AppFullCreate: {
    method: 'POST',
    route: '/api/v1/full-app',
    description: '创建完整应用',
  } as Api,
  AppDelete: {
    method: 'DELETE',
    route: '/api/v1/app/:appid',
    description: 'App 删除',
  } as Api,
  AppOpenVisitorsImport: {
    method: 'POST',
    route: '/api/v1/app/:appid/open-visitors',
    description: '应用访问者导入',
    parameters: [
      {
        name: 'bodyData',
        type: 'object',
        in: 'body',
        schema: buildSwaggerSchema({}),
      },
    ] as SwaggerParameter[],
  } as Api,
}
