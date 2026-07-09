<template>
  <div class="app-container basic-calculation-page">
    <div class="calc-header">
      <div class="header-left">
        <span class="header-title">基本计算</span>
        <el-divider direction="vertical" />
        <span class="header-subtitle">{{ currentTab === 'unit-conversion' ? currentType.name : currentInertia.name }}</span>
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

    <el-row :gutter="16" class="calc-row">
      <el-col :span="7" :xs="24">
        <el-card class="calc-card type-card" :body-style="{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%' }">
          <template #header>
            <div class="card-header"><span>选型卡</span></div>
          </template>
          <div class="type-list">
            <el-collapse v-model="activeCollapse" class="calc-collapse">
              <el-collapse-item title="单位转换" name="unit-conversion">
                <div class="sub-type-list">
                  <div v-for="type in conversionTypes" :key="type.id"
                    :class="['type-item', { active: currentTypeId === type.id && currentTab === 'unit-conversion' }]"
                    @click="selectType(type.id)">
                    <span class="type-name">{{ type.name }}</span>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item title="惯量计算" name="inertia-calc">
                <div class="sub-type-list">
                  <div v-for="model in inertiaModels" :key="model.id"
                    :class="['type-item', { active: currentInertiaId === model.id && currentTab === 'inertia-calc' }]"
                    @click="selectInertiaModel(model.id)">
                    <span class="type-name">{{ model.name }}</span>
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
              <span class="header-status" v-if="statusText">
                <span class="status-tag">状态提示</span>
                <span class="status-text">{{ statusText }}</span>
              </span>
            </div>
          </template>

          <div v-show="currentTab === 'unit-conversion'" class="tab-panel">
            <div class="convert-input-section">
              <div class="input-row">
                <div class="input-group">
                  <span class="input-label">输入数值</span>
                  <NumberInput v-model="inputValue" :step="1" :precision="6" :width="100" :min="0" @change="handleConvert" />
                </div>
                <div class="input-group">
                  <span class="input-label">源单位</span>
                  <el-select v-model="sourceUnit" placeholder="选择单位" size="small" style="width: 100px" @change="handleConvert" class="no-arrow-select" @wheel.prevent="handleWheelSource">
                    <el-option v-for="(unit, key) in currentType.units" :key="key" :label="unit.symbol" :value="key">
                      <span>{{ unit.symbol }}({{ unit.name }})</span>
                    </el-option>
                  </el-select>
                </div>
                <div class="input-group">
                  <span class="input-label">目标单位</span>
                  <el-select v-model="targetUnit" placeholder="选择单位" size="small" style="width: 100px" @change="handleConvert" class="no-arrow-select" @wheel.prevent="handleWheelTarget">
                    <el-option v-for="(unit, key) in currentType.units" :key="key" :label="unit.symbol" :value="key">
                      <span>{{ unit.symbol }}({{ unit.name }})</span>
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
            <div class="convert-table-section">
              <div class="section-header">
  <span class="section-title">全部单位对照表</span>
  <div class="base-unit-selector">
    <span class="base-unit-label">基础单位：</span>
    <el-dropdown trigger="click" @command="(cmd) => selectedBaseUnit = cmd" :teleported="false">
      <el-button size="small" class="base-unit-btn" @wheel.prevent="handleWheelBaseUnit">
        {{ currentType.units[selectedBaseUnit]?.symbol }}
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="(unit, key) in currentType.units"
            :key="key"
            :command="key"
            :class="{ 'is-active': key === selectedBaseUnit }"
          >
            {{ unit.symbol }}({{ unit.name }})
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</div>
              <div class="convert-table">
                <div class="table-header">
                  <span class="col-unit">单位名称</span>
                  <span class="col-symbol">符号</span>
                  <span class="col-formula">换算关系</span>
                  <span class="col-base-formula">基本换算</span>
                </div>
                <div class="table-body">
                  <div v-for="(unit, key) in currentType.units" :key="key" :class="['table-row', { highlight: key === targetUnit }]">
                    <span class="col-unit">{{ unit.name }}</span>
                    <span class="col-symbol"><span :class="['symbol-text', { 'base-active': key === sourceUnit }]">{{ unit.symbol }}</span></span>
                    <span class="col-formula">{{ getInputConversionFormula(key) }}</span>
                    <span class="col-base-formula">{{ getConversionFormula(key) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-show="currentTab === 'inertia-calc'" class="tab-panel">
            <div class="inertia-desc">
              <el-tag type="info" effect="plain" size="small">{{ currentInertia.name }}</el-tag>
              <span class="desc-text">{{ currentInertia.desc }}</span>
            </div>
            <div class="convert-input-section">
              <div class="inertia-input-row">
                <div class="input-group" v-for="(param, key) in currentInertia.params" :key="key">
                  <span class="input-label">{{ param.name }}</span>
                  <NumberInput v-model="inertiaParams[key]" :step="param.step || 1" :precision="param.precision || 4" :width="100" :min="param.min !== undefined ? param.min : 0" @change="calcInertia" />
                  <span class="param-unit">{{ param.unit }}</span>
                </div>
              </div>
            </div>
            <div class="convert-table-section inertia-result-section">
              <div class="section-title">计算结果</div>
              <div class="inertia-result">
                <div class="result-row">
                  <span class="result-label">转动惯量 J</span>
                  <span class="result-value">{{ inertiaResult !== null ? formatResult(inertiaResult) : '-' }} kg·m²</span>
                </div>
              </div>
            </div>
          </div>

          <ResultNote :notes="['注：计算结果仅供学习参考，请勿用于其它用途']" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="BasicCalculation">
import { ref, computed, watch, onMounted } from 'vue'
import NumberInput from '@/components/NumberInput/index.vue'
import ResultNote from '@/views/system/motor-selection/components/ResultNote.vue'
import { conversionTypes, getConversionTypeById, getDefaultConversionType, inertiaModels, getInertiaModelById, getDefaultInertiaModel } from './config'

const currentDate = ref(new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }))
const projectName = ref('')
const projectNo = ref('')
function generateUUID() {
  const uuid = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/x/g, () => (Math.random() * 16 | 0).toString(16))
  projectNo.value = uuid
}
generateUUID()

const activeCollapse = ref(['unit-conversion', 'inertia-calc'])
const currentTab = ref('unit-conversion')
const currentTypeId = ref(getDefaultConversionType().id)
const currentType = computed(() => getConversionTypeById(currentTypeId.value))
const selectedBaseUnit = ref('')

// 基础单位选项
const baseUnitOptions = computed(() => {
  if (!currentType.value || !currentType.value.units) return []
  return Object.entries(currentType.value.units).map(([key, unit]) => ({
    value: key,
    label: `${unit.name} (${unit.symbol})`
  }))
})

// 初始化基础单位
function initBaseUnit() {
  if (currentType.value && currentType.value.units) {
    selectedBaseUnit.value = sourceUnit.value
  }
}

const currentInertiaId = ref(getDefaultInertiaModel().id)
const currentInertia = computed(() => getInertiaModelById(currentInertiaId.value))
const inertiaParams = ref({})
const inertiaResult = ref(null)

function initInertiaParams() {
  const params = {}
  const model = currentInertia.value
  for (const key in model.params) {
    params[key] = model.params[key].default
  }
  inertiaParams.value = params
}

function calcInertia() {
  const model = currentInertia.value
  const p = inertiaParams.value
  for (const key in model.params) {
    if (p[key] === undefined || p[key] === null || isNaN(p[key]) || p[key] < 0) {
      inertiaResult.value = null
      return
    }
  }
  switch (model.formulaType) {
    case 'solid-cylinder': inertiaResult.value = 0.5 * p.m * p.r * p.r; break
    case 'hollow-cylinder': inertiaResult.value = 0.5 * p.m * (p.r1 * p.r1 + p.r2 * p.r2); break
    case 'rectangular-prism': inertiaResult.value = (1/12) * p.m * (p.a * p.a + p.b * p.b); break
    case 'sphere': inertiaResult.value = (2/5) * p.m * p.r * p.r; break
    case 'thin-disk': inertiaResult.value = 0.5 * p.m * p.r * p.r; break
    case 'cone': inertiaResult.value = 0.3 * p.m * p.r * p.r; break
    default: inertiaResult.value = null
  }
}

function selectInertiaModel(id) {
  currentTab.value = 'inertia-calc'
  currentInertiaId.value = id
  initInertiaParams()
  calcInertia()
  statusText.value = '已切换模型，等待输入...'
}

onMounted(() => {
  initInertiaParams()
  calcInertia()
  initBaseUnit()
})

function selectType(id) {
  currentTab.value = 'unit-conversion'
  currentTypeId.value = id
  const unitKeys = Object.keys(currentType.value.units)
  sourceUnit.value = unitKeys[0]
  targetUnit.value = unitKeys[0]
  selectedBaseUnit.value = unitKeys[0]
  statusText.value = '已切换类型，等待输入...'
  handleConvert()
}

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
  targetUnit.value = sourceUnit.value
  selectedBaseUnit.value = sourceUnit.value
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
    let exp = val.toExponential(4)
    exp = exp.replace(/\.0+e/, 'e')           // 1.0000e+6 → 1e+6
    exp = exp.replace(/(\.\d*?)0+e/, '$1e')  // 1.2340e+6 → 1.234e+6
    return exp
  }
  if (absVal >= 1) {
    return val.toFixed(4).replace(/\.?0+$/, '')
  }
  return val.toFixed(6).replace(/\.?0+$/, '')
}

// 根据选中的基础单位计算换算关系
function getConversionFormula(unitKey) {
  if (!currentType.value || !currentType.value.units[unitKey] || !currentType.value.units[selectedBaseUnit.value]) return ''
  const baseUnit = currentType.value.units[selectedBaseUnit.value]
  const targetUnit = currentType.value.units[unitKey]
  const baseFactor = baseUnit.factor
  const targetFactor = targetUnit.factor
  const ratio = baseFactor / targetFactor
  return `1 ${baseUnit.symbol} = ${formatResult(ratio)} ${targetUnit.symbol}`
}

function getBaseConversionValue(unitKey) {
  if (!currentType.value || !currentType.value.units[unitKey] || !currentType.value.units[selectedBaseUnit.value]) return 0
  const baseUnit = currentType.value.units[selectedBaseUnit.value]
  const targetUnit = currentType.value.units[unitKey]
  return baseUnit.factor / targetUnit.factor
}

function getInputConversionFormula(unitKey) {
  if (!currentType.value || !currentType.value.units[unitKey] || !currentType.value.units[sourceUnit.value]) return ''
  const inputVal = parseFloat(inputValue.value)
  if (isNaN(inputVal)) return ''
  const sourceUnitObj = currentType.value.units[sourceUnit.value]
  const targetUnit = currentType.value.units[unitKey]
  const ratio = sourceUnitObj.factor / targetUnit.factor
  const result = inputVal * ratio
  return `${formatResult(inputVal)} ${sourceUnitObj.symbol} = ${formatResult(result)} ${targetUnit.symbol}`
}

function getInputConversionValue(unitKey) {
  if (!currentType.value || !currentType.value.units[unitKey] || !currentType.value.units[sourceUnit.value]) return 0
  const inputVal = parseFloat(inputValue.value)
  if (isNaN(inputVal)) return 0
  const sourceUnitObj = currentType.value.units[sourceUnit.value]
  const targetUnit = currentType.value.units[unitKey]
  return inputVal * (sourceUnitObj.factor / targetUnit.factor)
}

function handleWheelSource(e) {
  const keys = Object.keys(currentType.value.units)
  const idx = keys.indexOf(sourceUnit.value)
  if (idx === -1) return
  const newIdx = e.deltaY > 0 ? (idx + 1) % keys.length : (idx - 1 + keys.length) % keys.length
  sourceUnit.value = keys[newIdx]
  handleConvert()
}

function handleWheelTarget(e) {
  const keys = Object.keys(currentType.value.units)
  const idx = keys.indexOf(targetUnit.value)
  if (idx === -1) return
  const newIdx = e.deltaY > 0 ? (idx + 1) % keys.length : (idx - 1 + keys.length) % keys.length
  targetUnit.value = keys[newIdx]
  handleConvert()
}

function handleWheelBaseUnit(e) {
  const keys = Object.keys(currentType.value.units)
  const idx = keys.indexOf(selectedBaseUnit.value)
  if (idx === -1) return
  const newIdx = e.deltaY > 0 ? (idx + 1) % keys.length : (idx - 1 + keys.length) % keys.length
  selectedBaseUnit.value = keys[newIdx]
}
</script>

<style scoped>
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

.tab-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.convert-input-section {
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  padding: 16px;
  flex-shrink: 0;
  margin-bottom: 16px;
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
  text-align: center;
}

.formula-group {
  min-width: auto;
}

.formula-group :deep(.el-tag) {
  height: 24px;
  line-height: 22px;
  padding: 0 10px;
  font-size: 12px;
  background-color: var(--el-fill-color-light) !important;
  border-color: var(--el-color-primary) !important;
  color: var(--el-color-primary) !important;
  font-weight: 600;
  border-radius: 4px;
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

.convert-table-section {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  contain: layout;
}

.section-title {
  font-size: 13px;
  font-weight: bold;
  color: var(--el-text-color-primary);
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
  padding: 0 12px;
  height: 36px;
  min-height: 36px;
  background-color: var(--el-fill-color-light);
  border-bottom: 1px solid var(--el-border-color-light);
  font-size: 13px;
  color: var(--el-text-color-primary);
  position: sticky;
  top: 0;
  z-index: 1;
  box-sizing: border-box;
}

.table-header > span {
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-header > .col-unit,
.table-header > .col-formula,
.table-header > .col-base-formula {
  justify-content: flex-start;
}

.table-row {
  display: flex;
  padding: 0 12px;
  height: 36px;
  min-height: 36px;
  border-bottom: 1px solid var(--el-border-color-light);
  font-size: 13px;
  color: var(--el-text-color-regular);
  transition: background-color 0.2s;
  align-items: center;
  box-sizing: border-box;
}

.table-row > span {
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-row > .col-unit,
.table-row > .col-formula,
.table-row > .col-base-formula {
  justify-content: flex-start;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background-color: var(--el-fill-color-light);
}

.table-row.highlight {
  background-color: var(--el-fill-color-light);
  color: var(--el-color-primary);
  font-weight: 500;
  border-left: 3px solid var(--el-color-primary);
  padding-left: 9px;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

.col-unit {
  width: 22%;
  min-width: 70px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-symbol {
  width: 15%;
  min-width: 40px;
  color: var(--el-text-color-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.symbol-text.base-active {
  color: var(--el-color-primary);
  font-weight: 600;
  border: 1px solid var(--el-color-primary);
  border-radius: 3px;
  padding: 0 2px;
  display: inline-block;
  line-height: 1.2;
  transition: all 0.3s ease;
}

.col-formula {
  width: 28%;
  min-width: 100px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-base-formula {
  width: 35%;
  min-width: 100px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

.center-input :deep(.el-input__inner) {
  text-align: center !important;
}

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

/* 惯量计算 */
.inertia-desc {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  margin-bottom: 12px;
}

.inertia-desc .desc-text {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.inertia-input-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 24px;
  align-items: flex-end;
}

.inertia-input-row .input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}

.inertia-input-row .param-unit {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.inertia-result-section {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.inertia-result {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  padding: 16px;
  flex: 1;
  overflow-y: auto;
}

.inertia-result .result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dotted var(--el-border-color-light);
}

.inertia-result .result-row:last-child {
  border-bottom: none;
}

.inertia-result .result-label {
  font-size: 13px;
  color: var(--el-text-color-regular);
}

.inertia-result .result-value {
  font-size: 14px;
  font-weight: bold;
  color: var(--el-color-danger);
  font-family: Consolas, monospace;
}

/* 底部注释 */
.card-footer.result-note {
  padding: 8px 0;
  background: transparent;
  border: none;
  flex-shrink: 0;
  margin-top: auto;
}

.card-footer.result-note .note-box {
  padding: 0 12px;
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  min-height: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.card-footer.result-note .note-item {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  text-align: left;
  line-height: 1.4;
}

/* 表头区域 */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.base-unit-selector {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.base-unit-btn {
  padding: 0 8px;
  font-size: 13px;
  font-weight: 500;
  min-width: 60px;
  color: var(--el-color-primary) !important;
  border-color: var(--el-color-primary) !important;
  background-color: var(--el-fill-color-light) !important;
  transition: color 0.3s ease, border-color 0.3s ease, background-color 0.3s ease;
}

.base-unit-btn:hover {
  color: var(--el-color-primary-light-3) !important;
  border-color: var(--el-color-primary-light-3) !important;
}

.base-unit-selector :deep(.el-dropdown-menu__item.is-active) {
  color: var(--el-color-primary);
  font-weight: 600;
  background-color: var(--el-fill-color-light);
}

.base-unit-label {
  font-size: 13px;
  color: var(--el-text-color-regular);
  white-space: nowrap;
}

/* 下拉选择框在暗色模式下的适配 */
.base-unit-selector :deep(.el-select__wrapper) {
  background-color: var(--el-fill-color-light);
  border-color: var(--el-border-color);
}

.base-unit-selector :deep(.el-select-dropdown__item) {
  padding: 0 12px;
  font-size: 13px;
}
</style>