<template>
  <el-card :body-style="{ padding: '2px' }">
    <template #header>
      <div class="card-header">
        <span class="quote-title" @click="refreshQuote" style="cursor: pointer">今日一言</span>
      </div>
    </template>
    <div class="daily-quote">
      <div class="quote-text">{{ currentQuote.text }}</div>
      <div class="quote-author">—— {{ currentQuote.author }}</div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, computed } from 'vue';
import { quotes } from '../data';

const currentQuoteIndex = ref(Math.floor(Math.random() * quotes.length));
const currentQuote = computed(() => quotes[currentQuoteIndex.value]);

function refreshQuote() {
  let newIndex;
  do { newIndex = Math.floor(Math.random() * quotes.length); }
  while (newIndex === currentQuoteIndex.value && quotes.length > 1);
  currentQuoteIndex.value = newIndex;
}
</script>

<style scoped lang="less">
.card-header { display: flex; justify-content: space-between; align-items: center; font-weight: 500; }
:deep(.el-card) { border-radius: 0; box-shadow: none; }
.daily-quote { text-align: left; }
.quote-title { cursor: pointer; user-select: none; &:hover { color: #000000; } }
.quote-text { font-size: 15px; line-height: 1.8; color: var(--el-text-color-primary); margin-bottom: 4px; font-family: inherit; letter-spacing: 0.3px; }
.quote-author { font-size: 13px; color: #000000; text-align: right; font-family: inherit; }
</style>
