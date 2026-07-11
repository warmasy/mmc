<template>
  <div class="inertia-calc-panel">
    <SubTypeTabs
      :subTypes="currentCategory.subTypes"
      v-model="currentSubTypeId"
    />

    <MFPic :images="currentSubType?.images || []" />

    <ParamInputPanel
      :title="currentSubType?.name || currentCategory?.name"
      :params="currentParams"
      v-model="params"
      :calculating="calculating"
      :statusText="statusText"
      @change="onParamChange"
      @calculate="calculate"
    />

    <ResultPanel :results="results" />
  </div>
</template>

<script setup>
import { inertiaCategories } from './categories'
import { useInertiaCalc } from './composables/useInertiaCalc'
import SubTypeTabs from './components/SubTypeTabs.vue'
import MFPic from '@/components/MFPic/index.vue'
import ParamInputPanel from './components/ParamInputPanel.vue'
import ResultPanel from './components/ResultPanel.vue'

const props = defineProps({
  activeTypeId: { type: String, default: '' }
})

const categories = inertiaCategories

const {
  currentCategoryId,
  currentCategory,
  currentSubTypeId,
  currentSubType,
  params,
  results,
  calculating,
  statusText,
  currentParams,
  onParamChange,
  calculate
} = useInertiaCalc(props)
</script>

<style scoped lang="less">
.inertia-calc-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
  gap: 12px;
}
</style>
