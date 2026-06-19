import request from '@/utils/request'
import { mockTransportCryptoData } from '@/mock/data'

export function getTransportCryptoMonitor() {
  return Promise.resolve({ code: 200, msg: "操作成功", data: mockTransportCryptoData })
}
