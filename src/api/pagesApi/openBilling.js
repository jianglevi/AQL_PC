
import request from '@/utils/request'

export function fetchList(url, method, params, data) {
  return request({
    url: url,
    method: method || 'get',
    params: params,
    data: data
  })
}