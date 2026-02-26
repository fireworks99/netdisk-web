import request from '@/utils/request';

export function getFavorite(params: {}) {
  return request({
    url: '/favorite/page',
    params
  })
}

export function setFavorite(id: number) {
  return request({
    url: `/favorite/${id}`,
    method: 'post'
  })
}

export function rmFavorite(id: number) {
  return request({
    url: `/favorite/${id}`,
    method: 'delete'
  })
}
