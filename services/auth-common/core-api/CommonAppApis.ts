import { Api } from '@fangcha/swagger'

export const CommonAppApis = {
  AppInfoGet: {
    method: 'GET',
    route: '/api/v1/app/:appid',
    description: 'App 信息获取',
  } as Api,
  AppUpdate: {
    method: 'PUT',
    route: '/api/v1/app/:appid',
    description: 'App 更新',
  } as Api,
  AppGreenFullInfoRequest: {
    method: 'GET',
    route: '/api/v1/app/:appid/green-full-info',
    description: '应用完整信息获取',
  } as Api,

  AppFullInfoUpdate: {
    method: 'PUT',
    route: '/api/v1/full-app/:appid',
    description: '完整应用信息更新',
  } as Api,
  AppOpenInfoPreview: {
    method: 'POST',
    route: '/api/v1/app/:appid/open-info-preview',
    description: '应用开放信息预览',
  } as Api,
  AppInfoExport: {
    method: 'GET',
    route: '/api/v1/app/:appid/export',
    description: '应用信息导出',
  } as Api,

  AppAccessPageDataGet: {
    method: 'GET',
    route: '/api/v1/app/:appid/access',
    description: '应用 Access 列表获取',
  } as Api,
  AppAccessCreate: {
    method: 'POST',
    route: '/api/v1/app/:appid/access',
    description: '应用 Access 添加',
  } as Api,
  AppAccessInfoRequest: {
    method: 'POST',
    route: '/api/v1/app/:appid/access/:accessId/request',
    description: '应用 Access 查看',
  } as Api,
  AppAccessDelete: {
    method: 'DELETE',
    route: '/api/v1/app/:appid/access/:accessId',
    description: '应用 Access 删除',
  } as Api,

  UserRelativeAppInfoGet: {
    method: 'GET',
    route: '/api/v1/app/:appid/visitor-relative-info',
    description: '用户相关信息获取',
  } as Api,

  AppAllGroupListGet: {
    method: 'GET',
    route: '/api/v1/app/:appid/all-groups',
    description: '用户组列表获取',
  } as Api,
  AppGroupPageDataGet: {
    method: 'GET',
    route: '/api/v1/app/:appid/group',
    description: '用户组分页数据获取',
  } as Api,
  AppDepartmentGroupListGet: {
    method: 'GET',
    route: '/api/v1/app/:appid/department-group',
    description: '部门组列表获取',
  } as Api,
  AppGroupCreate: {
    method: 'POST',
    route: '/api/v1/app/:appid/group',
    description: '用户组创建',
  } as Api,
  AppGroupFullCreate: {
    method: 'POST',
    route: '/api/v1/app/:appid/full-group',
    description: '创建完整用户组',
  } as Api,
  AppGroupsDestroy: {
    method: 'DELETE',
    route: '/api/v1/app/:appid/destroy-all-group',
    description: '移除所有用户组',
  } as Api,
  AppGroupInfoGet: {
    method: 'GET',
    route: '/api/v1/app/:appid/group/:groupId',
    description: '用户组信息获取',
  } as Api,
  AppGroupFullMembersGet: {
    method: 'GET',
    route: '/api/v1/app/:appid/group/:groupId/full-sub-members',
    description: '用户组完整子集成员获取',
  } as Api,
  AppGroupInfoExport: {
    method: 'GET',
    route: '/api/v1/app/:appid/group/:groupId/export',
    description: '用户组信息导出',
  } as Api,
  AppGroupInfoUpdate: {
    method: 'PUT',
    route: '/api/v1/app/:appid/group/:groupId',
    description: '用户组信息更新',
  } as Api,
  AppFullGroupInfoUpdate: {
    method: 'PUT',
    route: '/api/v1/app/:appid/full-group/:groupId',
    description: '完整用户组信息更新',
  } as Api,
  AppGroupDelete: {
    method: 'DELETE',
    route: '/api/v1/app/:appid/group/:groupId',
    description: '用户组信息删除',
  } as Api,

  AppGroupPermissionUpdate: {
    method: 'PUT',
    route: '/api/v1/app/:appid/group/:groupId/permission',
    description: '用户组权限变更',
  } as Api,

  AppGroupMemberListGet: {
    method: 'GET',
    route: '/api/v1/app/:appid/group/:groupId/member',
    description: '用户组成员列表获取',
  } as Api,
  AppGroupMemberCreate: {
    method: 'POST',
    route: '/api/v1/app/:appid/group/:groupId/member',
    description: '用户组成员添加',
  } as Api,
  AppGroupMemberUpdate: {
    method: 'PUT',
    route: '/api/v1/app/:appid/group/:groupId/member/:member',
    description: '用户组成员修改',
  } as Api,
  AppGroupMemberDelete: {
    method: 'DELETE',
    route: '/api/v1/app/:appid/group/:groupId/member/:member',
    description: '用户组成员删除',
  } as Api,

  AppGroupAccessPageDataGet: {
    method: 'GET',
    route: '/api/v1/app/:appid/group/:groupId/access',
    description: '用户组 Access 列表获取',
  } as Api,
  AppGroupAccessCreate: {
    method: 'POST',
    route: '/api/v1/app/:appid/group/:groupId/access',
    description: '用户组 Access 添加',
  } as Api,
  AppGroupAccessInfoRequest: {
    method: 'POST',
    route: '/api/v1/app/:appid/group/:groupId/access/:accessId/request',
    description: '用户组 Access 查看',
  } as Api,
  AppGroupAccessDelete: {
    method: 'DELETE',
    route: '/api/v1/app/:appid/group/:groupId/access/:accessId',
    description: '用户组 Access 删除',
  } as Api,
}
