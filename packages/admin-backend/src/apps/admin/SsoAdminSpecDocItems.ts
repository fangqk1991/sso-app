import { SwaggerDocItem } from '@fangcha/router'
import { SsoClientSpecs } from './specs/SsoClientSpecs'
import { AccountSpecs } from './specs/AccountSpecs'
import { Admin_AppSpecsBuilder } from './UserAdminUtils'
import { AppSpecs } from './specs/AppSpecs'

export const SsoAdminSpecDocItems: SwaggerDocItem[] = [
  {
    name: 'SSO Client',
    pageURL: '/api-docs/v1/sso-client',
    specs: SsoClientSpecs,
  },
  {
    name: 'Account',
    pageURL: '/api-docs/v1/account',
    specs: AccountSpecs,
  },
  {
    name: '应用',
    pageURL: '/api-docs/v1/app',
    specs: [...Admin_AppSpecsBuilder.makeSpecs(), ...AppSpecs],
  },
]
