<template>
  <div class="app-container unit-conversion-page">
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
                      <span>{{ unit.name }} ({{ unit.symbol }})</span>
                    </el-option>
                  </el-select>
                </div>
                <div class="input-group">
                  <span class="input-label">目标单位</span>
                  <el-select v-model="targetUnit" placeholder="选择单位" size="small" style="width: 100px" @change="handleConvert" class="no-arrow-select" @wheel.prevent="handleWheelTarget">
                    <el-option v-for="(unit, key) in currentType.units" :key="key" :label="unit.symbol" :value="key">
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
            <div class="convert-table-section">
              <div class="section-title">全部单位对照表</div>
              <div v-if="currentType.referenceTable" class="building-tip">
                <el-empty description="硬度换算表正在建设中，敬请期待" />
              </div>
              <div v-else class="convert-table">
                <div class="table-header">
                  <span class="col-unit">单位名称</span>
                  <span class="col-symbol">符号</span>
                  <span class="col-value">换算值</span>
                  <span class="col-formula">换算关系</span>
                </div>
                <div class="table-body">
                  <div v-for="(unit, key) in currentType.units" :key="key" :class="['table-row', { highlight: key === sourceUnit || key === targetUnit }]">
                    <span class="col-unit">{{ unit.name }}</span>
                    <span class="col-symbol">{{ unit.symbol }}</span>
                    <span class="col-value">{{ formatResult(convertToBase(key)) }}</span>
                    <span class="col-formula">1 {{ currentType.units[currentType.baseUnit]?.symbol }} = {{ formatResult(1 / unit.factor) }} {{ unit.symbol }}</span>
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

<script setup name="UnitConversion">
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
})

function selectType(id) {
  currentTab.value = 'unit-conversion'
  currentTypeId.value = id
  const unitKeys = Object.keys(currentType.value.units)
  sourceUnit.value = unitKeys[0]
  targetUnit.value = unitKeys[1] || unitKeys[0]
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
  gap: 0px !important;
  background-color: var(--el-bg-color);
  padding: 16px 16px 0px 16px !important;
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
  background: #e8f5e9 !important;
  border-bottom: 1px solid #c8e6c9 !important;
  color: #1a1a1a !important;
  display: flex;
  align-items: center;
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
</style>
