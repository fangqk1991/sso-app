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
  DepartmentInfoGet: {
    method: 'GET',
    route: '/open-apis/contact/v3/departments/:department_id',
    description: '获取部门信息',
  },
  DepartmentChildrenInfoGet: {
    method: 'GET',
    route: '/open-apis/contact/v3/departments/:department_id/children',
    description: '获取子部门列表',
  },
  DepartmentMemberPageDataGet: {
    method: 'GET',
    route: '/open-apis/contact/v3/users/find_by_department',
    description: '获取部门直属用户列表',
  },
}
