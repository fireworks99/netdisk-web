import request from '@/utils/request';

// 查询文件（夹）
export function getList(params?: { parentId: number }) {
  return request({
    url: '/disk/items',
    params
  })
}

// 创建文件夹
export function addFolder(data: { name: string, parentId: number | undefined }) {
  return request({
    url: '/disk/folder',
    method: 'post',
    data
  })
}

// 获取上传URL
export function getUploadInfo(data: { originalName: string, contentType: string, size: number }) {
  return request({
    url: '/disk/upload-url',
    method: 'post',
    data
  })
}

// 保存文件信息
export function saveFileInfo(data: {}) {
  return request({
    url: '/disk/file',
    method: 'post',
    data
  })
}

// 预览、下载文件
export function getPDUrl(id: number) {
  return request({
    url: `/disk/${id}/url`
  })
}

// 移动文件（夹）
export function move(data: {}) {
  return request({
    url: '/disk/move',
    method: 'post',
    data
  })
}

// 删除文件（夹）
export function deleteF(id: number) {
  return request({
    url: `/disk/${id}`,
    method: 'delete',
  })
}
