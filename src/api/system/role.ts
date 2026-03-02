import request from '@/utils/request';

export function getRoles(params: {}) {
  return request({
    url: '/role/page',
    params
  })
}
