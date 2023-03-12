import { Api } from '@fangcha/swagger'

export const UserSdkApis = {
  PermissionCheck: {
    method: 'GET',
    route: '/api/user-sdk/v1/check-permission',
    description: 'Check permission',
    parameters: [
      {
        name: 'permissionKey',
        type: 'string',
        in: 'query',
      },
    ],
  } as Api,
  AdminCheck: {
    method: 'GET',
    route: '/api/user-sdk/v1/check-admin',
    description: 'Check admin',
  } as Api,
}
