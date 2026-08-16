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

function handleWheelSource(e) {
  const keys = Object.keys(currentType.value.units)
  const idx = keys.indexOf(sharedSourceUnit.value)
  if (idx === -1) return
  const newIdx = e.deltaY > 0 ? (idx + 1) % keys.length : (idx - 1 + keys.length) % keys.length
  sharedSourceUnit.value = keys[newIdx]
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
  flex-shrink: 0;
  position: relative;
}

.param-fieldset-title {
  position: absolute;
  top: -8px;
  left: 12px;
  font-weight: bold;
  font-size: 13px;
  padding: 0 6px;
  line-height: 18px;
}

/* 上方计算卡表格 */
.unit-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  overflow: hidden;
  font-size: 13px;
}

.unit-table th {
  height: 40px;
  border-bottom: 1px solid var(--el-border-color);
  font-weight: 600;
  text-align: center;
  vertical-align: middle;
  padding: 0 8px;
}

.unit-table td {
  height: 44px;
  text-align: center;
  vertical-align: middle;
  padding: 0 8px;
}

/* 列宽 */
.th-input, .td-input { width: 110px; min-width: 110px; }
.th-unit, .td-unit { width: 100px; min-width: 100px; }
.th-result, .td-result { width: 110px; min-width: 110px; }
.th-formula, .td-formula { width: 200px; text-align: left; white-space: nowrap; }
.th-empty, .td-empty { width: auto; border: none; padding: 0; }

/* 换算关系标签 */
.formula-tag {
  height: 24px;
  line-height: 22px;
  padding: 0 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
  white-space: nowrap;
  min-width: 170px;
  border: 1px solid var(--el-border-color);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 统一表格内各列控件字体（字号 / 字重 / 颜色一致，表头保持 13px） */
.unit-table :deep(.native-number-input),
.unit-table :deep(.el-input__inner),
.unit-table :deep(.el-select__wrapper),
.unit-table :deep(.el-select__selected-item) {
  font-size: 12px;
  font-weight: 400;
  font-family: inherit;
  color: var(--el-text-color-primary);
}

.unit-table :deep(.el-input__inner) {
  -webkit-text-fill-color: var(--el-text-color-primary);
}

.unit-table .formula-tag {
  font-size: 12px;
  font-weight: 400;
  color: var(--el-text-color-primary);
  border-color: var(--el-border-color);
  background-color: var(--el-fill-color-lighter);
}

/* rowspan 单元格内部 flex 居中 */
.cell-center {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
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