import { Descriptor } from '@fangcha/tools'

export enum AuthMode {
  Simple = 'simple',
  SSO = 'sso',
}

const values = [AuthMode.Simple, AuthMode.SSO]

const describe = (code: AuthMode) => {
  return code
}

export const AuthModeDescriptor = new Descriptor(values, describe)
