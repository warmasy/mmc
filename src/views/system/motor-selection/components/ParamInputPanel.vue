<template>
  <div class="param-panel">
    <!-- 遍历输入参数对象动态生成分组 -->
    <template v-for="(group, groupName) in inputParams" :key="groupName">
      <!-- 图片分组 -->
      <div v-if="group.type === 'image'" class="image-section">
        <div class="image-item" v-for="(item, label) in group.items" :key="label">
          <div class="image-title">{{ label }}</div>
          <img :src="item.src" :alt="label" class="calc-image" />
        </div>
      </div>

      <!-- 单选分组 -->
      <fieldset v-else-if="group.type === 'radio'" class="calc-fieldset">
        <legend>{{ groupName }}</legend>
        <div class="param-grid">
          <div v-for="(item, label) in group.items" :key="label" class="param-group" style="flex: 1 1 100%">
            <span class="param-label">{{ label }}</span>
            <div class="radio-group">
              <label class="radio-item" v-for="(optLabel, optVal) in item.options" :key="optVal">
                <input type="radio" :value="optVal" v-model="form[item.key]" />
                <span>{{ optLabel }}</span>
              </label>
            </div>
          </div>
        </div>
      </fieldset>

      <!-- 数字输入分组 -->
      <fieldset v-else-if="group.type === 'number'" class="calc-fieldset">
        <legend>{{ groupName }}</legend>
        <div class="param-grid">
          <div class="param-row">
            <div class="param-group" v-for="(item, label) in group.items" :key="label"
                 v-show="!item.showIf || form.motionMode === item.showIf">
              <el-tooltip :content="item.desc || label" placement="top" :show-after="300">
                <span class="param-label">{{ label }}</span>
              </el-tooltip>
              <!-- 下拉选择 -->
              <el-select v-if="item.type === 'select'" v-model="form[item.key]" placeholder="请选择" size="small" style="width: 100px">
                <el-option v-for="(optLabel, optVal) in item.options" :key="optVal" :label="optLabel" :value="optVal" />
              </el-select>
              <!-- 只读计算值 -->
              <el-input v-else-if="item.readonly" v-model="readonlyDisplay[item.key]" readonly size="small" style="width: 110px" />
              <!-- 数字输入 -->
              <el-input-number v-else v-model="form[item.key]" :step="item.step || 1" :precision="item.precision"
                :min="item.min !== undefined ? item.min : -Infinity" :max="item.max !== undefined ? item.max : Infinity"
                controls-position="right" size="small" style="width: 110px"
                @wheel.prevent="handleWheel($event, item)" />
              <span class="param-unit" v-if="item.unit !== undefined">{{ item.unit }}</span>
            </div>
          </div>
        </div>
      </fieldset>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  inputParams: { type: Object, required: true },
  form: { type: Object, required: true },
  readonlyDisplay: { type: Object, default: () => ({}) }
})

function handleWheel(e, item) {
  e.preventDefault()
  const delta = e.deltaY > 0 ? -1 : 1
  const step = item.step || 1
  const precision = item.precision || 0
  let currentVal = parseFloat(props.form[item.key])
  if (isNaN(currentVal)) currentVal = 0
  let newVal = currentVal + delta * step
  if (item.min !== undefined && newVal < item.min) newVal = item.min
  if (item.max !== undefined && newVal > item.max) newVal = item.max
  if (precision > 0) {
    newVal = parseFloat(newVal.toFixed(precision))
  } else if (step < 1) {
    const stepDecimals = step.toString().split('.')[1]?.length || 0
    newVal = parseFloat(newVal.toFixed(stepDecimals))
  }
  props.form[item.key] = newVal
}
</script>

<style scoped>
.param-panel { display: flex; flex-direction: column; gap: 12px; }

/* 图片 */
.image-section { display: flex; gap: 12px; margin-bottom: 4px; }
.image-item { flex: 1; display: flex; flex-direction: column; align-items: center; background-color: var(--el-fill-color); border: 1px solid var(--el-border-color-light); border-radius: 4px; padding: 8px 6px; min-width: 0; }
.image-title { font-size: 12px; font-weight: 600; color: var(--el-color-primary); margin-bottom: 6px; text-align: center; }
.calc-image { width: 100%; height: 110px; object-fit: contain; border-radius: 2px; }

/* 分组框 */
.calc-fieldset { border: 1px solid var(--el-border-color); border-radius: 4px; padding: 10px 12px; background-color: var(--el-fill-color-light); margin: 0; }
.calc-fieldset legend { font-weight: bold; color: var(--el-text-color-primary); padding: 0 6px; font-size: 13px; }

/* 单选 */
.radio-group { display: flex; gap: 20px; flex-wrap: wrap; }
.radio-item { display: flex; align-items: center; gap: 4px; cursor: pointer; font-size: 13px; color: var(--el-text-color-regular); }
.radio-item input[type="radio"] { margin: 0; }

/* 参数网格 */
.param-grid { display: flex; flex-direction: column; gap: 8px; }
.param-row { display: flex; flex-wrap: wrap; gap: 8px 0; }
.param-group { display: flex; align-items: center; gap: 6px; flex: 1; min-width: 200px; margin-bottom: 4px; }
.param-label { min-width: 90px; text-align: right; font-size: 13px; color: var(--el-text-color-regular); white-space: nowrap; cursor: help; }
.param-unit { font-size: 13px; color: var(--el-text-color-secondary); min-width: 24px; white-space: nowrap; }

@media (max-width: 1200px) { .param-group { min-width: 180px; } }
@media (max-width: 768px) { .param-row { flex-direction: column; } .param-group { min-width: 100%; } }
</style>
