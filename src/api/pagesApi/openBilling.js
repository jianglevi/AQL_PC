
import request from '@/utils/request'
import {
  Message,
  MessageBox
} from 'element-ui'
export function fetchList(url, method, params, data) {
  return request({
    url: url,
    method: method || 'get',
    params: params,
    data: data,
  })
}
export function apiRequest(url,  params, method, data) {
  return request({
    url: url,
    params: params,
    method: method || 'get',
    data: data
  })
}

export function sendMessage(message,type){
  Message({
    message: message,
    type: type || 'success',
  });
}
export function postRequest(url, data, headers) {
  return request({
    url: url,
    method: 'POST',
    data: data,
    headers: headers
  })
}
