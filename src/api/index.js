import Axios from '@/axios'
const axios = new Axios()
const instance = axios.instance
const root = '/api'
axios.setRequestInterceptors(Axios.requestInterceptors.stringifyParams)
axios.setResponseInterceptors(Axios.responseInterceptors.getData)

export function unifyLogin(params) {
  return instance.post(root + '/menus/unifyLogin', params)
}

export function getVerificationCode(params) {
  return instance.post(root + '/FrontendStudents/sendMessageOfPassword', params)
}

export function verifyVerificationCode(params) {
  return instance.post(root + '/FrontendStudents/verifyNum', params)
}

export function resetPassword(params) {
  return instance.post(root + '/FrontendStudents/verifyNum', params)
}

export default function install(vue) {
  vue.prototype.$http = instance
}
