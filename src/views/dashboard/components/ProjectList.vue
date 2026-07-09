<template>
  <el-card class="projectList" :body-style="{ padding: '0px' }">
    <template #header>
      <div class="card-header">
        <span>进行中的项目</span>
        <a href="" target="_blank" rel="noopener noreferrer">
          <span style="color: var(--el-color-primary)">全部项目</span>
        </a>
      </div>
    </template>
    <div class="project-grid-wrapper">
      <div v-for="item in projectNotice" :key="item.id" class="projectGrid">
        <div class="grid-inner">
          <div class="card-meta">
            <div class="cardTitle">
              <el-avatar size="small" :src="item.logo" />
              <a :href="item.href" target="_blank" rel="noopener noreferrer">{{ item.title }}</a>
            </div>
            <div class="meta-description">{{ item.description }}</div>
          </div>
          <div class="projectItemContent">
            <a :href="item.memberLink" target="_blank" rel="noopener noreferrer">{{ item.member || "" }}</a>
            <span class="datetime" :title="item.updatedAt">{{ item.updatedAt }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { projectNotice } from '../data';
</script>

<style scoped lang="less">
.card-header { display: flex; justify-content: space-between; align-items: center; font-weight: 500; }

.projectList {
  .project-grid-wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border-top: 1px solid var(--el-border-color-lighter);
    border-left: 1px solid var(--el-border-color-lighter);
  }
  .projectGrid {
    border-right: 1px solid var(--el-border-color-lighter);
    border-bottom: 1px solid var(--el-border-color-lighter);
    box-sizing: border-box;
  }
  .grid-inner { padding: 20px; }
  .meta-description { height: 44px; overflow: hidden; color: var(--el-text-color-secondary); line-height: 22px; margin-top: 8px; }
  .cardTitle {
    font-size: 0;
    :deep(.el-avatar) { background-color: #ffffff !important; }
    a { display: inline-block; height: 24px; margin-left: 12px; color: var(--el-text-color-primary); font-size: 14px; line-height: 24px; vertical-align: top; &:hover { color: var(--el-color-primary); } }
  }
  .projectItemContent {
    display: flex; flex-basis: 100%; height: 20px; margin-top: 16px; overflow: hidden; font-size: 12px; line-height: 20px;
    a { display: inline-block; flex: 1 1 0; color: var(--el-text-color-secondary); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; word-break: break-all; &:hover { color: var(--el-color-primary); } }
    .datetime { flex: 0 0 auto; float: right; color: var(--el-text-color-placeholder); }
  }
}

@media screen and (max-width: 1200px) {
  .projectList .project-grid-wrapper { grid-template-columns: repeat(2, 1fr); }
}

@media screen and (max-width: 768px) {
  .projectList .project-grid-wrapper { grid-template-columns: 1fr; }
}
</style>
