<template>
  <section class="app-main" :style="mainStyle">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="tagsViewStore.cachedViews">
          <component v-if="!route.meta.link" :is="Component" :key="route.path"/>
        </keep-alive>
      </transition>
    </router-view>
    <iframe-toggle />
    <copyright />
  </section>
</template>

<script setup>
import copyright from "./Copyright/index"
import iframeToggle from "./IframeToggle/index"
import useTagsViewStore from '@/store/modules/tagsView'
import useSettingsStore from '@/store/modules/settings'

const route = useRoute()
const tagsViewStore = useTagsViewStore()
const settingsStore = useSettingsStore()

// 页脚显示时预留其高度（48px + 余量），隐藏时恢复正常内边距，避免固定页脚遮挡页面内容
const mainStyle = computed(() => {
  const footerHeight = settingsStore.footerVisible ? '52px' : '20px'
  return { '--app-main-pb': footerHeight }
})

onMounted(() => {
  addIframe()
})

watchEffect(() => {
  addIframe()
})

function addIframe() {
  if (route.meta.link) {
    useTagsViewStore().addIframeView(route)
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  padding-bottom: var(--app-main-pb, 20px);
}

.fixed-header + .app-main {
  overflow-y: auto;
  scrollbar-gutter: auto;
  height: calc(100vh - 50px);
  min-height: 0px;
  padding-bottom: var(--app-main-pb, 20px);
}

.fixed-header + .app-main {
  margin-top: 50px;
}

.hasTagsView {
  .app-main {
    min-height: calc(100vh - 84px);
    padding-bottom: var(--app-main-pb, 20px);
  }

  .fixed-header + .app-main {
    margin-top: 84px;
    height: calc(100vh - 84px);
    min-height: 0px;
    padding-bottom: var(--app-main-pb, 20px);
  }
}

@media screen and (max-width: 991px) {
  .fixed-header + .app-main {
    padding-bottom: max(var(--app-main-pb, 20px), 60px);
    overscroll-behavior-y: none;
  }

  .hasTagsView .fixed-header + .app-main {
    padding-bottom: max(var(--app-main-pb, 20px), 60px);
    overscroll-behavior-y: none;
  }
}

@supports (-webkit-touch-callout: none) {
  @media screen and (max-width: 991px) {
    .fixed-header + .app-main {
      padding-bottom: max(var(--app-main-pb, 20px), 17px);
      height: calc(100svh - 50px);
      height: calc(100dvh - 50px);
    }

    .hasTagsView .fixed-header + .app-main {
      padding-bottom: max(var(--app-main-pb, 20px), 17px);
      height: calc(100svh - 84px);
      height: calc(100dvh - 84px);
    }
  }
}
</style>

<style lang="scss">
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background-color: #c0c0c0;
  border-radius: 3px;
}
</style>
