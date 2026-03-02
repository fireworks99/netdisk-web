import request from '@/utils/request';

export function loginAPI(username: string, password: string) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: { username, password }
  })
}

export function registerAPI(username: string, password: string) {
  return request({
    url: '/auth/register',
    method: 'post',
    data: { username, password }
  })
}