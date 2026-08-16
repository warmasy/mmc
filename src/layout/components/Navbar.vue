<template>
  <div class="navbar" :class="'nav' + settingsStore.navType">
    <hamburger id="hamburger-container" :is-active="appStore.sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb v-if="settingsStore.navType == 1" id="breadcrumb-container" class="breadcrumb-container" />
    <top-nav v-if="settingsStore.navType == 2" id="topmenu-container" class="topmenu-container" />
    <template v-if="settingsStore.navType == 3">
      <logo v-show="settingsStore.sidebarLogo" :collapse="false"></logo>
      <top-bar id="topbar-container" class="topbar-container" />
    </template>

    <div class="right-menu">
      <template v-if="appStore.device !== 'mobile'">
        <header-search id="header-search" class="right-menu-item" />
        <!-- 源码地址 -->
        <div class="right-menu-item hover-effect data-center-trigger" @click="openExternalUrl('https://github.com')">
          <svg-icon icon-class="github" />
        </div>
        <!-- 文档地址 -->
        <div class="right-menu-item hover-effect data-center-trigger" @click="openExternalUrl('http://doc.ruoyi.vip/ruoyi-vue')">
          <svg-icon icon-class="question" />
        </div>
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
        <!-- 主题模式 -->
        <div class="right-menu-item hover-effect data-center-trigger" @click="toggleTheme">
          <svg-icon v-if="settingsStore.isDark" icon-class="sunny" />
          <svg-icon v-if="!settingsStore.isDark" icon-class="moon" />
        </div>
        <!-- 数据中心 -->
        <el-dropdown trigger="hover" @command="handleDataCommand" class="right-menu-item hover-effect">
          <div class="data-center-trigger">
            <svg-icon icon-class="chart" />
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <router-link to="/online/index">
                <el-dropdown-item>在线用户</el-dropdown-item>
              </router-link>
              <router-link to="/logininfor/index">
                <el-dropdown-item>登录日志</el-dropdown-item>
              </router-link>
              <router-link to="/website-data/index">
                <el-dropdown-item>网站数据</el-dropdown-item>
              </router-link>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>

      <el-dropdown @command="handleCommand" class="avatar-container right-menu-item hover-effect" trigger="hover">
        <div class="avatar-wrapper">
          <svg-icon icon-class="account" class="user-avatar" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/user/profile">
              <el-dropdown-item>个人中心</el-dropdown-item>
            </router-link>
            <el-dropdown-item command="setLayout" v-if="settingsStore.showSettings">
              <span>布局设置</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox } from 'element-plus'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import TopBar from './TopBar'
import Logo from './Sidebar/Logo'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import HeaderSearch from '@/components/HeaderSearch'
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'
import useSettingsStore from '@/store/modules/settings'

const appStore = useAppStore()
const userStore = useUserStore()
const settingsStore = useSettingsStore()

function toggleSideBar() {
  appStore.toggleSideBar()
}

function handleCommand(command) {
  switch (command) {
    case "setLayout":
      setLayout()
      break
    default:
      break
  }
}

function handleDataCommand() {
  // 数据中心下拉项使用 router-link 跳转，此处无需处理
}

function openExternalUrl(url) {
  if (url) {
    window.open(url, '_blank')
  }
}

const emits = defineEmits(['setLayout'])
function setLayout() {
  emits('setLayout')
}

async function toggleTheme(event) {
  const x = event?.clientX || window.innerWidth / 2
  const y = event?.clientY || window.innerHeight / 2
  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const isSupported = document.startViewTransition && !isReducedMotion
  if (!isSupported) {
    settingsStore.toggleTheme()
    return
  }
  try {
    // 计算圆形扩散的最大半径（点击点到四角的对角线）
    const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    // 通过 CSS 变量把点击位置和半径传给 CSS 动画，
    // 动画在伪元素创建的瞬间即生效，避免 JS 动画的时序窗口闪烁
    const style = document.documentElement.style
    style.setProperty('--theme-x', `${x}px`)
    style.setProperty('--theme-y', `${y}px`)
    style.setProperty('--theme-r', `${endRadius}px`)
    const transition = document.startViewTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10))
      settingsStore.toggleTheme()
      await nextTick()
    })
    await transition.finished
  } catch (error) {
    console.warn("View transition failed, falling back to immediate toggle:", error)
    settingsStore.toggleTheme()
  }
}
</script>

<style lang='scss' scoped>
.navbar.nav3 {
  .hamburger-container {
    display: none !important;
  }
}

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: var(--navbar-bg);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  box-sizing: border-box;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-right: 8px;
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    flex-shrink: 0;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .topbar-container {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    overflow: hidden;
    margin-left: 8px;
  }

  .right-menu {
    height: 100%;
    line-height: 50px;
    display: flex;
    align-items: center;
    margin-left: auto;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;
        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }

      .data-center-trigger {
        display: flex;
        align-items: center;
        height: 100%;
      }
    }

    .avatar-container {
      margin-right: 0px;
      padding-right: 0px;
      display: flex;
      align-items: center;
      height: 100%;

      .avatar-wrapper {
        display: flex;
        align-items: center;
        height: 100%;
        margin-top: 0;
        right: 8px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          margin-right: 8px;
          border-radius: 50%;
          vertical-align: middle;
          border-style: none;
        }

        .user-nickname {
          position: relative;
          left: 0px;
          font-size: 14px;
          font-weight: bold;
        }

        i {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>