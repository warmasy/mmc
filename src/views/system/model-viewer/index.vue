<template>
  <!-- 模型查看：模型卡片 = 页面内完全模仿 3dviewer.net（Online3DViewer 开源项目）的完整界面 -->
  <div class="app-container model-card-page">
    <div class="model-card">
      <!-- O3DV 根容器（prefixed CSS 作用域） -->
      <div class="o3dv-root">
        <!-- 文件选择（隐藏） -->
        <input type="file" id="open_file" style="display:none;" multiple />

        <!-- 顶部：工具栏（title 行会在启动后被移除；logo 已删除，
             避免 Vite 把 <use href="xxx.svg#logo"> 静态路径内联成 data URI 导致跨源错误） -->
        <div class="header" id="header">
          <div class="title">
            <div class="title_right" id="header_buttons"></div>
            <div class="main_file_name only_full_width" id="main_file_name"></div>
          </div>
          <div class="toolbar" id="toolbar"></div>
        </div>

        <!-- 主体：左侧导航器 + 中间查看器 + 右侧设置栏 -->
        <div class="main" id="main">
          <div class="main_left_container only_full_width" id="main_left_container">
            <div class="main_navigator ov_panel_set_container" id="main_navigator"></div>
            <div class="main_splitter" id="main_navigator_splitter"></div>
          </div>
          <div class="main_viewer" id="main_viewer"></div>
          <div class="main_right_container only_full_width" id="main_right_container">
            <div class="main_splitter" id="main_sidebar_splitter"></div>
            <div class="main_sidebar ov_panel_set_right_container" id="main_sidebar"></div>
          </div>
        </div>

        <!-- 初始页（拖放导入 + 示例模型） -->
        <div class="intro ov_thin_scrollbar" id="intro">
          <div class="intro_content" id="intro_content">
            <div class="intro_logo">
              <!-- 3dviewer.net 文字 logo（内联 SVG：不用 <use> 引用外部文件，
                   避免 Vite 把静态 href 内联成 data URI 触发跨源错误；
                   文字/边框颜色用 --ov_logo_* 变量跟随主题） -->
              <svg class="intro_logo" version="1.1" viewBox="0 0 286 60" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path id="lg-a" d="M-5-1h62v62H-5z"/><clipPath id="lg-d-5"><use width="100%" height="100%" overflow="visible" xlink:href="#lg-c"/></clipPath><path id="lg-a-85" d="m-5-1h62v62h-62z"/><path id="lg-c" d="m-5-1h62v62h-62z"/></defs><clipPath id="lg-b"><use width="100%" height="100%" overflow="visible" xlink:href="#lg-a"/></clipPath><g transform="translate(.10025)" fill="#15334a"><path style="fill:var(--ov_logo_text_color);" transform="matrix(.78095 0 0 .78095 14.238 8.152)" d="m75.237 18.5c-6.008 0-10.237 4.52-10.237 10.528 0 5.98 4.229 10.47 10.237 10.47 5.979 0 10.207-4.49 10.207-10.47 0-6.007-4.228-10.528-10.207-10.528zm6.97 10.528c0 4.375-2.741 7.612-6.97 7.612-4.23 0-7-3.237-7-7.612 0-4.403 2.77-7.699 7-7.699 4.229 0 6.97 3.296 6.97 7.7zm21.839-10.236v16.332l-10.906-16.332h-3.88v20.415h3.091v-16.39l10.879 16.39h3.908v-20.415zm10.978 17.615v-17.615h-3.15v20.415h13.649v-2.8zm14.597-17.615v20.415h3.15v-20.415zm22.843 0v16.332l-10.907-16.332h-3.88v20.415h3.092v-16.39l10.879 16.39h3.908v-20.415zm22.031 2.741v-2.741h-14.203v20.415h14.203v-2.742h-11.112v-6.59h10.733v-2.655h-10.733v-5.687zm18.205 6.067 5.599-8.663v-0.145h-13.24v2.712h8.486l-5.425 8.195v0.146h2.625c2.77 0 4.696 1.458 4.696 3.47 0 1.984-1.663 3.442-4.083 3.442-1.692 0-3.908-0.67-6.33-2.07v3.382c2.334 1.05 4.434 1.459 6.242 1.43 4.258-0.03 7.291-2.538 7.291-6.154 0-3.092-2.537-5.25-5.862-5.746zm17.266-8.808h-7.408v20.415h7.408c6.183 0 10.849-4.2 10.849-10.208 0-5.92-4.666-10.207-10.85-10.207zm0.029 17.586h-4.287v-14.758h4.287c4.345 0 7.583 3.062 7.583 7.378 0 4.346-3.15 7.379-7.583 7.379zm34.925-17.586-5.833 17.47-5.862-17.47h-3.587l7.262 20.415h4.316l7.291-20.415zm7.056 0v20.415h3.15v-20.415zm22.26 2.741v-2.741h-14.203v20.415h14.203v-2.742h-11.112v-6.59h10.733v-2.655h-10.733v-5.687zm29.18-2.741-3.996 17.09-5.308-17.09h-3.733l-5.045 17.061-4.229-17.061h-3.733l5.687 20.415h4.404l4.754-17.411 5.045 17.41h4.404l5.454-20.414zm21.231 2.741v-2.741h-14.203v20.415h14.203v-2.742h-11.111v-6.59h10.732v-2.655h-10.732v-5.687zm17.253 17.674h4.024l-6.27-8.341c3.353-0.525 5.6-2.946 5.6-6.037 0-3.413-2.888-6.037-7-6.037h-9.012v20.415h3.15v-8.225h3.995zm-9.508-17.703h5.745c2.391 0 4.025 1.458 4.025 3.354 0 1.954-1.634 3.5-4.025 3.5h-5.745z" fill="#15334a" stroke-width="2.2231" aria-label="ONLINE 3D VIEWER"/></g><g transform="translate(-.7 .077394)"><clipPath id="lg-b-3"><use width="100%" height="100%" overflow="visible" xlink:href="#lg-a-85"/></clipPath><g clip-path="url(#lg-b-3)"><clipPath id="lg-d"><use width="100%" height="100%" overflow="visible" xlink:href="#lg-c"/></clipPath><g style="stroke:var(--ov_logo_border_color);" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"><path transform="translate(.039092 .02257)" d="m38.361 22.877-12.4-7.3 9.2e-5 -14.177 24.8 14.2v28.8l-12.4-7.3226z" clip-path="url(#lg-d)" fill="#4688b4"/><path transform="rotate(120,26,30.082)" d="m38.4 22.923-12.522-7.0887 0.14178-14.4 24.78 14.166v28.8l-12.522-7.0883z" clip-path="url(#lg-d-5)" fill="#64c0ff"/><path d="m26 30v14.4l12.4-7.3v-14.2z" clip-path="url(#lg-d)" fill="#294e67"/><path d="m13.6 37.1v-14.2l12.4-7.3v-14.177l-24.8 14.177v28.8z" clip-path="url(#lg-d)" fill="#294e67"/><path d="m26 15.6-12.4 7.3 12.4 7.1 12.4-7.1z" clip-path="url(#lg-d)" fill="#64c0ff"/><path d="m13.6 22.9 12.4 7.1v14.4l-12.4-7.3z" clip-path="url(#lg-d)" fill="#4688b4"/></g></g></g></svg>
              <div class="intro_dragdrop_text" id="intro_dragdrop_text"></div>
            </div>
            <div class="intro_formats">
              <div class="intro_formats_title" id="intro_formats_title"></div>
              <div class="intro_file_formats" id="intro_file_formats">
                <a href="#" @click.prevent="loadExample('RhinoLogo.3dm')">3dm</a>
                <a href="#" @click.prevent="loadExample('cubes.3ds', ['texture.png'])">3ds</a>
                <a href="#" @click.prevent="loadExample('rhombicuboctahedron.3mf')">3mf</a>
                <a href="#" @click.prevent="loadExample('rook.amf')">amf</a>
                <a href="#" @click.prevent="loadExample('MultipleMeshes.bim')">bim</a>
                <a href="#" @click.prevent="loadExample('as1_pe_203.brep')">brep</a>
                <a href="#" @click.prevent="loadExample('X_Bot.dae')">dae</a>
                <a href="#" @click.prevent="loadExample('Y_Bot.fbx')">fbx</a>
                <a href="#" @click.prevent="loadExample('ArchDetail.FCStd')">fcstd</a>
                <a href="#" @click.prevent="loadExample('DamagedHelmet.glb')">gltf</a>
                <a href="#" @click.prevent="loadExample('haus.ifc')">ifc</a>
                <a href="#" @click.prevent="loadExample('as1_pe_203.igs')">iges</a>
                <a href="#" @click.prevent="loadExample('as1_pe_203.stp')">step</a>
                <a href="#" @click.prevent="loadExample('utah_teapot.stl')">stl</a>
                <a href="#" @click.prevent="loadExample('solids.obj', ['solids.mtl'])">obj</a>
                <a href="#" @click.prevent="loadExample('cube.off')">off</a>
                <a href="#" @click.prevent="loadExample('cow.ply')">ply</a>
                <a href="#" @click.prevent="loadExample('extrusion3.wrl')">wrl</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="ModelViewerPage">
import { onBeforeUnmount } from 'vue'
import './styles/o3dv-fixes.css'
import { useO3dvViewer, syncCardTheme, loadExampleModel, useSystemThemeSync, initThemeAfterReady } from './composables/useO3dvViewer.js'
import { applyDisabledButtons, addHomeButton, addViewButtons, moveFileNameToSnapshot, hideTooltip } from './composables/useToolbarCustomize.js'
import { applyClearEdges, fixGarbledModelNames, restartWithIntro, setSolidWorksDefaultView, setDefaultOrthographic } from './composables/useModelDisplay.js'
import { initAxisIndicator, updateAxisIndicatorTheme, disposeAxisIndicator } from './composables/useAxisIndicator.js'
import { initCalcPanel, updateCalcVolume } from './composables/useCalcPanel.js'

// 加载示例模型（模板 intro 链接直接调用）
const loadExample = loadExampleModel

// 系统主题同步（含 tooltip 清理回调）
const themeSync = useSystemThemeSync(hideTooltip)

// 模型加载完成后的统一处理（仅处理模型数据相关；界面定制在工具栏就绪时完成）
function handleModelLoaded() {
  applyClearEdges()
  setDefaultOrthographic()
  setSolidWorksDefaultView(false) // 初始加载直接到位，不播放过渡动画
  fixGarbledModelNames()
  updateCalcVolume() // 计算面板：重新计算体积 / 质量
  setTimeout(() => {
    initAxisIndicator() // 左下角 XYZ 坐标轴指示器（延迟一帧等模型就绪）
  }, 50)
}

// 恢复模型和坐标系的默认显示样式（正交投影 + SolidWorks 初始等轴测视角）
function restoreDefaultView() {
  setDefaultOrthographic()
  setSolidWorksDefaultView()
}

// 工具栏就绪后的统一处理（界面定制只做一次）
function handleToolbarReady() {
  applyDisabledButtons()
  addHomeButton(restartWithIntro)
  addViewButtons(restoreDefaultView)
  moveFileNameToSnapshot()
  initCalcPanel() // 左侧导航器"计算"面板
}

// 主题切换：同步卡片背景 + 坐标轴文字颜色
function handleThemeChanged(label) {
  syncCardTheme(label)
  updateAxisIndicatorTheme()
}

// O3DV 查看器（事件回调 + 生命周期，内部自动注册 onMounted/onBeforeUnmount）
useO3dvViewer({
  onModelLoaded: handleModelLoaded,
  onThemeChanged: handleThemeChanged,
  onToolbarReady: handleToolbarReady
})

// O3DV 就绪后初始化系统主题跟随（禁用按钮后主题由系统控制）
initThemeAfterReady(() => themeSync.init())

onBeforeUnmount(() => {
  themeSync.dispose()
  disposeAxisIndicator()
})
</script>

<style scoped lang="less">
.model-card-page {
  width: 100%;
  /* app-main 是 border-box + padding-bottom 52px（给页脚让位）：
     百分比高度以父的 content 高度（632px）为基准，height:100% 填满内容区，
     卡片底部停在页脚上方（约 20px 空隙含 padding），不会被 fixed 页脚遮挡，
     左右面板底部的按钮（Meshes 列表、Reset to Default 等）完整可见。 */
  height: 100%;
  padding: 8px !important;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
}
/* 模型卡片：无圆角边框容器，内部承载完整 3dviewer.net 界面 */
.model-card {
  width: 100%;
  height: 100%;
  border: 1px solid var(--el-border-color);
  border-radius: 0;
  overflow: hidden;
  /* 跟随 O3DV 主题（--ov_background_color 由 O3DV 主题切换写入 .o3dv-root） */
  background: var(--ov_background_color, #fff);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  position: relative;
}

/* 暗色主题下卡片背景跟随 */
html.dark .model-card {
  background: #2a2b2e;
  border-color: #4a4a4f;
}

/* O3DV 界面需要占满卡片 */
.model-card :deep(.o3dv-root) {
  width: 100%;
  height: 100%;
}
</style>
