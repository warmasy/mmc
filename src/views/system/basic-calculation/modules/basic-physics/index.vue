<template>
  <div class="basic-physics-panel">
    <SubTypeTabs
      :subTypes="currentCategory.subTypes"
      v-model="currentSubTypeId"
    />

    <ImageSection :images="currentSubType?.images || []" />

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
import { basicPhysicsCategories } from './categories'
import { useBasicPhysicsCalc } from './composables/useBasicPhysicsCalc'
import SubTypeTabs from './components/SubTypeTabs.vue'
import ImageSection from './components/ImageSection.vue'
import ParamInputPanel from './components/ParamInputPanel.vue'
import ResultPanel from './components/ResultPanel.vue'

const props = defineProps({
  activeTypeId: { type: String, default: '' }
})

const categories = basicPhysicsCategories

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
} = useBasicPhysicsCalc(props)
</script>

<style scoped lang="less">
.basic-physics-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
  gap: 6px;
}
</style>
