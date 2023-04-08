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
  name: string
}

// export interface DepartmentMemberInfo {
//   email: string
//   departmentId: number
//   isLeader: number
//   name: string
// }
//

export interface FeishuDepartmentTree extends FeishuDepartmentModel {
  subDepartmentList: FeishuDepartmentTree[]
  memberList: FeishuDepartmentMemberModel[]
}

export interface FeishuDepartmentDetailInfo extends FeishuDepartmentModel {
  fullPathName: string
  pathDepartments: FeishuDepartmentModel[]
}
