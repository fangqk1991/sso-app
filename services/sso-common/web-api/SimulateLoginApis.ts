import { Api } from '@fangcha/swagger'

export const SimulateLoginApis = {
  SimulateLogin: {
    method: 'GET',
    route: '/api/v1/simulate-login',
    description: '模拟登录',
  } as Api,
}
