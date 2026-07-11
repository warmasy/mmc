<template>
  <div v-if="subTypes && subTypes.length" class="sub-type-tabs" @wheel.prevent="handleWheel">
    <div
      v-for="sub in subTypes"
      :key="sub.id"
      :class="['sub-type-tab', { active: modelValue === sub.id }]"
      @click="$emit('update:modelValue', sub.id)"
    >
      {{ sub.name }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  subTypes: { type: Array, default: () => [] },
  modelValue: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

function handleWheel(e) {
  if (!props.subTypes || !props.subTypes.length) return
  const idx = props.subTypes.findIndex(s => s.id === props.modelValue)
  if (idx === -1) return
  const newIdx = e.deltaY > 0
    ? (idx + 1) % props.subTypes.length
    : (idx - 1 + props.subTypes.length) % props.subTypes.length
  emit('update:modelValue', props.subTypes[newIdx].id)
}
</script>

<style scoped lang="less">
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
  background-color: var(--el-fill-color-light);
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}

@media screen and (max-width: 768px) {
  .sub-type-tabs {
    max-height: 120px;
  }
}
</style>
