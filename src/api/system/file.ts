import request from '@/utils/request';

// 获取文件列表
export function getFiles() {
  return request({
    url: '/file'
  })
}

// 下载文件
export function downloadFileById(fileId: string) {
  return request({
    url: `/file/${fileId}/download`,
    responseType: 'blob'
  })
}

// 上传文件
export function uploadFile(data: FormData) {
  return request({
    url: '/file/upload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}