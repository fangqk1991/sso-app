export interface FeishuDepartmentModel {
  openDepartmentId: string
  parentOpenDepartmentId: string
  departmentName: string
  path: string
  hash: string
}

export interface FeishuDepartmentMemberModel {
  unionId: string
  openDepartmentId: string
  isLeader: number
}

// export interface DepartmentMemberInfo {
//   email: string
//   departmentId: number
//   isLeader: number
//   name: string
// }
//
// export interface DepartmentNode {
//   val: WechatDepartmentModel
//   label: string
//   children: DepartmentNode[]
// }
//
// export interface DepartmentDetailInfo extends WechatDepartmentModel {
//   fullPathName: string
//   pathDepartments: WechatDepartmentModel[]
// }
