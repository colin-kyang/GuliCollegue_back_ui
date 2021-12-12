import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'edu/user/table/list',
    method: 'get',
    params
  })
}
