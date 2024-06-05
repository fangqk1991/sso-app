import { Api, makeSwaggerBodyDataParameters } from '@fangcha/swagger'
import { AuthSwaggerModelData } from '../swagger'

export const ProfileApis = {
  ProfileInfoGet: {
    method: 'GET',
    route: '/api/v1/profile',
    description: '获取个人信息',
    responseSchemaRef: AuthSwaggerModelData.Swagger_VisitorCoreInfo,
  } as Api,
  EmailUpdate: {
    method: 'PUT',
    route: '/api/v1/profile/email',
    description: '设置邮箱',
    parameters: makeSwaggerBodyDataParameters(AuthSwaggerModelData.Swagger_EmailUpdateParams),
  } as Api,
  PasswordUpdate: {
    method: 'PUT',
    route: '/api/v1/profile/password',
    description: '更新密码',
    parameters: makeSwaggerBodyDataParameters(AuthSwaggerModelData.Swagger_PasswordUpdateParams),
  } as Api,
}
