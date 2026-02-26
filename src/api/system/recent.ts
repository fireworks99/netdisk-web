import request from '@/utils/request';

export function getRecent(params: {}) {
  return request({
    url: '/recent/page',
    params
  })
}