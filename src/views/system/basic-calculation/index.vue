<template>
  <div class="app-container basic-calculation-page">
    <div class="calc-header">
      <div class="header-left">
        <span class="header-title">基本计算</span>
        <el-divider direction="vertical" />
        <span class="header-subtitle">{{ currentTypeName }}</span>
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

    <el-row :gutter="16" class="calc-row">
      <el-col :span="7" :xs="24">
        <el-card class="calc-card type-card" :body-style="{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%' }">
          <template #header>
            <div class="card-header"><span>选型卡</span></div>
          </template>
          <div class="type-list">
            <el-collapse v-model="activeCollapse" class="calc-collapse">
              <el-collapse-item 
                v-for="mod in modules" 
                :key="mod.id"
                :title="mod.category" 
                :name="mod.id"
              >
                <div class="sub-type-list">
                  <div 
                    v-for="type in mod.types" 
                    :key="type.id"
                    :class="['type-item', { active: currentModuleId === mod.id && currentTypeId === type.id }]"
                    @click="selectType(mod.id, type.id)"
                  >
                    <span class="type-name">{{ type.name }}</span>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-card>
      </el-col>

      <el-col :span="17" :xs="24">
        <el-card class="calc-card" :body-style="{ padding: '16px 16px 0px 16px', display: 'flex', flexDirection: 'column', height: '100%', gap: '0px' }">
          <template #header>
            <div class="card-header">
              <span>计算卡</span>
            </div>
          </template>

          <div class="module-panel">
            <component 
              :is="currentModuleComponent" 
              :activeTypeId="currentTypeId"
            />
          </div>

          <ResultNote :notes="['注：计算结果仅供学习参考，请勿用于其它用途']" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="BasicCalculation">
import { ref, computed } from 'vue'
import { generateUUID } from '@/utils'
import ResultNote from '@/views/system/motor-selection/components/ResultNote.vue'
import { modules, getModuleById, getDefaultModule } from './modules'

const currentDate = ref(new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }))
const projectName = ref('')
const projectNo = ref('')
function initProjectNo() {
  projectNo.value = generateUUID()
}
initProjectNo()

const currentModuleId = ref(getDefaultModule()?.id || '')
const currentTypeId = ref('')
const activeCollapse = ref(modules.map(m => m.id))

// 初始化默认子类型
const defaultModule = getDefaultModule()
if (defaultModule?.types?.length) {
  currentTypeId.value = defaultModule.types[0].id
}

const currentModule = computed(() => getModuleById(currentModuleId.value))
const currentTypeName = computed(() => {
  const mod = currentModule.value
  if (!mod) return ''
  const type = mod.types?.find(t => t.id === currentTypeId.value)
  return type?.name || mod.name || ''
})

const currentModuleComponent = computed(() => {
  const mod = currentModule.value
  return mod?.component || null
})

function selectType(moduleId, typeId) {
  currentModuleId.value = moduleId
  currentTypeId.value = typeId
}
</script>

<style scoped lang="less">
.basic-calculation-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.calc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  margin-bottom: 12px;
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
  font-size: 14px;
  color: var(--el-text-color-regular);
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
}

.info-item label {
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}

.calc-row {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.calc-row > .el-col {
  height: 100%;
}

.calc-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.calc-card :deep(.el-card) {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-color: var(--el-border-color-light);
  background-color: var(--el-bg-color);
}

.calc-card :deep(.el-card__body) {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0px !important;
  background-color: var(--el-bg-color);
  padding: 16px 16px 0px 16px !important;
  contain: layout;
}

.calc-card :deep(.el-card__header) {
  padding: 10px 16px;
  background-color: var(--el-fill-color-light);
  border-bottom: 1px solid var(--el-border-color-light);
}

.card-header {
  font-weight: bold;
  font-size: 14px;
  color: var(--el-text-color-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.type-card :deep(.el-card__body) {
  padding: 0 !important;
  overflow-y: auto;
}

.type-list {
  padding: 0;
}

.calc-collapse {
  border: none;
  margin: 8px 8px 0 8px;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.calc-collapse :deep(.el-collapse-item__header) {
  font-size: 12px !important;
  font-weight: 600 !important;
  padding: 0 8px !important;
  height: 35px !important;
  min-height: 35px !important;
  line-height: 35px !important;
  background: var(--el-fill-color-light) !important;
  border-bottom: 1px solid var(--el-border-color-light) !important;
  color: var(--el-color-primary) !important;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

.calc-collapse :deep(.el-collapse-item__content) {
  padding: 4px;
}

.calc-collapse :deep(.el-collapse-item__wrap) {
  border-bottom: none;
}

.sub-type-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3px;
}

.type-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 8px;
  cursor: pointer;
  transition: all 0.15s;
  border: none;
  border-radius: 0;
  min-height: 28px;
}

.type-item:hover {
  background-color: var(--el-fill-color-light);
}

.type-item.active {
  background-color: transparent;
}

.type-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  text-align: center;
  width: 100%;
}

.type-item.active .type-name {
  color: var(--el-color-primary);
  font-weight: 600;
}

.module-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

@media screen and (max-width: 768px) {
  .calc-header {
    padding: 10px 12px;
  }
  .header-info {
    width: 100%;
    justify-content: flex-start;
  }
  .calc-row {
    display: flex;
    flex-direction: column;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  .calc-row > .el-col {
    padding-left: 0 !important;
    padding-right: 0 !important;
    height: auto;
  }
  .calc-row > .el-col:first-child {
    margin-bottom: 12px;
    height: auto;
    max-height: 300px;
  }
  .sub-type-list {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
