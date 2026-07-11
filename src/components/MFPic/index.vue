<template>
  <div class="mfpic-section">
    <div class="mfpic-item" v-for="(img, idx) in images" :key="idx">
      <img :src="img.src" class="mfpic-image" :alt="img.label || img.desc || ''" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  images: { type: Array, default: () => [] }
})
</script>

<style scoped lang="less">
.mfpic-section {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.mfpic-item {
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

.mfpic-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 4px;
  display: block;
}

@media screen and (max-width: 768px) {
  .mfpic-section {
    flex-direction: column;
  }
  .mfpic-item {
    height: 140px;
  }
}
</style>
