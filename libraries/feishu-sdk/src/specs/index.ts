import { SwaggerDocItem } from '@fangcha/router'
import { DepartmentSpecs } from './DepartmentSpecs'

export const FeishuSdkDocItem: SwaggerDocItem = {
  name: 'Feishu SDK',
  pageURL: '/api-docs/v1/feishu-sdk',
  specs: [...DepartmentSpecs],
}
