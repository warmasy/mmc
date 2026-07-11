<template>
  <div class="inertia-calc-panel">
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
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import NumberInput from '@/components/NumberInput/index.vue'
import { formatResult } from '../../utils'
import { inertiaModels, getInertiaModelById, getDefaultInertiaModel } from './config'

const props = defineProps({
  activeTypeId: { type: String, default: '' }
})

const emit = defineEmits(['update:status'])

const currentInertiaId = ref(props.activeTypeId || getDefaultInertiaModel().id)
const currentInertia = computed(() => getInertiaModelById(currentInertiaId.value))
const inertiaParams = ref({})
const inertiaResult = ref(null)

watch(() => props.activeTypeId, (id) => {
  if (id && id !== currentInertiaId.value) {
    currentInertiaId.value = id
    initInertiaParams()
    calcInertia()
    emit('update:status', '已切换模型，等待输入...')
  }
}, { immediate: true })

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
  emit('update:status', '计算完成')
}

onMounted(() => {
  initInertiaParams()
  calcInertia()
})
</script>

<style scoped lang="less">
.inertia-calc-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.inertia-desc {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.desc-text {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.convert-input-section {
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  padding: 16px;
  flex-shrink: 0;
  margin-bottom: 16px;
}

.inertia-input-row {
  display: flex;
  align-items: flex-end;
  gap: 20px;
  flex-wrap: wrap;
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

.param-unit {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  text-align: center;
}

.convert-table-section {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  contain: layout;
}

.inertia-result-section {
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  padding: 16px;
}

.section-title {
  font-size: 13px;
  font-weight: bold;
  color: var(--el-text-color-primary);
  flex-shrink: 0;
  margin-bottom: 12px;
}

.inertia-result {
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

.result-label {
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
  .inertia-input-row {
    gap: 12px;
  }
}
</style>
