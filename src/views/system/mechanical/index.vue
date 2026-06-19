<template>
   <div class="app-container profile-page">
      <el-row :gutter="20" class="profile-row">
         <el-col :span="6" :xs="24">
            <el-card class="box-card info-card">
               <template v-slot:header>
                 <div class="clearfix">
                   <span>网站信息</span>
                 </div>
               </template>
               <div class="info-content">
                  <div class="text-center">
                     <div class="avatar-box">
                        <img v-if="siteInfo.logo" :src="siteInfo.logo" class="site-logo-img" />
                        <el-avatar v-else :size="120" :src="defaultAvatar" />
                     </div>
                  </div>
                  <ul class="list-group list-group-striped">
                     <li class="list-group-item">
                        <svg-icon icon-class="documentation" />网站名称
                        <div class="pull-right">{{ siteInfo.name }}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="link" />网址
                        <div class="pull-right">{{ siteInfo.url }}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="message" />简介
                        <div class="pull-right">{{ siteInfo.description }}</div>
                     </li>
                  </ul>
                  <div class="info-actions">
                    <el-button type="primary" size="small" icon="CopyDocument" @click="copyUrl(siteInfo.url, siteInfo.name)">复制网址</el-button>
                    <el-button type="success" size="small" icon="TopRight" @click="openWebsite(siteInfo.url)">跳转</el-button>
                  </div>
               </div>
            </el-card>
         </el-col>
         <el-col :span="18" :xs="24">
            <el-card class="tab-card">
               <template v-slot:header>
                 <div class="clearfix">
                   <span>简介</span>
                 </div>
               </template>
               <el-tabs v-model="selectedTab">
                  <el-tab-pane label="所有网站" name="websites">
                     <el-table :data="websiteList" class="site-table">
                        <el-table-column type="index" label="序号" width="80" align="center" />
                        <el-table-column label="网址" min-width="200" align="center">
                           <template #default="scope">
                              <span class="table-url">{{ scope.row.url }}</span>
                           </template>
                        </el-table-column>
                        <el-table-column label="平台" prop="platform" width="120" align="center" />
                        <el-table-column label="操作" width="180" align="center">
                           <template #default="scope">
                              <el-button type="primary" link size="small" icon="CopyDocument" @click="copyUrl(scope.row.url, scope.row.platform)">复制</el-button>
                              <el-button type="success" link size="small" icon="TopRight" @click="openWebsite(scope.row.url)">跳转</el-button>
                           </template>
                        </el-table-column>
                     </el-table>
                  </el-tab-pane>
                  <el-tab-pane label="图片" name="image">
                     <div class="image-full">
                        <el-image
                           :src="imageConfig.url"
                           :preview-src-list="[imageConfig.url]"
                           fit="cover"
                           class="full-image"
                        />
                        <div class="image-caption">{{ imageConfig.caption }}</div>
                     </div>
                  </el-tab-pane>
               </el-tabs>
            </el-card>
         </el-col>
      </el-row>
   </div>
</template>

<script setup name="Mechanical">
import { ElMessage } from 'element-plus'

const defaultAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'

const siteInfo = reactive({
  logo: '/favicon-jx.svg',
  name: '机械计算',
  url: 'https://mech.example.com',
  description: '机械工程常用计算工具平台。'
})

const selectedTab = ref("websites")

// 图片配置对象
const imageConfig = ref({
  url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop',
  caption: '机械工程示意图',
  width: '600px',
  height: '300px'
})

const websiteList = ref([
  { url: 'https://mech.3139822.xyz', platform: '机械计算' },

])

function openWebsite(url) {
  if (url) {
    window.open(url, '_blank')
  }
}

function copyUrl(url, name) {
  if (!url) {
    ElMessage.warning('网址为空，无法复制')
    return
  }
  navigator.clipboard.writeText(url).then(() => {
    ElMessage.success(`已复制 ${name} 的网址`)
  }).catch(() => {
    const input = document.createElement('input')
    input.value = url
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    ElMessage.success(`已复制 ${name} 的网址`)
  })
}
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
.avatar-box {
  margin-bottom: 20px;
  text-align: center;
}
.site-logo-img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  border-radius: 8px;
  background-color: #ffffff;
}
.list-group {
  flex: 1;
  padding-left: 0;
  list-style: none;
  margin: 0;
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
.info-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
}
.tab-card {
  height: 100%;
}
.tab-card :deep(.el-card__body) {
  height: calc(100% - 55px);
}
.tab-card :deep(.el-tabs) {
  height: 100%;
}
.tab-card :deep(.el-tabs__content) {
  height: calc(100% - 50px);
  overflow-y: auto;
}

/* 表格样式（无 hover） */
.site-table {
  width: 100%;
}
.site-table :deep(.el-table__header-wrapper th) {
  font-weight: 500;
}
.site-table :deep(.el-table__row td) {
  border-bottom: 1px solid var(--el-border-color-lighter);
}

/* 图片铺满 */
.image-full {
  width: 100%;
  height: 100%;
  min-height: 400px;
}
.image-full :deep(.el-image) {
  width: 100%;
  height: 100%;
  min-height: 400px;
}
.image-full :deep(.el-image__inner) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.image-caption {
  margin-top: 12px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  text-align: center;
}
</style>