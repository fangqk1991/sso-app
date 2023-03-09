import { SwaggerDocItem } from '@fangcha/router'
import { WebSsoSpecs } from './SsoClientSpecs'

export const SsoClientSpecDocItem: SwaggerDocItem = {
  name: 'SSO',
  pageURL: '/api-docs/v1/sso-client',
  specs: WebSsoSpecs,
}
