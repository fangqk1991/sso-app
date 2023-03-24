export const FeishuApis = {
  TenantAccessTokenRequest: {
    method: 'POST',
    route: '/open-apis/auth/v3/tenant_access_token/internal',
    description: '自建应用获取 tenant_access_token',
  },
  EmployeePageDataGet: {
    method: 'GET',
    route: '/open-apis/ehr/v1/employees',
    description: '批量获取员工花名册信息',
  },
}
