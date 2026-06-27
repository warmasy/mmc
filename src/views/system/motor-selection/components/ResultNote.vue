<template>
  <div class="result-note" v-if="notes && notes.length">
    <div class="note-box">
      <div class="note-item" v-for="(note, idx) in notes" :key="idx">{{ note }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  notes: { type: Array, default: () => [] }
})
</script>

<style scoped>
.result-note {
  padding: 8px 0;
  background: transparent;
  border: none;
  flex-shrink: 0;
  margin-top: auto;
}

.note-box {
  padding: 0 12px;
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  min-height: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.note-item {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  text-align: left;
  line-height: 1.4;
}
</style>
