import { SwaggerDocItem } from '@fangcha/router'
import { DepartmentSpecs } from './DepartmentSpecs'
import { FeishuSwaggerModelList } from '@fangcha/account-models'

export const FeishuSdkDocItem: SwaggerDocItem = {
  name: 'Feishu SDK',
  pageURL: '/api-docs/v1/feishu-sdk',
  specs: [...DepartmentSpecs],
  models: FeishuSwaggerModelList,
}
