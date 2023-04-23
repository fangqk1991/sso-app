import { Api } from '@fangcha/swagger'

export const Admin_AccountApis = {
  AccountPageDataGet: {
    method: 'GET',
    route: '/api/v1/account',
    description: 'Account PageData Get',
  } as Api,
  AccountCreate: {
    method: 'POST',
    route: '/api/v1/account',
    description: 'Account Create',
  } as Api,
  AccountPasswordReset: {
    method: 'PUT',
    route: '/api/v1/account/:accountUid/reset-password',
    description: 'Account Password Reset',
  } as Api,
  AccountBasicInfoUpdate: {
    method: 'PUT',
    route: '/api/v1/account/:accountUid/basic-info',
    description: 'Account Basic Info Update',
  } as Api,
  AccountCarrierUpdate: {
    method: 'PUT',
    route: '/api/v1/account/:accountUid/carrier/:accountCarrier',
    description: 'Account Carrier Update',
  } as Api,
  AccountCarrierUnlink: {
    method: 'DELETE',
    route: '/api/v1/account/:accountUid/carrier/:accountCarrier',
    description: 'Account Carrier Delete',
  } as Api,
}
