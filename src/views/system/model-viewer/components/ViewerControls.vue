<template>
  <div class="viewer-controls">
    <div class="panel-header">
      <el-icon :size="16"><Setting /></el-icon>
      <span>参数调整</span>
    </div>

    <div class="control-section">
      <div class="section-title">坐标系</div>
      <div class="coord-buttons">
        <el-button
          v-for="opt in coordOptions"
          :key="opt.value"
          size="small"
          :type="modelValue === opt.value ? 'primary' : 'default'"
          @click="emit('update:modelValue', opt.value)"
        >
          {{ opt.label }}
        </el-button>
      </div>
    </div>

    <el-divider />

    <div class="control-section">
      <div class="section-title">操作</div>
      <div class="action-buttons">
        <el-button
          size="small"
          :type="wireframe ? 'primary' : 'default'"
          @click="emit('update:wireframe', !wireframe)"
        >
          <el-icon><Connection /></el-icon>
          {{ wireframe ? '实体模式' : '线框模式' }}
        </el-button>
        <el-button
          size="small"
          type="default"
          @click="emit('reset-view')"
        >
          <el-icon><RefreshRight /></el-icon>
          重置视角
        </el-button>
      </div>
    </div>

    <el-divider />

    <div class="control-section">
      <div class="section-title">材料密度</div>
      <div class="density-row">
        <el-input-number
          v-model="localDensity"
          size="small"
          :min="100"
          :max="25000"
          :step="100"
          :controls="true"
          style="width: 120px"
          @change="emit('update:density', localDensity)"
        />
        <span class="density-unit">kg/m³</span>
      </div>
      <div class="density-presets">
        <el-tag
          v-for="preset in densityPresets"
          :key="preset.name"
          size="small"
          :type="isActivePreset(preset.value) ? 'primary' : 'info'"
          class="density-tag"
          @click="selectPreset(preset.value)"
        >
          {{ preset.name }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Setting, Connection, RefreshRight } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: { type: String, default: 'y-up' },
  wireframe: { type: Boolean, default: false },
  density: { type: Number, default: 7800 }
})

const emit = defineEmits([
  'update:modelValue',
  'update:wireframe',
  'update:density',
  'reset-view'
])

const coordOptions = [
  { label: 'Y-up', value: 'y-up' },
  { label: 'Z-up', value: 'z-up' },
  { label: 'X-up', value: 'x-up' }
]

const densityPresets = [
  { name: '钢', value: 7850 },
  { name: '铝', value: 2700 },
  { name: '铜', value: 8960 },
  { name: '铁', value: 7874 },
  { name: '钛', value: 4500 },
  { name: '塑料', value: 1200 }
]

const localDensity = ref(props.density)

watch(() => props.density, (val) => {
  localDensity.value = val
})

function isActivePreset(val) {
  return Math.abs(localDensity.value - val) < 50
}

function selectPreset(val) {
  localDensity.value = val
  emit('update:density', val)
}
</script>

<style scoped>
.viewer-controls {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  padding-bottom: 6px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  margin-bottom: 6px;
  flex-shrink: 0;
}

.control-section {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.section-title {
  font-size: 11px;
  color: var(--el-text-color-secondary);
  font-weight: 500;
}

.coord-buttons,
.mode-buttons,
.action-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.coord-buttons .el-button {
  flex: 1;
  min-width: 0;
  padding: 4px 8px;
}

.density-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.density-unit {
  font-size: 11px;
  color: var(--el-text-color-secondary);
}

.density-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.density-tag {
  cursor: pointer;
  transition: all 0.2s;
  padding: 0 6px;
  height: 22px;
  line-height: 20px;
}

.density-tag:hover {
  transform: scale(1.05);
}

.viewer-controls :deep(.el-divider) {
  margin: 5px 0;
}
</style>
