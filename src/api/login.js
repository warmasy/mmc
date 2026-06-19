import request from '@/utils/request'
import { FAKE_USER } from '@/store/modules/user'

export function login(username, password, code, uuid) {
  return Promise.resolve({ token: 'fake-jwt-token-for-frontend-demo', expiresIn: 86400 })
}

export function register(data) {
  return Promise.resolve({ code: 200, msg: '操作成功' })
}

export function getInfo() {
  return Promise.resolve({
    user: FAKE_USER,
    roles: ['admin'],
    permissions: ['*:*:*'],
    isDefaultModifyPwd: false,
    isPasswordExpired: false
  })
}

export function logout() {
  return Promise.resolve({ code: 200, msg: '退出成功' })
}

export function getCodeImg() {
  return Promise.resolve({
    captchaOnOff: false,
    uuid: 'fake-uuid',
    img: ''
  })
}
