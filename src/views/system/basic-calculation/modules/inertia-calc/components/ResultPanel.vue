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
  background-color: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 2px;
  flex-shrink: 0;
}

.result-title {
  font-size: 13px;
  font-weight: bold;
  color: var(--el-text-color-primary);
  margin-bottom: 2px;
  padding-bottom: 2px;
  border-bottom: 1px solid #e8e8e8;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.result-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1px 2px;
  background-color: #ffffff;
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
  color: #000000;
  font-family: 'Courier New', monospace;
}
</style>
