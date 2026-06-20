<template>
  <div class="result-panel">
    <!-- 遍历计算结果对象动态生成分组 -->
    <template v-for="(group, groupName) in outputParams" :key="groupName">
      <!-- 只读回显分组 -->
      <fieldset v-if="group.type === 'readonly'" class="calc-fieldset">
        <legend>{{ groupName }}</legend>
        <div class="param-grid">
          <div class="param-row">
            <div class="param-group" v-for="(item, label) in group.items" :key="label"
                 v-show="!item.showIf || form.motionMode === item.showIf">
              <el-tooltip :content="item.desc || label" placement="top" :show-after="300">
                <span class="param-label">{{ label }}</span>
              </el-tooltip>
              <el-input v-model="form[item.key]" readonly size="small" style="width: 80px" />
              <span class="param-unit" v-if="item.unit !== undefined">{{ item.unit }}</span>
            </div>
          </div>
        </div>
      </fieldset>

      <!-- 选型结果分组 -->
      <fieldset v-else-if="group.type === 'result'" class="calc-fieldset">
        <legend>{{ groupName }}</legend>
        <div class="result-list">
          <div class="result-row" v-for="(item, label) in group.items" :key="label">
            <el-tooltip :content="item.desc || label" placement="top" :show-after="300">
              <span class="result-label">{{ label }}</span>
            </el-tooltip>
            <span class="result-value">{{ result[item.key] }} {{ item.unit }}</span>
          </div>
        </div>
      </fieldset>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  outputParams: { type: Object, required: true },
  form: { type: Object, required: true },
  result: { type: Object, required: true }
})
</script>

<style scoped>
.result-panel { display: flex; flex-direction: column; gap: 12px; }

/* 分组框 */
.calc-fieldset { border: 1px solid var(--el-border-color); border-radius: 4px; padding: 10px 12px; background-color: var(--el-fill-color-light); margin: 0; }
.calc-fieldset legend { font-weight: bold; color: var(--el-text-color-primary); padding: 0 6px; font-size: 13px; }

/* 参数网格 */
.param-grid { display: flex; flex-direction: column; gap: 8px; }
.param-row { display: flex; flex-wrap: wrap; gap: 8px 0; }
.param-group { display: flex; align-items: center; gap: 6px; flex: 1; min-width: 200px; margin-bottom: 4px; }
.param-label { min-width: 90px; text-align: right; font-size: 13px; color: var(--el-text-color-regular); white-space: nowrap; cursor: help; }
.param-unit { font-size: 13px; color: var(--el-text-color-secondary); min-width: 24px; white-space: nowrap; }

/* 选型结果 */
.result-list { display: flex; flex-direction: column; gap: 6px; }
.result-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px dotted var(--el-border-color-light); }
.result-row:last-child { border-bottom: none; }
.result-label { font-size: 13px; color: var(--el-text-color-regular); cursor: help; }
.result-value { font-weight: bold; color: var(--el-color-danger); font-family: Consolas, monospace; font-size: 13px; }

@media (max-width: 1200px) { .param-group { min-width: 180px; } }
@media (max-width: 768px) { .param-row { flex-direction: column; } .param-group { min-width: 100%; } }
</style>
