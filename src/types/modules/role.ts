export interface SysRole {
  id: number
  roleName: string
  roleCode: string
  description: string
  createTime: string  // LocalDateTime 在前端通常作为 ISO 字符串处理
}