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

      <div class="info-item">
        <span class="info-label">体积</span>
        <span class="info-value highlight">{{ formatVolume(data.volumeMm3) }}</span>
      </div>

      <div class="info-item">
        <span class="info-label">密度</span>
        <span class="info-value">{{ data.density }} kg/m³</span>
      </div>

      <div class="info-item">
        <span class="info-label">质量</span>
        <span class="info-value highlight">{{ formatMass(data.massKg) }}</span>
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
import { computed } from 'vue'
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

function formatVolume(mm3) {
  if (mm3 == null) return '-'
  if (mm3 >= 1e9) return (mm3 / 1e9).toFixed(6) + ' m³'
  if (mm3 >= 1e6) return (mm3 / 1e6).toFixed(4) + ' dm³'
  if (mm3 >= 1e3) return (mm3 / 1e3).toFixed(2) + ' cm³'
  return mm3.toFixed(2) + ' mm³'
}

function formatMass(kg) {
  if (kg == null) return '-'
  if (kg >= 1000) return (kg / 1000).toFixed(4) + ' t'
  if (kg >= 1) return kg.toFixed(4) + ' kg'
  return (kg * 1000).toFixed(2) + ' g'
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
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  padding-bottom: 6px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  margin-bottom: 6px;
  flex-shrink: 0;
}

.no-data {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-placeholder);
  gap: 6px;
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
  margin-top: 8px;
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
  color: var(--el-text-color-secondary);
  flex-shrink: 0;
  margin-right: 6px;
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
  color: var(--el-color-primary);
  font-weight: 600;
}

.info-actions {
  margin-top: auto;
  padding-top: 4px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.info-actions .el-button {
  flex: 1;
  min-width: 0;
}
</style>
