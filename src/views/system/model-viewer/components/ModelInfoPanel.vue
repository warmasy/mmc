<template>
  <div class="model-info-panel">
    <div class="panel-header">
      <el-icon :size="16"><Document /></el-icon>
      <span>模型信息</span>
    </div>

    <div v-if="!hasData" class="no-data">
      <el-icon :size="32" class="no-data-icon"><Box /></el-icon>
      <p>暂无模型</p>
      <p class="no-data-hint">请上传 STEP/STP 文件</p>
      <el-button size="small" type="primary" :icon="FolderOpened" @click="emit('select-file')" class="no-data-btn">
        选择文件
      </el-button>
    </div>

    <div v-else class="info-list">
      <div class="info-item">
        <span class="info-label">文件名称</span>
        <span class="info-value file-name" :title="data.fileName">{{ data.fileName }}</span>
      </div>

      <div class="info-item unit-row" @wheel.prevent="handleVolumeWheel" title="滚动切换单位">
        <span class="info-label">体积</span>
        <span class="info-value highlight">
          {{ formatVolume(data.volumeMm3) }} {{ getVolumeUnitLabel() }}
        </span>
      </div>

      <div class="info-item unit-row" @wheel.prevent="handleDensityWheel" title="滚动切换单位">
        <span class="info-label">密度</span>
        <span class="info-value highlight">
          {{ formatDensity(data.density) }} {{ getDensityUnitLabel() }}
        </span>
      </div>

      <div class="info-item unit-row" @wheel.prevent="handleMassWheel" title="滚动切换单位">
        <span class="info-label">质量</span>
        <span class="info-value highlight">
          {{ formatMass(data.massKg) }} {{ getMassUnitLabel() }}
        </span>
      </div>

      <div class="info-item">
        <span class="info-label">尺寸</span>
        <span class="info-value">{{ formatSize(data.sizeX) }}×{{ formatSize(data.sizeY) }}×{{ formatSize(data.sizeZ) }}</span>
      </div>

      <div class="info-item">
        <span class="info-label">最大边长</span>
        <span class="info-value">{{ formatSize(data.maxDim) }} mm</span>
      </div>

      <div class="info-item">
        <span class="info-label">网格/顶点/面</span>
        <span class="info-value">{{ data.meshCount }} / {{ data.totalVertices?.toLocaleString() }} / {{ data.totalFaces?.toLocaleString() }}</span>
      </div>

      <!-- 底部操作按钮 -->
      <div class="info-actions">
        <el-button size="small" type="primary" :icon="FolderOpened" @click="emit('select-file')">
          选择文件
        </el-button>
        <el-button size="small" type="danger" plain :icon="Delete" @click="emit('clear-model')">
          清除模型
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Document, Box, FolderOpened, Delete } from '@element-plus/icons-vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['select-file', 'clear-model'])

const hasData = computed(() => {
  return props.data && props.data.fileName
})

// 单位状态（默认：体积cm³，密度g/cm³，质量g）
const volumeUnit = ref('cm3')
const densityUnit = ref('g_cm3')
const massUnit = ref('g')

const volumeUnits = ['mm3', 'cm3', 'dm3', 'm3']
const densityUnits = ['kg_m3', 'g_cm3']
const massUnits = ['g', 'kg']

function handleVolumeWheel(e) {
  const idx = volumeUnits.indexOf(volumeUnit.value)
  if (e.deltaY > 0) {
    volumeUnit.value = volumeUnits[(idx + 1) % volumeUnits.length]
  } else {
    volumeUnit.value = volumeUnits[(idx - 1 + volumeUnits.length) % volumeUnits.length]
  }
}

function handleDensityWheel(e) {
  const idx = densityUnits.indexOf(densityUnit.value)
  if (e.deltaY > 0) {
    densityUnit.value = densityUnits[(idx + 1) % densityUnits.length]
  } else {
    densityUnit.value = densityUnits[(idx - 1 + densityUnits.length) % densityUnits.length]
  }
}

function handleMassWheel(e) {
  const idx = massUnits.indexOf(massUnit.value)
  if (e.deltaY > 0) {
    massUnit.value = massUnits[(idx + 1) % massUnits.length]
  } else {
    massUnit.value = massUnits[(idx - 1 + massUnits.length) % massUnits.length]
  }
}

function getVolumeUnitLabel() {
  const map = { mm3: 'mm³', cm3: 'cm³', dm3: 'dm³', m3: 'm³' }
  return map[volumeUnit.value]
}

function getDensityUnitLabel() {
  const map = { kg_m3: 'kg/m³', g_cm3: 'g/cm³' }
  return map[densityUnit.value]
}

function getMassUnitLabel() {
  const map = { g: 'g', kg: 'kg' }
  return map[massUnit.value]
}

function formatVolume(mm3) {
  if (mm3 == null) return '-'
  const unit = volumeUnit.value
  if (unit === 'mm3') return mm3.toFixed(2)
  if (unit === 'cm3') return (mm3 / 1e3).toFixed(2)
  if (unit === 'dm3') return (mm3 / 1e6).toFixed(4)
  if (unit === 'm3') return (mm3 / 1e9).toFixed(6)
  return mm3.toFixed(2)
}

function formatDensity(kg_m3) {
  if (kg_m3 == null) return '-'
  const unit = densityUnit.value
  if (unit === 'kg_m3') return kg_m3.toFixed(0)
  if (unit === 'g_cm3') return (kg_m3 / 1000).toFixed(2)
  return kg_m3.toFixed(0)
}

function formatMass(kg) {
  if (kg == null) return '-'
  const unit = massUnit.value
  if (unit === 'g') return (kg * 1000).toFixed(2)
  if (unit === 'kg') return kg.toFixed(4)
  return (kg * 1000).toFixed(2)
}

function formatSize(mm) {
  if (mm == null) return '-'
  return mm.toFixed(2)
}
</script>

<style scoped>
.model-info-panel {
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

.no-data {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #000000;
  gap: 2px;
}

.no-data-icon {
  opacity: 0.3;
}

.no-data p {
  font-size: 12px;
  margin: 0;
}

.no-data-hint {
  font-size: 11px;
  opacity: 0.7;
}

.no-data-btn {
  margin-top: 2px;
}

.info-list {
  flex: 1;
  overflow: visible;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.info-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1px 0;
  font-size: 11px;
  line-height: 1.25;
}

.info-label {
  color: #000000;
  flex-shrink: 0;
  margin-right: 2px;
  white-space: nowrap;
  padding-top: 1px;
}

.info-value {
  color: var(--el-text-color-primary);
  text-align: right;
  word-break: break-all;
  line-height: 1.3;
}

.info-value.file-name {
  max-width: 160px;
  word-break: break-all;
  white-space: normal;
}

.info-value.highlight {
  color: #409EFF !important;
  font-weight: 600;
}

.info-actions {
  margin-top: auto;
  padding-top: 1px;
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
}

.info-actions .el-button {
  flex: 1;
  min-width: 0;
}

.unit-row {
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;
}

.unit-row:hover {
  background: var(--el-fill-color-light);
  border-radius: 3px;
}
</style>
