<template>
  <div class="app-container model-viewer-page">
    <!-- 顶部标题栏 -->
    <div class="viewer-header">
      <div class="header-left">
        <span class="header-title">模型查看</span>
        <el-divider direction="vertical" />
        <span class="header-subtitle">STEP / IGES / BREP 在线预览</span>
      </div>
      <div class="header-info">
        <div class="info-item">
          <label>标题：</label>
          <el-input v-model="projectName" placeholder="输入项目名称" size="small" style="width: 160px" />
        </div>
        <div class="info-item">
          <label>编号：</label>
          <el-input v-model="projectNo" placeholder="NO." size="small" style="width: 280px" readonly @click="initProjectNo" />
        </div>
        <div class="info-item">
          <label>日期：</label>
          <el-input :value="currentDate" readonly size="small" style="width: 120px" />
        </div>
      </div>
    </div>

    <!-- 主体内容 -->
    <el-row :gutter="8" class="viewer-row">
      <!-- 左侧：信息 + 控制 + 说明 -->
      <el-col :span="4" :xs="24" class="left-col">
        <!-- 上区域：模型信息 -->
        <el-card class="left-card info-card" :body-style="{ padding: '8px', height: '100%' }">
          <ModelInfoPanel
            :data="modelInfo"
            @select-file="triggerFileSelect"
            @clear-model="handleClearModel"
          />
        </el-card>

        <!-- 中区域：参数调整 -->
        <el-card class="left-card control-card" :body-style="{ padding: '8px', height: '100%' }">
          <ViewerControls
            v-model="coordSystem"
            v-model:wireframe="wireframe"
            v-model:density="density"
            @reset-view="handleResetView"
          />
        </el-card>

        <!-- 下区域：说明 -->
        <el-card class="left-card note-card" :body-style="{ padding: '8px', height: '100%' }">
          <div class="note-panel">
            <div class="note-header">
              <el-icon :size="14"><InfoFilled /></el-icon>
              <span>使用说明</span>
            </div>
            <div class="note-content">
              <div class="note-item">
                <el-icon :size="12" class="note-icon"><Check /></el-icon>
                <span>本地加载，不上传服务器</span>
              </div>
              <div class="note-item">
                <el-icon :size="12" class="note-icon"><Check /></el-icon>
                <span>支持 STEP / IGES / BREP 格式</span>
              </div>
              <div class="note-item">
                <el-icon :size="12" class="note-icon"><Check /></el-icon>
                <span>基于 occt-import-js 解析</span>
              </div>
              <div class="note-item">
                <el-icon :size="12" class="note-icon"><Check /></el-icon>
                <span>文件大小限制：≤ 100 MB</span>
              </div>
              <div class="note-item">
                <el-icon :size="12" class="note-icon"><Warning /></el-icon>
                <span>体积为近似计算，仅供参考</span>
              </div>
              <div class="note-item">
                <el-icon :size="12" class="note-icon"><Warning /></el-icon>
                <span>模型精度受网格离散度影响</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：3D 查看器 -->
      <el-col :span="20" :xs="24" class="right-col">
        <el-card class="viewer-card" :body-style="{ padding: '0', height: '100%' }">
          <ModelViewer3D
            ref="viewerRef"
            :coord-system="coordSystem"
            :wireframe="wireframe"
            :density="density"
            @model-loaded="handleModelLoaded"
            @model-error="handleModelError"
            @volume-calculated="handleVolumeCalculated"
            @size-calculated="handleSizeCalculated"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="ModelViewer">
import { ref, watch } from 'vue'
import { generateUUID } from '@/utils'
import { ElMessage } from 'element-plus'
import { InfoFilled, Check, Warning } from '@element-plus/icons-vue'
import ModelInfoPanel from './components/ModelInfoPanel.vue'
import ViewerControls from './components/ViewerControls.vue'
import ModelViewer3D from './components/ModelViewer3D.vue'

// ==================== 公共信息 ====================
const currentDate = ref(new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}))
const projectName = ref('')
const projectNo = ref('')

function initProjectNo() {
  projectNo.value = generateUUID()
}
initProjectNo()

// ==================== 3D 查看器状态 ====================
const viewerRef = ref(null)
const coordSystem = ref('y-up')
const wireframe = ref(false)
const density = ref(7800)

// 监听密度变化，实时更新质量
watch(density, (newVal) => {
  if (modelInfo.value && modelInfo.value.volumeMm3) {
    const volumeM3 = modelInfo.value.volumeMm3 / 1e9
    modelInfo.value = {
      ...modelInfo.value,
      density: newVal,
      massKg: volumeM3 * newVal
    }
  }
})

// ==================== 模型信息 ====================
const modelInfo = ref({})

// ==================== 事件处理 ====================
function handleModelLoaded({ fileName }) {
  if (projectName.value === '') {
    projectName.value = fileName.replace(/\.[^/.]+$/, '')
  }
}

function handleModelError(err) {
  modelInfo.value = {}
}

function handleVolumeCalculated(data) {
  modelInfo.value = { ...modelInfo.value, ...data }
}

function handleSizeCalculated(data) {
  modelInfo.value = { ...modelInfo.value, ...data }
}

function handleResetView() {
  viewerRef.value?.resetView()
}

function handleClearModel() {
  viewerRef.value?.restoreDefaultModel()
  ElMessage.info('已恢复默认模型')
}

function triggerFileSelect() {
  viewerRef.value?.triggerFileSelect()
}
</script>

<style scoped lang="less">
.model-viewer-page {
  height: calc(100vh - 84px - 48px); /* 减去 Navbar+TagsView + 底部版权 */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 12px;
  box-sizing: border-box;
}

// 顶部标题栏
.viewer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  margin-bottom: 8px;
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
  color: var(--el-text-color-primary);
}

.header-subtitle {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.header-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--el-text-color-regular);

  label {
    color: var(--el-text-color-secondary);
    white-space: nowrap;
  }
}

// 主体行
.viewer-row {
  flex: 1;
  min-height: 0;

  > .el-col {
    height: 100%;
  }
}

.left-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.left-col::-webkit-scrollbar {
  display: none;
}

.left-card {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    flex: 1;
    overflow: hidden;
    padding: 8px !important;
  }
}

.info-card {
  flex: 0 0 auto;
}

.control-card {
  flex: 0 0 auto;
}

.note-card {
  flex: 0 0 auto;
}

// 说明面板
.note-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.note-header {
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

.note-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.note-item {
  display: flex;
  align-items: flex-start;
  gap: 5px;
  font-size: 11px;
  color: var(--el-text-color-regular);
  line-height: 1.4;
}

.note-icon {
  flex-shrink: 0;
  margin-top: 1px;
  color: var(--el-color-primary);
}

.right-col {
  height: 100%;
}

.viewer-card {
  height: 100%;

  :deep(.el-card__body) {
    height: 100%;
  }
}

// 响应式
@media (max-width: 768px) {
  .viewer-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .left-col {
    height: auto;
    min-height: 300px;
    margin-bottom: 10px;
  }

  .viewer-row {
    flex-direction: column;
  }
}
</style>
