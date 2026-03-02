export interface SysUser {
  id: number
  username: string
  password: string
  nickname: string
  status: boolean | null  // Boolean 对应 TS 的 boolean，允许为 null
  createTime: string      // LocalDateTime 通常在前端作为 ISO 字符串处理
  updateTime: string      // LocalDateTime 通常在前端作为 ISO 字符串处理
}