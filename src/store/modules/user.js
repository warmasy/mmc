import router from '@/router'
import { ElMessageBox } from 'element-plus'
import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { isHttp, isEmpty } from "@/utils/validate"
import defAva from '@/assets/images/profile.jpg'

// ============================================================
// 📝 个人中心信息配置（手动修改这里即可）
// ============================================================
export const FAKE_USER = {
  userId: 1,
  userName: 'admin',
  nickName: 'online',
  avatar: '',
  email: 'admin@ruoyi.com',
  phonenumber: '13800138001',
  sex: '0',
  status: '0',
  createTime: '2024-01-15 09:30:00',
  dept: { deptId: 100, deptName: '研发部门' },
  roles: [{ roleId: 1, roleName: '超级管理员', roleKey: 'admin', dataScope: '1' }]
}
// ============================================================

const useUserStore = defineStore(
  'user',
  {
    state: () => ({
      token: getToken(),
      id: FAKE_USER.userId,
      name: FAKE_USER.userName,
      nickName: FAKE_USER.nickName,
      avatar: defAva,
      roles: ['admin'],
      permissions: ['*:*:*']
    }),
    actions: {
      login(userInfo) {
        return new Promise((resolve) => {
          setToken('fake-token')
          this.token = 'fake-token'
          resolve()
        })
      },
      getInfo() {
        return new Promise((resolve) => {
          this.roles = ['admin']
          this.permissions = ['*:*:*']
          this.id = FAKE_USER.userId
          this.name = FAKE_USER.userName
          this.nickName = FAKE_USER.nickName
          this.avatar = defAva
          resolve({
            user: FAKE_USER,
            roles: ['admin'],
            permissions: ['*:*:*'],
            isDefaultModifyPwd: false,
            isPasswordExpired: false
          })
        })
      },
      logOut() {
        return new Promise((resolve) => {
          this.token = ''
          this.roles = []
          this.permissions = []
          removeToken()
          resolve()
        })
      }
    }
  })

export default useUserStore
