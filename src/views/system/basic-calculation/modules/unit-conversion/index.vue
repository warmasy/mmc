<template>
  <div class="unit-conversion-panel">
    <div class="param-fieldset">
      <div class="param-fieldset-title">{{ currentType.name }}</div>

      <table class="unit-table">
        <thead>
          <tr>
            <th class="th-input">输入数值</th>
            <th class="th-unit">源单位</th>
            <th class="th-unit">目标单位</th>
            <th class="th-result">转换结果</th>
            <th class="th-formula">换算关系</th>
            <th class="th-empty"></th>
          </tr>
        </thead>
        <tbody>
          <!-- 第一行：包含跨行的输入数值和源单位 -->
          <tr>
            <td class="td-input" :rowspan="rows.length">
              <div class="cell-center">
                <NumberInput
                  v-model="sharedInputValue"
                  :step="1"
                  :precision="6"
                  :width="90"
                  :min="0"
                  @change="calculateAll"
                />
              </div>
            </td>
            <td class="td-unit" :rowspan="rows.length">
              <div class="cell-center">
                <el-select
                  v-model="sharedSourceUnit"
                  size="small"
                  class="no-arrow-select"
                  @wheel.prevent="handleWheelSource"
                >
                  <el-option
                    v-for="(unit, key) in currentType.units"
                    :key="key"
                    :label="unit.symbol"
                    :value="key"
                  >
                    <span>{{ unit.symbol }}({{ unit.name }})</span>
                  </el-option>
                </el-select>
              </div>
            </td>
            <td class="td-unit">
              <el-tooltip :content="currentType.units[rows[0].targetUnit]?.name" placement="right" :show-after="0">
                <el-input
                  :value="currentType.units[rows[0].targetUnit]?.symbol"
                  readonly
                  size="small"
                  class="center-input target-unit-input"
                />
              </el-tooltip>
            </td>
            <td class="td-result">
              <el-input
                :value="formatResult(rows[0].result)"
                readonly
                size="small"
                class="center-input"
              />
            </td>
            <td class="td-formula">
              <el-tag
                v-if="rows[0].result !== null"
                type="info"
                effect="plain"
                size="small"
                class="formula-tag"
              >
                {{ formatResult(sharedInputValue) }} {{ currentType.units[sharedSourceUnit]?.symbol }} = {{ formatResult(rows[0].result) }} {{ currentType.units[rows[0].targetUnit]?.symbol }}
              </el-tag>
            </td>
            <td class="td-empty" :rowspan="rows.length"></td>
          </tr>
          <!-- 后续行（只有3列） -->
          <tr v-for="(row, index) in rows.slice(1)" :key="row.id">
            <td class="td-unit">
              <el-tooltip :content="currentType.units[row.targetUnit]?.name" placement="right" :show-after="0">
                <el-input
                  :value="currentType.units[row.targetUnit]?.symbol"
                  readonly
                  size="small"
                  class="center-input target-unit-input"
                />
              </el-tooltip>
            </td>
            <td class="td-result">
              <el-input
                :value="formatResult(row.result)"
                readonly
                size="small"
                class="center-input"
              />
            </td>
            <td class="td-formula">
              <el-tag
                v-if="row.result !== null"
                type="info"
                effect="plain"
                size="small"
                class="formula-tag"
              >
                {{ formatResult(sharedInputValue) }} {{ currentType.units[sharedSourceUnit]?.symbol }} = {{ formatResult(row.result) }} {{ currentType.units[row.targetUnit]?.symbol }}
              </el-tag>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 全部单位对照表 -->
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
          <span class="col-unit-name">单位名称</span>
          <span class="col-symbol">符号</span>
          <span class="col-formula">换算关系</span>
          <span class="col-base-formula">基本换算</span>
        </div>
        <div class="table-body">
          <div
            v-for="(unit, key) in currentType.units"
            :key="key"
            :class="['table-row', { highlight: key === sharedSourceUnit }]"
          >
            <span class="col-unit-name">{{ unit.name }}</span>
            <span class="col-symbol">
              <span :class="['symbol-text', { 'base-active': key === selectedBaseUnit }]">
                {{ unit.symbol }}
              </span>
            </span>
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

const sharedInputValue = ref(1)
const sharedSourceUnit = ref('')
const selectedBaseUnit = ref('')

const rows = ref([])
let rowIdCounter = 0

function initRows() {
  rows.value = []
  rowIdCounter = 0
  const unitKeys = Object.keys(currentType.value.units || {})
  for (let i = 0; i < unitKeys.length; i++) {
    rows.value.push({
      id: rowIdCounter++,
      targetUnit: unitKeys[i],
      result: null
    })
  }
}

function calculateRow(index) {
  const row = rows.value[index]
  if (!row) return
  if (sharedInputValue.value === null || sharedInputValue.value === undefined || sharedInputValue.value === '') {
    row.result = null
    return
  }
  const source = currentType.value.units[sharedSourceUnit.value]
  const target = currentType.value.units[row.targetUnit]
  if (!source || !target) {
    row.result = null
    return
  }
  const baseValue = (parseFloat(sharedInputValue.value) + (source.offset || 0)) * source.factor
  row.result = baseValue / target.factor - (target.offset || 0)
}

function calculateAll() {
  rows.value.forEach((_, index) => calculateRow(index))
}

function getConversionFormula(unitKey) {
  if (!currentType.value || !currentType.value.units[unitKey] || !currentType.value.units[selectedBaseUnit.value]) return ''
  const baseUnit = currentType.value.units[selectedBaseUnit.value]
  const targetUnit = currentType.value.units[unitKey]
  const ratio = baseUnit.factor / targetUnit.factor
  return `1 ${baseUnit.symbol} = ${formatResult(ratio)} ${targetUnit.symbol}`
}

function getInputConversionFormula(unitKey) {
  if (!currentType.value || !currentType.value.units[unitKey]) return ''
  const refValue = parseFloat(sharedInputValue.value)
  if (isNaN(refValue)) return ''
  const targetUnit = currentType.value.units[unitKey]
  const baseUnitKey = selectedBaseUnit.value
  const baseUnit = currentType.value.units[baseUnitKey]
  if (!baseUnit) return ''
  const ratio = baseUnit.factor / targetUnit.factor
  const result = refValue * ratio
  return `${formatResult(refValue)} ${baseUnit.symbol} = ${formatResult(result)} ${targetUnit.symbol}`
}

function handleWheelSource(e) {
  const keys = Object.keys(currentType.value.units)
  const idx = keys.indexOf(sharedSourceUnit.value)
  if (idx === -1) return
  const newIdx = e.deltaY > 0 ? (idx + 1) % keys.length : (idx - 1 + keys.length) % keys.length
  sharedSourceUnit.value = keys[newIdx]
}

function handleWheelBaseUnit(e) {
  const keys = Object.keys(currentType.value.units)
  const idx = keys.indexOf(selectedBaseUnit.value)
  if (idx === -1) return
  const newIdx = e.deltaY > 0 ? (idx + 1) % keys.length : (idx - 1 + keys.length) % keys.length
  selectedBaseUnit.value = keys[newIdx]
}

watch(() => props.activeTypeId, (id) => {
  if (id && id !== currentTypeId.value) {
    currentTypeId.value = id
  }
}, { immediate: true })

watch(() => currentType.value, (type) => {
  if (!type || !type.units) return
  const unitKeys = Object.keys(type.units)
  sharedSourceUnit.value = type.sourceUnit || unitKeys[0]
  selectedBaseUnit.value = type.defaultBaseUnit || unitKeys.find(key => type.units[key].isDatum) || unitKeys[0]
  sharedInputValue.value = 1
  initRows()
  calculateAll()
  emit('update:status', '已切换类型，等待输入...')
}, { immediate: true })

watch(sharedSourceUnit, () => {
  calculateAll()
  emit('update:status', '源单位已更新')
})
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
  padding: 8px 6px 6px 6px;
  margin: 6px 0 4px 0;
  background-color: var(--el-bg-color);
  flex-shrink: 0;
  position: relative;
}

.param-fieldset-title {
  position: absolute;
  top: -8px;
  left: 12px;
  font-weight: bold;
  color: var(--el-text-color-primary);
  font-size: 13px;
  padding: 0 6px;
  line-height: 18px;
}

/* ==================== 原生 Table + rowspan ==================== */
.unit-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  overflow: hidden;
  font-size: 13px;
}

.unit-table thead tr {
  background-color: transparent;
}

.unit-table th {
  height: 40px;
  border-bottom: 1px solid var(--el-border-color);
  font-weight: 600;
  color: var(--el-text-color-primary);
  text-align: center;
  vertical-align: middle;
  padding: 0 8px;
}

.unit-table td {
  height: 44px;
  text-align: center;
  vertical-align: middle;
  padding: 0 8px;
  color: var(--el-text-color-primary);
}

.unit-table tbody tr:last-child td {
  border-bottom: none;
}

/* 行之间无线 */
.unit-table tbody tr + tr td {
  border-top: none;
}

/* rowspan 单元格内容垂直居中 */
.unit-table td[rowspan] {
  vertical-align: middle;
}

/* rowspan 单元格内部 flex 居中 */
.cell-center {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: transparent;
}

/* 列宽 */
.th-input, .td-input {
  width: 110px;
  min-width: 110px;
}

.th-unit, .td-unit {
  width: 100px;
  min-width: 100px;
}

.th-result, .td-result {
  width: 110px;
  min-width: 110px;
}

.th-formula, .td-formula {
  width: 200px;
  text-align: left;
  white-space: nowrap;
}

.th-empty, .td-empty {
  width: 100%;
  border: none;
  padding: 0;
}

/* 目标单位只读框 */
.target-unit-input {
  width: 100%;
}
.target-unit-input :deep(.el-input__inner) {
  cursor: help;
  text-align: center;
}

/* 换算关系标签 */
.formula-tag {
  height: 24px;
  line-height: 22px;
  padding: 0 8px;
  font-size: 12px;
  background-color: var(--el-fill-color-light);
  border-color: var(--el-text-color-primary);
  color: var(--el-text-color-primary);
  font-weight: 600;
  border-radius: 4px;
  white-space: nowrap;
  min-width: 170px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* ==================== 下方单位对照表 ==================== */
.convert-table-section {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-top: 4px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  margin-bottom: 2px;
}

.section-title {
  font-size: 13px;
  font-weight: bold;
  color: var(--el-text-color-primary);
}

.base-unit-selector {
  display: flex;
  align-items: center;
  gap: 4px;
}

.base-unit-label {
  font-size: 13px;
  color: var(--el-text-color-primary);
}

.base-unit-btn {
  color: var(--el-text-color-primary);
  border-color: var(--el-border-color);
  transition: all 0.3s ease;
  min-width: 80px;
}

.base-unit-btn:hover {
  color: var(--el-text-color-primary);
  border-color: var(--el-text-color-primary);
  background-color: var(--el-fill-color);
}

.convert-table {
  flex: 1;
  overflow-y: auto;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  background-color: var(--el-bg-color);
}

.convert-table .table-header {
  display: flex;
  padding: 0 3px;
  height: 40px;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  font-size: 13px;
  color: var(--el-text-color-primary);
  position: sticky;
  top: 0;
  z-index: 1;
  align-items: center;
}

.convert-table .table-header > span {
  display: flex;
  align-items: center;
  justify-content: center;
}

.convert-table .table-header > .col-unit-name,
.convert-table .table-header > .col-formula,
.convert-table .table-header > .col-base-formula {
  justify-content: flex-start;
}

.convert-table .table-body {
  background-color: var(--el-bg-color);
}

.convert-table .table-body .table-row {
  display: flex;
  padding: 0 3px;
  height: 40px;
  border-bottom: 1px solid var(--el-border-color-light);
  font-size: 13px;
  color: var(--el-text-color-primary);
  align-items: center;
  transition: background-color 0.2s;
}

.convert-table .table-body .table-row > span {
  display: flex;
  align-items: center;
  justify-content: center;
}

.convert-table .table-body .table-row > .col-unit-name,
.convert-table .table-body .table-row > .col-formula,
.convert-table .table-body .table-row > .col-base-formula {
  justify-content: flex-start;
}

.convert-table .table-body .table-row:last-child {
  border-bottom: none;
}

.convert-table .table-body .table-row:hover {
  background-color: var(--el-fill-color);
}

.convert-table .table-body .table-row.highlight {
  background-color: var(--el-fill-color);
  color: var(--el-text-color-primary);
  font-weight: 500;
  border-left: 3px solid var(--el-text-color-primary);
  padding-left: 4px;
}

.convert-table .col-unit-name {
  width: 22%;
  min-width: 70px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.convert-table .col-symbol {
  width: 15%;
  min-width: 40px;
  color: var(--el-text-color-primary);
}

.convert-table .col-formula {
  width: 28%;
  min-width: 100px;
  color: var(--el-text-color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.convert-table .col-base-formula {
  width: 35%;
  min-width: 120px;
  color: var(--el-text-color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.symbol-text.base-active {
  color: var(--el-text-color-primary);
  font-weight: 600;
  border: 1px solid var(--el-border-color);
  border-radius: 3px;
  padding: 0 1px;
  display: inline-block;
  line-height: 1.2;
  transition: all 0.3s ease;
}

.no-arrow-select :deep(.el-input__suffix),
.no-arrow-select :deep(.el-select__suffix),
.no-arrow-select :deep(.el-input__suffix-inner),
.no-arrow-select :deep(.el-select__caret),
.no-arrow-select :deep(.el-icon-arrow-down),
.no-arrow-select :deep(.el-select .el-input__icon) {
  display: none;
  visibility: hidden;
  opacity: 0;
  width: 0;
  height: 0;
  overflow: hidden;
}
.no-arrow-select :deep(.el-input__inner) {
  text-align: center;
  padding-right: 4px;
  padding-left: 4px;
}
.no-arrow-select :deep(.el-input__wrapper) {
  padding-right: 0;
  padding-left: 0;
  justify-content: center;
}
.no-arrow-select :deep(.el-select__selection) {
  justify-content: center;
}
.no-arrow-select :deep(.el-select__selected-item) {
  text-align: center;
}

.center-input :deep(.el-input__inner) {
  text-align: center;
}

@media screen and (max-width: 768px) {
  .unit-table th,
  .unit-table td {
    padding: 0 4px;
  }
}
</style>
