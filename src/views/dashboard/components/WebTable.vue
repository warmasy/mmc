<template>
  <el-card class="activeCard" :body-style="{ padding: '0px' }" style="margin-top: 2px;">
    <template #header>
      <div class="card-header"><span>当前网址</span></div>
    </template>
    <base-table :data="webNotice" :columns="columns">
      <template #url="{ row }">
        <span class="table-url">{{ row.url }}</span>
      </template>
      <template #action="{ row }">
        <el-button type="primary" link size="small" icon="CopyDocument" @click="copyUrl(row.url, row.lab)">复制</el-button>
        <el-button type="success" link size="small" icon="TopRight" @click="openWebsite(row.url)">跳转</el-button>
      </template>
    </base-table>
  </el-card>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { webNotice } from '../data';

// 表格列配置
const columns = [
  { type: 'index', label: '序号', width: 80 },
  { label: '网址', minWidth: 200, slot: 'url' },
  { label: '平台', prop: 'lab', width: 120 },
  { label: '操作', width: 180, slot: 'action' }
];

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
.activeCard { border-radius: 0; box-shadow: none; }
</style>
