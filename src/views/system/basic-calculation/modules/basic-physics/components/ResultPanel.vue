<template>
  <div v-if="results.length" class="result-section">
    <div class="result-title">计算结果</div>
    <div class="result-list">
      <div class="result-row" v-for="result in results" :key="result.id">
        <span class="result-name">{{ result.name }}</span>
        <span class="result-value">{{ result.value }} {{ result.unit }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  results: { type: Array, default: () => [] }
})
</script>

<style scoped lang="less">
.result-section {
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  padding: 10px;
  flex-shrink: 0;
}

.result-title {
  font-size: 13px;
  font-weight: bold;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.result-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
}

.result-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.result-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-color-primary);
  font-family: 'Courier New', monospace;
}
</style>
