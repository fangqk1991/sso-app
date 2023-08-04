import { SwaggerDocItem } from '@fangcha/router'
import { UserSwaggerModelList } from '@web/sso-common/user-models/swagger'
import { OpenAppSpecs } from './specs/OpenAppSpecs'
import { OpenStaffSpecs } from './specs/OpenStaffSpecs'

export const SsoPowerSpecDocItems: SwaggerDocItem[] = [
  {
    name: '应用',
    pageURL: '/api-docs/v1/app',
    specs: OpenAppSpecs,
    models: UserSwaggerModelList,
    description: ['* 鉴权方式: Basic Auth', '* Username: 相关应用的 Appid', '* Password: 相关应用的任一密钥'].join(
      '\n'
    ),
  },
  {
    name: 'Staffs',
    pageURL: '/api-docs/v1/staff',
    specs: OpenStaffSpecs,
    description: ['* 鉴权方式: Basic Auth', '* Username: 相关应用的 Appid', '* Password: 相关应用的任一密钥'].join(
      '\n'
    ),
  },
]
