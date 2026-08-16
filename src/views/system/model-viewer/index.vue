<template>
  <div class="app-container model-viewer-page">
    <!-- 主体内容 -->
    <el-row :gutter="2" class="viewer-row">
      <!-- 左侧：信息 + 控制 + 说明 -->
      <el-col :span="5" :xs="24" class="left-col">
        <!-- 上区域：模型信息 -->
        <el-card class="left-card info-card" :body-style="{ padding: '2px', height: '100%' }">
          <ModelInfoPanel
            :data="modelInfo"
            @select-file="triggerFileSelect"
            @clear-model="handleClearModel"
          />
        </el-card>

        <!-- 中区域：参数调整 -->
        <el-card class="left-card control-card" :body-style="{ padding: '2px', height: '100%' }">
          <ViewerControls
            v-model="coordSystem"
            v-model:wireframe="wireframe"
            v-model:density="density"

          />
        </el-card>

        <!-- 下区域：说明 -->
        <el-card class="left-card note-card" :body-style="{ padding: '2px', height: '100%' }">
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
      <el-col :span="19" :xs="24" class="right-col">
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
import { ElMessage } from 'element-plus'
import { InfoFilled, Check, Warning } from '@element-plus/icons-vue'
import ModelInfoPanel from './components/ModelInfoPanel.vue'
import ViewerControls from './components/ViewerControls.vue'
import ModelViewer3D from './components/ModelViewer3D.vue'

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
  // projectName 已移除
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
  box-sizing: border-box;
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
  gap: 1px;
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.left-col::-webkit-scrollbar {
  display: none;
}

.left-card {
  border-radius: 0;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    flex: 1;
    overflow: hidden;
    padding: 2px !important;
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
  gap: 1px;
  font-size: 13px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  padding-bottom: 1px;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 1px;
  flex-shrink: 0;
}

.note-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.note-item {
  display: flex;
  align-items: flex-start;
  gap: 1px;
  font-size: 11px;
  color: #000000;
  line-height: 1.4;
}

.note-icon {
  flex-shrink: 0;
  margin-top: 1px;
  color: #000000;
}

.right-col {
  height: 100%;
}

.viewer-card {
  border-radius: 0;
  box-shadow: none;
  height: 100%;

  :deep(.el-card__body) {
    height: 100%;
    padding: 0 !important;
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
    margin-bottom: 2px;
  }

  .viewer-row {
    flex-direction: column;
  }
}
</style>
