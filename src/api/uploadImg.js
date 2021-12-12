import request from '@/utils/request'

export function uplaod(image) {
  return request({
    url: 'http://127.0.0.1:36677/upload',
    method: 'get',
    img:image
  })
}
