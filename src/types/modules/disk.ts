export interface DiskItem {
  id: number
  type: 'FILE' | 'FOLDER'  // 如果还有其他类型可以扩展
  name: string
  parentId: number | null
  ownerId: number
  bucketName: string | null
  objectKey: string | null
  fileSize: number | null
  contentType: string | null
  fileExt: string | null
  etag: string | null
  isDeleted: boolean
  deletedAt: string | null  // 如果是日期对象可以用 Date | null
  createTime: string        // 或者用 Date 类型
  updateTime: string        // 或者用 Date 类型
}