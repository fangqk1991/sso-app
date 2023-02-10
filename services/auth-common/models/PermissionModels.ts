export interface PermissionMeta {
  permissionKey: string
  name: string
  description: string
  children?: PermissionMeta[]
}

export interface PermissionsGrantParams {
  permissionKeys: string[]
}
