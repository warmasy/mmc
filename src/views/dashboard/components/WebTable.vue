<template>
  <el-card class="activeCard" :body-style="{ padding: '0px' }" style="margin-top: 16px;">
    <template #header>
      <div class="card-header"><span>当前网址</span></div>
    </template>
    <el-table :data="webNotice" class="site-table">
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column label="网址" min-width="200" align="center">
        <template #default="scope">
          <span class="table-url">{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台" prop="lab" width="120" align="center" />
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button type="primary" link size="small" icon="CopyDocument" @click="copyUrl(scope.row.url, scope.row.lab)">复制</el-button>
          <el-button type="success" link size="small" icon="TopRight" @click="openWebsite(scope.row.url)">跳转</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { webNotice } from '../data';

function openWebsite(url) {
  if (url) window.open(url, '_blank');
}

function copyUrl(url, name) {
  if (!url) { ElMessage.warning('网址为空，无法复制'); return; }
  navigator.clipboard.writeText(url).then(() => {
    ElMessage.success(`已复制 ${name} 的网址`);
  }).catch(() => {
    const input = document.createElement('input');
    input.value = url;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    ElMessage.success(`已复制 ${name} 的网址`);
  });
}
</script>

<style scoped lang="less">
.card-header { display: flex; justify-content: space-between; align-items: center; font-weight: 500; }
.site-table { width: 100%; }
.site-table :deep(.el-table__header-wrapper th) { font-weight: 500; }
.site-table :deep(.el-table__row td) { border-bottom: 1px solid var(--el-border-color-lighter); }
</style>
