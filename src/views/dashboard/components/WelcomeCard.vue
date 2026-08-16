<template>
  <el-card class="welcome-card" :body-style="{ padding: '2px 4px' }">
    <div class="pageHeaderContent">
      <div class="avatar">
        <el-avatar size="large" :src="currentUser.avatar" />
      </div>
      <div class="content">
        <div class="contentTitle">
          早安，{{ currentUser.name }}，祝你开心每一天！
        </div>
        <div>{{ currentUser.title }} | {{ currentUser.group }}</div>
      </div>
      <div class="blog-link" @click="openWebsite(blogAvatar.href)">
        <el-avatar size="large" :src="blogAvatar.url" />
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { currentUser, blogAvatar } from '../data';

function openWebsite(url) {
  if (url) window.open(url, '_blank');
}
</script>

<style scoped lang="less">
.welcome-card { margin-bottom: 2px; border-radius: 0; box-shadow: none; }

.pageHeaderContent {
  display: flex;
  align-items: center;
  .avatar {
    flex: 0 1 72px;
    & > span { display: block; width: 72px; height: 72px; border-radius: 72px; background-color: #ffffff !important; }
  }
  .content {
    position: relative; top: 4px;
    flex: 1 1 auto; margin-left: 12px;
    color: #000000; line-height: 22px;
    .contentTitle { margin-bottom: 6px; color: var(--el-text-color-primary); font-weight: 500; font-size: 20px; line-height: 28px; }
  }
  .blog-link {
    display: flex; align-items: center; margin-left: auto; cursor: pointer; padding: 0 8px;
    & > span { display: block; width: 72px; height: 72px; border-radius: 72px; background-color: #ffffff !important; }
  }
}

@media screen and (max-width: 576px) {
  .pageHeaderContent { display: block; .content { margin-left: 0; } }
}
</style>
