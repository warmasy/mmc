import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const FAKE_TOKEN = 'fake-token-for-frontend-only-mode'

export function getToken() {
  return FAKE_TOKEN
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
