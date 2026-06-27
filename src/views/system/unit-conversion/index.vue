<template>
  <div class="app-container unit-conversion-page">
    <!-- 顶部标题栏 -->
    <div class="calc-header">
      <div class="header-left">
        <span class="header-title">单位转换</span>
        <el-divider direction="vertical" />
        <span class="header-subtitle">{{ currentType.name }}</span>
      </div>
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

    <!-- 左右卡片布局 -->
    <el-row :gutter="16" class="calc-row">
      <!-- 左侧：转换类型选择 -->
      <el-col :span="7" :xs="24">
        <el-card class="calc-card type-card" :body-style="{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%' }">
          <template #header>
            <div class="card-header">
              <span>转换类型</span>
            </div>
          </template>
          <div class="type-list">
            <div
              v-for="type in conversionTypes"
              :key="type.id"
              :class="['type-item', { active: currentTypeId === type.id }]"
              @click="selectType(type.id)"
            >
              <span class="type-name">{{ type.name }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：转换操作 -->
      <el-col :span="17" :xs="24">
        <el-card class="calc-card" :body-style="{ padding: '16px', display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }">
          <template #header>
            <div class="card-header">
              <span>转换操作</span>
              <span class="header-status" v-if="statusText">
                <span class="status-tag">状态提示</span>
                <span class="status-text">{{ statusText }}</span>
              </span>
            </div>
          </template>

          <!-- 输入区域 -->
          <div class="convert-input-section">
            <div class="input-row">
              <div class="input-group">
                <span class="input-label">输入数值</span>
                <NumberInput
                  v-model="inputValue"
                  :step="1"
                  :precision="6"
                  :width="100"
                  :min="0"
                  @change="handleConvert"
                />
              </div>
              <div class="input-group">
                <span class="input-label">源单位</span>
                <el-select v-model="sourceUnit" placeholder="选择单位" size="small" style="width: 100px" @change="handleConvert" class="no-arrow-select" @wheel.prevent="handleWheelSource">
                  <el-option
                    v-for="(unit, key) in currentType.units"
                    :key="key"
                    :label="unit.symbol"
                    :value="key"
                  >
                    <span>{{ unit.name }} ({{ unit.symbol }})</span>
                  </el-option>
                </el-select>
              </div>
              <div class="input-group">
                <span class="input-label">目标单位</span>
                <el-select v-model="targetUnit" placeholder="选择单位" size="small" style="width: 100px" @change="handleConvert" class="no-arrow-select" @wheel.prevent="handleWheelTarget">
                  <el-option
                    v-for="(unit, key) in currentType.units"
                    :key="key"
                    :label="unit.symbol"
                    :value="key"
                  >
                    <span>{{ unit.name }} ({{ unit.symbol }})</span>
                  </el-option>
                </el-select>
              </div>
              <div class="input-group">
                <span class="input-label">转换结果</span>
                <el-input v-model="resultDisplay" readonly size="small" style="width: 100px" class="center-input" />
              </div>
              <div class="input-group formula-group">
                <span class="input-label">&nbsp;</span>
                <el-tag v-if="convertResult !== null" type="info" effect="plain" size="small">
                  {{ inputValue }} {{ currentType.units[sourceUnit]?.symbol }} = {{ formatResult(convertResult) }} {{ currentType.units[targetUnit]?.symbol }}
                </el-tag>
              </div>
            </div>

          </div>

          <!-- 全部单位对照表 -->
          <div class="convert-table-section">
            <div class="section-title">全部单位对照表</div>
            <!-- 硬度类型：建设中 -->
            <div v-if="currentType.referenceTable" class="building-tip">
              <el-empty description="硬度换算表正在建设中，敬请期待" />
            </div>
            <!-- 其他类型：展示常规换算表 -->
            <div v-else class="convert-table">
              <div class="table-header">
                <span class="col-unit">单位名称</span>
                <span class="col-symbol">符号</span>
                <span class="col-value">换算值</span>
                <span class="col-formula">换算关系</span>
              </div>
              <div class="table-body">
                <div
                  v-for="(unit, key) in currentType.units"
                  :key="key"
                  :class="['table-row', { highlight: key === sourceUnit || key === targetUnit }]"
                >
                  <span class="col-unit">{{ unit.name }}</span>
                  <span class="col-symbol">{{ unit.symbol }}</span>
                  <span class="col-value">{{ formatResult(convertToBase(key)) }}</span>
                  <span class="col-formula">
                    1 {{ currentType.units[currentType.baseUnit]?.symbol }} = {{ formatResult(1 / unit.factor) }} {{ unit.symbol }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="UnitConversion">
import { ref, computed, watch } from 'vue'
import NumberInput from '@/components/NumberInput/index.vue'
import { conversionTypes, getConversionTypeById, getDefaultConversionType } from './config'

// ==================== 项目信息 ====================
const currentDate = ref(new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}))

const projectName = ref('')
const projectNo = ref('')
function generateUUID() {
  const uuid = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/x/g, () => (Math.random() * 16 | 0).toString(16))
  projectNo.value = uuid
}
generateUUID()

// ==================== 转换类型 ====================
const currentTypeId = ref(getDefaultConversionType().id)
const currentType = computed(() => getConversionTypeById(currentTypeId.value))

function selectType(id) {
  currentTypeId.value = id
  const unitKeys = Object.keys(currentType.value.units)
  sourceUnit.value = unitKeys[0]
  targetUnit.value = unitKeys[1] || unitKeys[0]
  statusText.value = '已切换类型，等待输入...'
  handleConvert()
}

// ==================== 转换逻辑 ====================
const inputValue = ref(1)
const sourceUnit = ref('')
const targetUnit = ref('')
const convertResult = ref(null)
const statusText = ref('等待输入参数...')

const resultDisplay = computed(() => {
  if (convertResult.value === null || convertResult.value === undefined) return ''
  return formatResult(convertResult.value)
})

watch(() => currentType.value, (type) => {
  const unitKeys = Object.keys(type.units)
  if (!sourceUnit.value || !type.units[sourceUnit.value]) {
    sourceUnit.value = unitKeys[0]
  }
  if (!targetUnit.value || !type.units[targetUnit.value]) {
    targetUnit.value = unitKeys[1] || unitKeys[0]
  }
  handleConvert()
}, { immediate: true })

function convertToBase(unitKey) {
  if (!inputValue.value || !currentType.value.units[unitKey]) return 0
  const unit = currentType.value.units[unitKey]
  const offset = unit.offset || 0
  return (inputValue.value + offset) * unit.factor
}

function handleConvert() {
  if (!inputValue.value || !sourceUnit.value || !targetUnit.value) {
    convertResult.value = null
    return
  }
  const source = currentType.value.units[sourceUnit.value]
  const target = currentType.value.units[targetUnit.value]
  if (!source || !target) return
  const baseValue = (inputValue.value + (source.offset || 0)) * source.factor
  convertResult.value = baseValue / target.factor - (target.offset || 0)
  statusText.value = '转换完成'
}

function formatResult(val) {
  if (val === null || val === undefined || isNaN(val)) return '-'
  if (val === 0) return '0'
  const absVal = Math.abs(val)
  if (absVal >= 1e6 || absVal < 1e-4) {
    return val.toExponential(4)
  }
  if (absVal >= 1) {
    return val.toFixed(4).replace(/\.?0+$/, '')
  }
  return val.toFixed(6).replace(/\.?0+$/, '')
}

// ==================== 滚轮切换选项 ====================
function handleWheelSource(e) {
  const keys = Object.keys(currentType.value.units)
  const idx = keys.indexOf(sourceUnit.value)
  if (idx === -1) return
  const newIdx = e.deltaY > 0
    ? (idx + 1) % keys.length
    : (idx - 1 + keys.length) % keys.length
  sourceUnit.value = keys[newIdx]
  handleConvert()
}

function handleWheelTarget(e) {
  const keys = Object.keys(currentType.value.units)
  const idx = keys.indexOf(targetUnit.value)
  if (idx === -1) return
  const newIdx = e.deltaY > 0
    ? (idx + 1) % keys.length
    : (idx - 1 + keys.length) % keys.length
  targetUnit.value = keys[newIdx]
  handleConvert()
}
</script>

<style scoped>
.unit-conversion-page {
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
  gap: 16px !important;
  background-color: var(--el-bg-color);
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

.header-status {
  display: flex;
  align-items: center;
  gap: 6px;
  max-width: 65%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 500;
  color: #fff;
  background-color: var(--el-color-primary);
  border-radius: 10px;
  flex-shrink: 0;
}

.status-text {
  font-size: 12px;
  font-weight: 500;
  color: var(--el-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.type-card :deep(.el-card__body) {
  padding: 0 !important;
  overflow-y: auto;
}

.type-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 4px;
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

.convert-input-section {
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  padding: 16px;
  flex-shrink: 0;
}

.input-row {
  display: flex;
  align-items: flex-end;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.input-label {
  font-size: 13px;
  color: var(--el-text-color-regular);
  font-weight: 500;
}

.formula-group {
  min-width: auto;
}

.formula-group :deep(.el-tag) {
  height: 24px;
  line-height: 22px;
  padding: 0 10px;
  font-size: 12px;
  background-color: var(--el-color-primary-light-9) !important;
  border-color: var(--el-color-primary-light-5) !important;
  color: var(--el-color-primary) !important;
  font-weight: 600;
  border-radius: 4px;
}

.convert-table-section {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.section-title {
  font-size: 13px;
  font-weight: bold;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
  flex-shrink: 0;
}

.convert-table {
  flex: 1;
  overflow-y: auto;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  background-color: var(--el-bg-color);
}

.table-header {
  display: flex;
  padding: 8px 12px;
  background-color: var(--el-fill-color-light);
  border-bottom: 1px solid var(--el-border-color-light);
  font-size: 13px;
  font-weight: bold;
  color: var(--el-text-color-primary);
  position: sticky;
  top: 0;
  z-index: 1;
}

.table-row {
  display: flex;
  padding: 8px 12px;
  border-bottom: 1px solid var(--el-border-color-light);
  font-size: 13px;
  color: var(--el-text-color-regular);
  transition: background-color 0.2s;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background-color: var(--el-fill-color-light);
}

.table-row.highlight {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  font-weight: 500;
}

.col-unit {
  flex: 2;
  min-width: 100px;
}

.col-symbol {
  flex: 1;
  min-width: 60px;
  color: var(--el-text-color-secondary);
}

.col-value {
  flex: 2;
  min-width: 100px;
  font-family: Consolas, monospace;
}

.col-formula {
  flex: 3;
  min-width: 150px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

@media (max-width: 1200px) {
  .input-row {
    gap: 12px;
  }
  .col-formula {
    display: none;
  }
  .type-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .calc-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .header-info {
    flex-wrap: wrap;
  }
  .input-row {
    flex-direction: column;
    align-items: stretch;
  }
  .input-group {
    width: 100%;
  }
  .result-highlight {
    width: 100%;
    justify-content: center;
  }
}

/* 输入框文字居中 */
.center-input :deep(.el-input__inner) {
  text-align: center !important;
}

/* 隐藏 el-select 右侧箭头，文字居中 */
.no-arrow-select :deep(.el-select__suffix) {
  display: none !important;
}

.no-arrow-select :deep(.el-select__wrapper) {
  padding: 0 8px !important;
}

.no-arrow-select :deep(.el-select__selection) {
  justify-content: center !important;
}

.no-arrow-select :deep(.el-select__selected-item) {
  justify-content: center !important;
}

.no-arrow-select :deep(.el-select__selected-item) > * {
  width: auto !important;
  flex: none !important;
  text-align: center !important;
}

.no-arrow-select :deep(.el-select__placeholder) {
  text-align: center !important;
  left: 0 !important;
  right: 0 !important;
}

/* label 文字居中 */
.input-label {
  text-align: center;
}

</style>
