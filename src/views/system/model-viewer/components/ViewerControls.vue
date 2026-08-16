<template>
  <div class="viewer-controls">
    <div class="panel-header">
      <el-icon :size="16"><Setting /></el-icon>
      <span>参数调整</span>
    </div>

    <div class="control-section">
      <div class="section-title">操作</div>
      <div class="action-buttons">
        <el-button
          size="small"
          :type="wireframe ? 'default' : 'primary'"
          @click="emit('update:wireframe', !wireframe)"
        >
          <el-icon><Connection /></el-icon>
          {{ wireframe ? '线框模式' : '实体模式' }}
        </el-button>
      </div>
    </div>

    <el-divider />

    <div class="control-section">
      <div class="density-row">
        <span class="density-label">材料密度</span>
        <NumberInput
          :modelValue="displayDensity"
          :step="densityUnit === 'kg_m3' ? 100 : 0.1"
          :min="densityUnit === 'kg_m3' ? 100 : 0.1"
          :max="densityUnit === 'kg_m3' ? 25000 : 25"
          :precision="densityUnit === 'kg_m3' ? 0 : 2"
          width="70"
          align="center"
          @update:modelValue="onDensityInput"
        />
        <span class="density-unit" @wheel.prevent="handleDensityUnitWheel" title="滚动切换单位">{{ densityUnitLabel }}</span>
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
import { ref, watch, computed } from 'vue'
import { Setting, Connection } from '@element-plus/icons-vue'
import NumberInput from '@/components/NumberInput/index.vue'

const props = defineProps({
  modelValue: { type: String, default: 'y-up' },
  wireframe: { type: Boolean, default: false },
  density: { type: Number, default: 7800 }
})

const emit = defineEmits([
  'update:modelValue',
  'update:wireframe',
  'update:density'
])

const densityPresets = [
  { name: '钢', value: 7850 },
  { name: '铝', value: 2700 },
  { name: '铜', value: 8960 },
  { name: '铁', value: 7874 },
  { name: '钛', value: 4500 },
  { name: '塑料', value: 1200 }
]

// 实际密度值（始终为 kg/m³，用于计算和传给父组件）
const actualDensity = ref(props.density)
// 显示单位
const densityUnit = ref('kg_m3') // kg/m³ 或 g/cm³

// 显示密度值（根据当前单位换算后的值，用于输入框显示）
const displayDensity = computed(() => {
  if (densityUnit.value === 'kg_m3') return actualDensity.value
  return actualDensity.value / 1000
})

const densityUnitLabel = computed(() => {
  return densityUnit.value === 'kg_m3' ? 'kg/m³' : 'g/cm³'
})

watch(() => props.density, (val) => {
  actualDensity.value = val
})

// 处理输入框数值变化：根据当前单位解析为实际密度（kg/m³）
function onDensityInput(val) {
  if (densityUnit.value === 'kg_m3') {
    actualDensity.value = val
  } else {
    actualDensity.value = val * 1000
  }
  emit('update:density', actualDensity.value)
}

// 单位切换时，数值自动换算，实际密度不变
function handleDensityUnitWheel(e) {
  const oldUnit = densityUnit.value
  densityUnit.value = oldUnit === 'kg_m3' ? 'g_cm3' : 'kg_m3'
}

function isActivePreset(val) {
  return Math.abs(actualDensity.value - val) < 50
}

function selectPreset(val) {
  actualDensity.value = val
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
  gap: 2px;
  font-size: 13px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  padding-bottom: 2px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  margin-bottom: 2px;
  flex-shrink: 0;
}

.control-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-title {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.density-row {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  user-select: none;
}

.density-label {
  font-size: 12px;
  color: var(--el-text-color-primary);
  font-weight: 600;
  white-space: nowrap;
}

.density-unit {
  font-size: 11px;
  color: var(--el-text-color-regular);
  white-space: nowrap;
  min-width: 48px;
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
  margin: 4px 0;
}
</style>
