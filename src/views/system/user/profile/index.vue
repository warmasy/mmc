<template>
   <div class="app-container profile-page">
      <el-row :gutter="20" class="profile-row">
         <el-col :span="6" :xs="24">
            <el-card class="box-card info-card">
               <template v-slot:header>
                 <div class="clearfix">
                   <span>个人信息</span>
                 </div>
               </template>
               <div class="info-content">
                  <div class="text-center">
                     <userAvatar />
                  </div>
                  <ul class="list-group list-group-striped">
                     <li
                       v-for="(item, index) in profileInfoList"
                       :key="index"
                       class="list-group-item"
                     >
                        <svg-icon :icon-class="item.icon" />{{ item.label }}
                        <div class="pull-right">
                          <span
                            v-if="item.type === 'link'"
                            :class="item.className || 'info-link'"
                            @click="openUrl(item.url || item.value)"
                          >
                            {{ item.value }}
                          </span>
                          <span v-else>{{ item.value }}</span>
                        </div>
                     </li>
                  </ul>
               </div>
            </el-card>
         </el-col>
         <el-col :span="18" :xs="24">
            <el-card class="tab-card">
               <template v-slot:header>
                 <div class="clearfix">
                   <span>关于项目</span>
                 </div>
               </template>
               <div class="about-box">
                  <h3>机械计算工具系统</h3>
                  <p class="about-desc">一款面向机械工程师的计算选型工具系统，提供常用机械计算公式、单位换算、电机选型与 3D 模型查看等能力。</p>

                  <div class="about-section">
                     <h4>✨ 核心功能</h4>
                     <ul>
                        <li><b>基本计算</b>：基础物理、转动惯量、单位换算等常用计算模块，配置驱动、即改即用</li>
                        <li><b>电机选型</b>：支持伺服、步进、直线电机的选型计算，包含惯量比、扭矩、转速校核</li>
                        <li><b>3D 模型查看</b>：本地解析 STEP / IGES / BREP 文件，支持剖切、标准视图、体积质量估算</li>
                     </ul>
                  </div>

                  <div class="about-section">
                     <h4>🛠️ 技术栈</h4>
                     <ul>
                        <li>前端：Vue 3 + Vite + Element Plus + Pinia</li>
                        <li>3D 渲染：Three.js + occt-import-js（WASM）</li>
                        <li>安全：请求传输层加密（RSA + AES-GCM 信封）</li>
                     </ul>
                  </div>

                  <div class="about-section">
                     <h4>📌 说明</h4>
                     <ul>
                        <li>计算结果仅供学习参考，请勿用于其它用途</li>
                        <li>项目持续建设中，欢迎反馈建议</li>
                     </ul>
                  </div>
               </div>
            </el-card>
         </el-col>
      </el-row>
   </div>
</template>

<script setup name="Profile">
import userAvatar from "./userAvatar";
import { getUserProfile } from "@/api/system/user";
import { profileInfoList } from "./profileInfo";

const state = reactive({
  user: {},
  roleGroup: {},
  postGroup: {}
});

function getUser() {
  getUserProfile().then(response => {
    state.user = response.data;
    state.roleGroup = response.roleGroup;
    state.postGroup = response.postGroup;
  });
};

function openUrl(url) {
  if (url) {
    window.open(url, '_blank');
  }
}

onMounted(() => {
  getUser()
})
</script>

<style scoped>
.profile-page {
  height: 100%;
}
.profile-row {
  height: 100%;
}
.profile-row > .el-col {
  height: 100%;
}
.info-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.info-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.info-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.list-group {
  flex: 1;
  padding-left: 0;
  list-style: none;
}
.list-group-item {
  display: flex;
  align-items: center;
  padding: 11px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
  font-size: 13px;
}
.list-group-item:last-child {
  border-bottom: none;
}
.list-group-item .svg-icon {
  margin-right: 8px;
  font-size: 16px;
}
.pull-right {
  margin-left: auto;
  color: var(--el-text-color-secondary);
}
.blog-url {
  cursor: pointer;
}
.blog-url:hover {
  text-decoration: underline;
}
.info-link {
  cursor: pointer;
  color: var(--el-color-primary);
}
.info-link:hover {
  text-decoration: underline;
}
.tab-card {
  height: 100%;
}
.tab-card :deep(.el-card__body) {
  height: calc(100% - 55px);
  overflow-y: auto;
}
.about-box {
  padding: 10px 20px 20px;
}
.about-box h3 {
  font-size: 20px;
  color: var(--el-color-primary);
  margin: 0 0 10px;
  font-weight: 600;
}
.about-desc {
  font-size: 14px;
  line-height: 1.8;
  color: var(--el-text-color-regular);
  margin: 0 0 16px;
}
.about-section {
  margin-bottom: 14px;
}
.about-section h4 {
  font-size: 15px;
  color: var(--el-text-color-primary);
  margin: 0 0 6px;
  font-weight: 600;
}
.about-section ul {
  padding-left: 20px;
  margin: 0;
}
.about-section li {
  font-size: 13px;
  line-height: 2;
  color: var(--el-text-color-regular);
}
.about-section b {
  color: var(--el-text-color-primary);
}
</style>
