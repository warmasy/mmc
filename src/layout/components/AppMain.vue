<template>
  <section class="app-main" :style="mainStyle">
    <!-- 无过渡动画：直接渲染（用户要求删除页面加载/切换时的 fade-transform 过渡动画；
         不使用 mode="out-in" 也是为了避免切换含 WebGL 的重组件时空白屏） -->
    <router-view v-slot="{ Component, route }">
      <keep-alive :include="tagsViewStore.cachedViews">
        <component v-if="!route.meta.link" :is="Component" :key="route.path"/>
      </keep-alive>
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

// 页脚显示时预留其高度（48px + 余量）；隐藏时留 8px 小边距（不贴底，也不像之前 20px 那么空）
const mainStyle = computed(() => {
  const footerHeight = settingsStore.footerVisible ? '52px' : '8px'
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
