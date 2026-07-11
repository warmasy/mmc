<template>
  <div class="unit-conversion-panel">
    <div class="param-fieldset">
      <div class="param-fieldset-title">{{ currentType.name }}</div>
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
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import NumberInput from '@/components/NumberInput/index.vue'
import { formatResult } from '../../utils'
import { conversionTypes, getConversionTypeById, getDefaultConversionType } from './config'

const props = defineProps({
  activeTypeId: { type: String, default: '' }
})

const emit = defineEmits(['update:status'])

const currentTypeId = ref(props.activeTypeId || getDefaultConversionType().id)
const currentType = computed(() => getConversionTypeById(currentTypeId.value))

const inputValue = ref(1)
const sourceUnit = ref('')
const targetUnit = ref('')
const convertResult = ref(null)
const selectedBaseUnit = ref('')

const resultDisplay = computed(() => {
  if (convertResult.value === null || convertResult.value === undefined) return ''
  return formatResult(convertResult.value)
})

watch(() => props.activeTypeId, (id) => {
  if (id && id !== currentTypeId.value) {
    currentTypeId.value = id
  }
}, { immediate: true })

watch(() => currentType.value, (type) => {
  if (!type || !type.units) return
  const defaultSource = type.sourceUnit || Object.keys(type.units)[0]
  const defaultTarget = type.targetUnit || Object.keys(type.units)[0]
  const defaultBase = type.defaultBaseUnit || Object.keys(type.units).find(key => type.units[key].isDatum) || Object.keys(type.units)[0]

  if (!sourceUnit.value || !type.units[sourceUnit.value]) {
    sourceUnit.value = defaultSource
  }
  if (!targetUnit.value || !type.units[targetUnit.value]) {
    targetUnit.value = defaultTarget
  }
  if (!selectedBaseUnit.value || !type.units[selectedBaseUnit.value]) {
    selectedBaseUnit.value = defaultBase
  }
  handleConvert()
  emit('update:status', '已切换类型，等待输入...')
}, { immediate: true })

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
  emit('update:status', '转换完成')
}

function getConversionFormula(unitKey) {
  if (!currentType.value || !currentType.value.units[unitKey] || !currentType.value.units[selectedBaseUnit.value]) return ''
  const baseUnit = currentType.value.units[selectedBaseUnit.value]
  const targetUnit = currentType.value.units[unitKey]
  const ratio = baseUnit.factor / targetUnit.factor
  return `1 ${baseUnit.symbol} = ${formatResult(ratio)} ${targetUnit.symbol}`
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

<style scoped lang="less">
.unit-conversion-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.param-fieldset {
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  padding: 16px 12px 12px 12px;
  margin: 8px 0 16px 0;
  background-color: var(--el-bg-color);
  flex-shrink: 0;
  position: relative;
}

.param-fieldset-title {
  position: absolute;
  top: -9px;
  left: 12px;
  font-weight: bold;
  color: var(--el-text-color-primary);
  font-size: 13px;
  padding: 0 6px;
  background-color: var(--el-bg-color);
  line-height: 18px;
}

.convert-input-section {
  padding: 4px 0 0 0;
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
  text-align: center;
}

.formula-group {
  min-height: 36px;
  justify-content: flex-end;
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
  transition: none;
}

.convert-table-section {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  contain: layout;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  margin-bottom: 8px;
}

.section-title {
  font-size: 13px;
  font-weight: bold;
  color: var(--el-text-color-primary);
  flex-shrink: 0;
}

.base-unit-selector {
  display: flex;
  align-items: center;
  gap: 6px;
}

.base-unit-label {
  font-size: 13px;
  color: var(--el-text-color-regular);
}

.base-unit-btn {
  color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
  transition: all 0.3s ease;
  min-width: 80px;
  width: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-base-formula {
  width: 35%;
  min-width: 120px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-arrow-select :deep(.el-input__suffix),
.no-arrow-select :deep(.el-select__suffix),
.no-arrow-select :deep(.el-input__suffix-inner),
.no-arrow-select :deep(.el-select__caret),
.no-arrow-select :deep(.el-icon-arrow-down),
.no-arrow-select :deep(.el-select .el-input__icon) {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  width: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
}
.no-arrow-select :deep(.el-input__inner) {
  text-align: center !important;
  padding-right: 11px !important;
  padding-left: 11px !important;
}
.no-arrow-select :deep(.el-input__wrapper) {
  padding-right: 0 !important;
  padding-left: 0 !important;
  justify-content: center;
}
.no-arrow-select :deep(.el-select__wrapper) {
  text-align: center !important;
}
.no-arrow-select :deep(.el-select .el-input) {
  text-align: center;
}
.no-arrow-select :deep(.el-select .el-input__inner) {
  text-align: center !important;
}

.center-input :deep(.el-input__inner) {
  text-align: center;
}

@media screen and (max-width: 768px) {
  .input-row {
    flex-wrap: wrap;
    gap: 12px;
  }
  .formula-group {
    width: 100%;
  }
}
</style>
