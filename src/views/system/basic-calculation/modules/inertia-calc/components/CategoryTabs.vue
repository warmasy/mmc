<template>
  <div class="category-tabs">
    <div
      v-for="cat in categories"
      :key="cat.id"
      :class="['category-tab', { active: modelValue === cat.id }]"
      @click="$emit('update:modelValue', cat.id)"
    >
      {{ cat.name }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  categories: { type: Array, required: true },
  modelValue: { type: String, default: '' }
})

defineEmits(['update:modelValue'])
</script>

<style scoped lang="less">
.category-tabs {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--el-border-color-light);
  padding-bottom: 8px;
  margin-bottom: 4px;
}

.category-tab {
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-color-regular);
  cursor: pointer;
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  transition: all 0.2s;
  white-space: nowrap;
}

.category-tab:hover {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}

.category-tab.active {
  background-color: var(--el-color-primary-light-9);
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}

@media screen and (max-width: 768px) {
  .category-tabs {
    flex-wrap: wrap;
  }
}
</style>
