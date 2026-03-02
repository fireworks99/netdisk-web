import request from '@/utils/request';

export function getPerms(params: {}) {
  return request({
    url: '/permission/page',
    params
  })
}
