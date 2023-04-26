import { SwaggerDocItem } from '@fangcha/router'
import { FeishuLoginSpecs } from './FeishuLoginSpecs'

export const SsoWebSpecDocItems: SwaggerDocItem[] = [
  {
    name: 'Feishu',
    pageURL: '/api-docs/v1/joint-feishu',
    specs: FeishuLoginSpecs,
  },
]
