<template>
  <div class="image-section">
    <div class="image-item" v-for="(img, idx) in images" :key="idx">
      <img :src="img.src" class="calc-image" :alt="img.label" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  images: { type: Array, default: () => [] }
})
</script>

<style scoped lang="less">
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

@media screen and (max-width: 768px) {
  .image-section {
    flex-direction: column;
  }
  .image-item {
    height: 140px;
  }
}
</style>
