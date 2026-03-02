export interface SysPermission {
  id: number
  permissionName: string
  permissionCode: string
  type: string
  parentId: number | null  // Long 类型可能为 null
  path: string | null      // path 可能为 null
  method: string | null    // method 可能为 null
  createTime: string       // LocalDateTime 作为 ISO 字符串
}