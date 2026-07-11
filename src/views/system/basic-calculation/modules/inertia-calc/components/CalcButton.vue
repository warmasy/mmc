<template>
  <div class="calc-button-row">
    <el-button type="primary" size="default" @click="$emit('click')" :loading="loading">
      <el-icon><Cpu /></el-icon>
      <span>计算</span>
    </el-button>
  </div>
</template>

<script setup>
import { Cpu } from '@element-plus/icons-vue'

defineProps({
  loading: { type: Boolean, default: false }
})
defineEmits(['click'])
</script>

<style scoped lang="less">
.calc-button-row {
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}

.calc-button-row :deep(.el-button) {
  padding: 10px 32px;
  font-size: 14px;
}
</style>
