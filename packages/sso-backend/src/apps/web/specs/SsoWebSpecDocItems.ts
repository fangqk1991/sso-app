import { SwaggerDocItem } from '@fangcha/router'
import { FeishuLoginSpecs } from './FeishuLoginSpecs'
import { GoogleLoginSpecs } from './GoogleLoginSpecs'

export const SsoWebSpecDocItems: SwaggerDocItem[] = [
  {
    name: 'Feishu',
    pageURL: '/api-docs/v1/joint-feishu',
    specs: FeishuLoginSpecs,
  },
  {
    name: 'Google',
    pageURL: '/api-docs/v1/joint-google',
    specs: GoogleLoginSpecs,
  },
]
