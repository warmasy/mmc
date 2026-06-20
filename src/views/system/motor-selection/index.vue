<template>
  <div class="app-container motor-selection-page">
    <!-- 顶部标题栏 + 模型选择器 -->
    <div class="calc-header">
      <div class="header-left">
        <span class="header-title">选型工具</span>
        <el-divider direction="vertical" />
        <!-- 模型选择下拉 -->
        <el-dropdown trigger="click" @command="handleModelChange" popper-class="model-dropdown">
          <div class="model-selector">
            <span class="model-name">{{ currentModel.name }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="model in motorModels"
                :key="model.id"
                :command="model.id"
                :class="{ 'is-active': model.id === currentModelId }"
              >
                <div class="dropdown-item-content">
                  <el-icon :size="16" :color="model.color" class="dropdown-icon">
                    <component :is="model.icon" />
                  </el-icon>
                  <div class="dropdown-info">
                    <div class="dropdown-name">{{ model.name }}</div>
                    <div class="dropdown-subtitle">{{ model.subtitle }}</div>
                  </div>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <!-- 公共信息栏 -->
      <div class="header-info">
        <div class="info-item">
          <label>标题：</label>
          <el-input v-model="projectName" placeholder="输入项目名称" size="small" style="width: 160px" />
        </div>
        <div class="info-item">
          <label>编号：</label>
          <el-input v-model="projectNo" placeholder="NO." size="small" style="width: 280px" readonly @click="generateUUID" />
        </div>
        <div class="info-item">
          <label>日期：</label>
          <el-input :value="currentDate" readonly size="small" style="width: 120px" />
        </div>
      </div>
    </div>

    <!-- 模型组件区域 -->
    <div class="model-container">
      <component
        :is="currentModelComponent"
        ref="modelRef"
        v-model:projectName="projectName"
        v-model:projectNo="projectNo"
        @refreshUUID="generateUUID"
      />
    </div>
  </div>
</template>

<script setup name="MotorSelection">
import { markRaw } from 'vue'
import { motorModels, getModelById, getDefaultModel } from './models'

// ==================== 当前日期 ====================
const currentDate = ref(new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}))

// ==================== 模型切换 ====================
const currentModelId = ref(getDefaultModel().id)
const currentModel = computed(() => getModelById(currentModelId.value))
const currentModelComponent = shallowRef(null)
const modelRef = ref(null)

// 加载模型组件
async function loadModelComponent(modelId) {
  const model = getModelById(modelId)
  if (model && model.component) {
    const comp = await model.component()
    currentModelComponent.value = markRaw(comp.default || comp)
  }
}

// 初始化加载默认模型
loadModelComponent(currentModelId.value)

// 切换模型
function handleModelChange(modelId) {
  if (modelId === currentModelId.value) return
  currentModelId.value = modelId
  loadModelComponent(modelId)
}

// ==================== 公共表单数据 ====================
const projectName = ref('')
const projectNo = ref('')

// 生成32位UUID（去掉横线的标准UUID）
function generateUUID() {
  const uuid = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/x/g, () => (Math.random() * 16 | 0).toString(16))
  projectNo.value = uuid
}

// 初始化时生成一个UUID
generateUUID()
</script>

<style scoped>
.motor-selection-page {
  padding: 16px;
  background-color: var(--el-bg-color-page);
  height: calc(100vh - 132px);  /* 84px(Navbar+TagsView) + 48px(底部版权栏) */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* 顶部标题栏 */
.calc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 2px solid var(--el-border-color-darker);
  flex-wrap: wrap;
  gap: 12px;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0;
}

/* 选型工具和模型选择器统一样式 */
.header-title,
.model-selector {
  font-size: 16px;
  font-weight: bold;
  color: var(--el-text-color-primary);
  line-height: 32px;
  height: 32px;
  padding: 0 8px;
  border-radius: 4px;
  background: transparent;
  border: 1px solid transparent;
  white-space: nowrap;
}

.model-selector {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
}

.model-selector:hover {
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.model-name {
  font-weight: bold;
  color: inherit;
}

/* 竖杠分隔线 */
.header-left .el-divider--vertical {
  height: 20px;
  margin: 0 4px;
  border-left: 2px solid var(--el-border-color);
}

.model-arrow {
  color: var(--el-text-color-placeholder);
  font-size: 12px;
}

/* 公共信息栏 */
.header-info {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.info-item label {
  white-space: nowrap;
  color: var(--el-text-color-secondary);
}

/* 模型容器 */
.model-container {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 响应式 */
@media (max-width: 768px) {
  .calc-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .header-info {
    width: 100%;
  }
}
</style>

<style>
/* 下拉菜单样式 */
.model-dropdown .el-dropdown-menu {
  min-width: 220px;
  padding: 6px 0;
}

.model-dropdown .el-dropdown-menu__item {
  padding: 8px 16px;
  line-height: normal;
}

.model-dropdown .el-dropdown-menu__item.is-active {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.dropdown-item-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dropdown-icon {
  flex-shrink: 0;
}

.dropdown-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dropdown-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.dropdown-subtitle {
  font-size: 11px;
  color: var(--el-text-color-secondary);
}
</style>
