import request from '@/utils/request';

// 获取文件列表
export function getFiles() {
  return request({
    url: '/file'
  })
}

// 下载文件第一步：拿到下载链接
export function downloadFileById(fileId: number) {
  return request({
    url: `/file/${fileId}/url`,
  })
}

// 上传文件第一步：拿到url与objectName
export function getUploadInfo(data: {}) {
  return request({
    url: '/file/upload-url',
    method: 'post',
    data
  })
}

// 上传文件第二步：保存数据
export function saveData(data: {}) {
  return request({
    url: '/file/save',
    method: 'post',
    data
  })
}