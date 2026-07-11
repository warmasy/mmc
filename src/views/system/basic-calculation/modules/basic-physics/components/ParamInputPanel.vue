<template>
  <fieldset class="param-fieldset">
    <legend>
      <span class="legend-title">{{ title }}</span>
    </legend>
    <span v-if="statusText" class="status-text">{{ statusText }}</span>
    <div class="param-section">
      <div class="param-row" v-for="(param, key) in params" :key="key">
        <span class="param-label">{{ param.name }}</span>
        <NumberInput
          v-model="modelValue[key]"
          :step="param.step || 1"
          :precision="param.precision || 4"
          :width="120"
          :min="param.min !== undefined ? param.min : 0"
          @change="$emit('change')"
        />
        <span class="param-unit">{{ param.unit }}</span>
      </div>
    </div>
    <div class="calc-btn-wrapper">
      <el-button
        class="bottom-calc-btn"
        type="primary"
        size="small"
        @click="$emit('calculate')"
        :loading="calculating"
      >
        <el-icon><Cpu /></el-icon>
        <span>计算</span>
      </el-button>
    </div>
  </fieldset>
</template>

<script setup>
import NumberInput from '@/components/NumberInput/index.vue'
import { Cpu } from '@element-plus/icons-vue'

const props = defineProps({
  title: { type: String, default: '' },
  params: { type: Object, default: () => ({}) },
  modelValue: { type: Object, default: () => ({}) },
  calculating: { type: Boolean, default: false },
  statusText: { type: String, default: '' }
})

defineEmits(['change', 'update:modelValue', 'calculate'])
</script>

<style scoped lang="less">
.param-fieldset {
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  padding: 6px 12px 0 12px;
  margin: 0;
  background-color: var(--el-bg-color);
  flex-shrink: 0;
  position: relative;
}

.param-fieldset legend {
  font-weight: bold;
  color: var(--el-text-color-primary);
  padding: 0 6px;
  font-size: 13px;
}

.legend-title {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background-color: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.status-text {
  position: absolute;
  top: -16px;
  right: 12px;
  transform: translateY(-30%);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 500;
  color: var(--el-color-primary);
  background-color: var(--el-fill-color-light);
  border: 1px solid var(--el-color-primary-light-7);
  border-radius: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  z-index: 1;
}

.status-text::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  background-color: var(--el-color-primary);
  border-radius: 50%;
  flex-shrink: 0;
}

.param-section {
  padding: 2px 0 0 0;
  flex-shrink: 0;
}

.param-row {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-right: 20px;
  margin-bottom: 6px;
}

.param-label {
  font-size: 13px;
  color: var(--el-text-color-regular);
  font-weight: 500;
  white-space: nowrap;
}

.param-unit {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}

.calc-btn-wrapper {
  display: flex;
  justify-content: flex-end;
  padding-top: 2px;
  padding-right: 4px;
  margin-bottom: -8px;
}

.bottom-calc-btn {
  display: inline-flex;
  align-items: center;
  padding: 1px 6px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
  height: auto;
  line-height: 1.2;
}

.bottom-calc-btn :deep(.el-icon) {
  margin-right: 3px;
}

@media screen and (max-width: 768px) {
  .param-row {
    display: flex;
    width: 100%;
    margin-right: 0;
  }
}
</style>
