<template>
  <div class="inertia-calc-panel">
    <!-- 大类选项卡 -->
    <div class="category-tabs">
      <div
        v-for="cat in categories"
        :key="cat.id"
        :class="['category-tab', { active: currentCategoryId === cat.id }]"
        @click="selectCategory(cat.id)"
      >
        {{ cat.name }}
      </div>
    </div>

    <!-- 子类型选项卡 -->
    <div v-if="currentCategory.subTypes" class="sub-type-tabs" @wheel.prevent="handleWheelSubType">
      <div
        v-for="sub in currentCategory.subTypes"
        :key="sub.id"
        :class="['sub-type-tab', { active: currentSubTypeId === sub.id }]"
        @click="selectSubType(sub.id)"
      >
        {{ sub.name }}
      </div>
    </div>

    <!-- 图片区域 -->
    <div class="image-section">
      <div class="image-item" v-for="(img, idx) in currentCategory.images" :key="idx">
        <img :src="img.src" class="calc-image" />
      </div>
    </div>

    <!-- 参数输入区域 -->
    <fieldset class="param-fieldset">
      <legend>{{ currentSubType?.name || currentCategory?.name }}</legend>
      <div class="param-section">
      <div class="param-row" v-for="(param, key) in currentParams" :key="key">
        <span class="param-label">{{ param.name }}</span>
        <NumberInput
          v-model="params[key]"
          :step="param.step || 1"
          :precision="param.precision || 4"
          :width="120"
          :min="param.min !== undefined ? param.min : 0"
          @change="onParamChange"
        />
        <span class="param-unit">{{ param.unit }}</span>
      </div>
      </div>
    </fieldset>

    <!-- 计算按钮 -->
    <div class="calc-button-row">
      <el-button type="primary" size="default" @click="calculate" :loading="calculating">
        <el-icon><Cpu /></el-icon>
        <span>计算</span>
      </el-button>
    </div>

    <!-- 计算结果 -->
    <div v-if="results.length" class="result-section">
      <div class="result-title">计算结果</div>
      <div class="result-list">
        <div class="result-row" v-for="result in results" :key="result.id">
          <span class="result-name">{{ result.name }}</span>
          <span class="result-value">{{ result.value }} {{ result.unit }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Cpu } from '@element-plus/icons-vue'
import NumberInput from '@/components/NumberInput/index.vue'
import { formatResult } from '../../utils'
import { inertiaCategories, getCategoryById, getDefaultCategory, getSubTypeById } from './config'

const props = defineProps({
  activeTypeId: { type: String, default: '' }
})

const emit = defineEmits(['update:status'])

const currentCategoryId = ref(props.activeTypeId || getDefaultCategory().id)
const currentCategory = computed(() => getCategoryById(currentCategoryId.value))

const currentSubTypeId = ref('')
const currentSubType = computed(() => {
  return getSubTypeById(currentCategoryId.value, currentSubTypeId.value)
})

const params = ref({})
const results = ref([])
const calculating = ref(false)

// 当前参数定义
const currentParams = computed(() => {
  if (currentSubType.value && currentSubType.value.params) {
    return currentSubType.value.params
  }
  return {}
})

// 初始化参数
function initParams() {
  const p = {}
  const paramDefs = currentParams.value
  for (const key in paramDefs) {
    p[key] = paramDefs[key].default !== undefined ? paramDefs[key].default : 0
  }
  params.value = p
  results.value = []
}

// 监听分类变化（来自左侧选型卡）
watch(() => props.activeTypeId, (id) => {
  if (id && id !== currentCategoryId.value) {
    currentCategoryId.value = id
  }
})

// 监听当前分类变化，自动选中第一个子类型
watch(() => currentCategoryId.value, () => {
  if (currentCategory.value.subTypes && currentCategory.value.subTypes.length) {
    currentSubTypeId.value = currentCategory.value.subTypes[0].id
  }
  initParams()
  emit('update:status', '已切换分类，等待输入...')
}, { immediate: true })

// 监听子类型变化
watch(() => currentSubTypeId.value, () => {
  initParams()
  emit('update:status', '已切换子类型，等待输入...')
})

function selectSubType(id) {
  currentSubTypeId.value = id
}

function handleWheelSubType(e) {
  if (!currentCategory.value.subTypes) return
  const subs = currentCategory.value.subTypes
  const idx = subs.findIndex(s => s.id === currentSubTypeId.value)
  if (idx === -1) return
  const newIdx = e.deltaY > 0 ? (idx + 1) % subs.length : (idx - 1 + subs.length) % subs.length
  currentSubTypeId.value = subs[newIdx].id
}

function onParamChange() {
  emit('update:status', '参数已修改，请点击计算')
}

function calculate() {
  calculating.value = true

  const p = params.value
  const sub = currentSubType.value
  const res = []

  // 检查参数有效性
  for (const key in currentParams.value) {
    if (p[key] === undefined || p[key] === null || isNaN(p[key]) || p[key] < 0) {
      results.value = []
      calculating.value = false
      emit('update:status', '参数无效，请检查输入')
      return
    }
  }

  if (sub && sub.results) {
    for (const r of sub.results) {
      if (r.formula && typeof r.formula === 'function') {
        try {
          const val = r.formula(p)
          res.push({
            id: r.id,
            name: r.name,
            value: formatResult(val),
            unit: r.unit
          })
        } catch (e) {
          console.error('计算错误:', e)
        }
      }
    }
  }

  results.value = res
  calculating.value = false
  emit('update:status', '计算完成')
}
</script>

<style scoped lang="less">
.inertia-calc-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
  gap: 10px;
}

.param-fieldset {
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  padding: 8px 16px 12px 16px;
  margin: 0;
  background-color: var(--el-bg-color);
  flex-shrink: 0;
}

.param-fieldset legend {
  font-weight: bold;
  color: var(--el-text-color-primary);
  padding: 0 6px;
  font-size: 13px;
}

/* 子类型选项卡 */
.sub-type-tabs {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
  flex-wrap: wrap;
  max-height: 80px;
  overflow-y: auto;
  border-bottom: 1px solid var(--el-border-color-light);
  padding-bottom: 8px;
  margin-bottom: 4px;
}

.sub-type-tab {
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  color: var(--el-text-color-regular);
  cursor: pointer;
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  transition: all 0.2s;
  white-space: nowrap;
}

.sub-type-tab:hover {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}

.sub-type-tab.active {
  background-color: var(--el-color-primary-light-9);
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}

/* 图片区域 */
.image-section {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.image-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  height: 180px;
  overflow: hidden;
  border: 2px solid var(--el-border-color);
  border-radius: 4px;
  background-color: var(--el-bg-color);
}

.calc-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 4px;
  display: block;
}

/* 参数区域 */
.param-section {
  padding: 4px 0 0 0;
  flex-shrink: 0;
}

.param-row {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-right: 20px;
  margin-bottom: 12px;
}

.param-label {
  font-size: 13px;
  color: var(--el-text-color-regular);
  font-weight: 500;
  white-space: nowrap;
}

.param-unit {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}

/* 计算按钮 */
.calc-button-row {
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}

.calc-button-row :deep(.el-button) {
  padding: 10px 32px;
  font-size: 14px;
}

/* 结果区域 */
.result-section {
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  padding: 16px;
  flex-shrink: 0;
}

.result-title {
  font-size: 13px;
  font-weight: bold;
  color: var(--el-text-color-primary);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
}

.result-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.result-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-color-primary);
  font-family: 'Courier New', monospace;
}

@media screen and (max-width: 768px) {
  .category-tabs {
    flex-wrap: wrap;
  }
  .sub-type-tabs {
    max-height: 120px;
  }
  .image-section {
    flex-direction: column;
  }
  .image-item {
    height: 140px;
  }
  .param-row {
    display: flex;
    width: 100%;
    margin-right: 0;
  }
}
</style>
