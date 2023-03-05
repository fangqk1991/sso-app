import { Api } from '@fangcha/swagger'
import { UserSwaggerModelData } from '../user-models/swagger'

export const OpenAppApis = {
  AppFullInfo: {
    method: 'GET',
    route: '/api/v1/app-full-info',
    description: '应用完整信息',
    parameters: [],
    responseSchemaRef: UserSwaggerModelData.Swagger_AppFullInfo,
  } as Api,
  AppVersionGet: {
    method: 'GET',
    route: '/api/v1/app-version',
    description: '获取应用版本号',
    parameters: [],
    responseDemo: 0,
  } as Api,
}
