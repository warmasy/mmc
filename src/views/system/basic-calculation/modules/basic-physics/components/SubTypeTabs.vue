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
  gap: 2px;
  flex-shrink: 0;
  flex-wrap: wrap;
  max-height: 80px;
  overflow-y: auto;
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 2px;
  margin-bottom: 2px;
}

.sub-type-tab {
  padding: 1px 2px;
  font-size: 12px;
  font-weight: 500;
  color: #000000;
  cursor: pointer;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  transition: all 0.2s;
  white-space: nowrap;
}

.sub-type-tab:hover {
  border-color: #000000;
  color: #000000;
}

.sub-type-tab.active {
  background-color: #ffffff;
  border-color: #000000;
  color: #000000;
}

@media screen and (max-width: 768px) {
  .sub-type-tabs {
    max-height: 120px;
  }
}
</style>
