<template>
  <div class="model-page">
    <el-row :gutter="16" class="calc-row">
      <!-- 左侧参数填写卡片 -->
      <el-col :span="12" :xs="24">
        <el-card class="calc-card" :body-style="{ padding: '16px 16px 0px 16px', display: 'flex', flexDirection: 'column', height: '100%', gap: '0px' }">
          <template #header>
            <div class="card-header">
              <span>参数填写</span>
              <span class="header-status" v-if="statusText">
                <span class="status-tag">状态提示</span>
                <span class="status-text">{{ statusText }}</span>
              </span>
            </div>
          </template>

          <div class="card-content">
            <ParamInputPanel :inputParams="inputParams" :form="form" :readonlyDisplay="readonlyDisplay" />
          </div>

          <div class="card-footer">
            <div class="btn-group">
              <el-button class="calc-btn btn-help" type="info" plain icon="QuestionFilled" @click="$emit('help')">帮 助</el-button>
              <el-button class="calc-btn btn-primary" type="primary" icon="Check" @click="$emit('calculate')">计 算</el-button>
              <el-button class="calc-btn btn-danger" type="danger" plain icon="Close" @click="$emit('reset')">取 消</el-button>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧计算结果展示卡片 -->
      <el-col :span="12" :xs="24">
        <el-card class="calc-card" :body-style="{ padding: '16px 16px 0px 16px', display: 'flex', flexDirection: 'column', height: '100%', gap: '0px' }">
          <template #header>
            <div class="card-header">计算结果展示</div>
          </template>

          <div class="card-content">
            <ResultOutputPanel :outputParams="outputParams" :form="form" :result="result" />
          </div>

          <div class="card-footer result-note" v-if="resultNotes && resultNotes.length">
            <div class="note-box">
              <div class="note-item" v-for="(note, idx) in resultNotes" :key="idx">{{ note }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import ParamInputPanel from './ParamInputPanel.vue'
import ResultOutputPanel from './ResultOutputPanel.vue'

const props = defineProps({
  inputParams: { type: Object, required: true },
  outputParams: { type: Object, required: true },
  form: { type: Object, required: true },
  result: { type: Object, required: true },
  statusText: { type: String, default: '' },
  resultNotes: { type: Array, default: () => [] },
  readonlyDisplay: { type: Object, default: () => ({}) }
})

defineEmits(['calculate', 'reset', 'help'])
</script>

<style scoped>
.model-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.calc-row {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.calc-row > .el-col {
  height: 100%;
}

/* 卡片 */
.calc-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.calc-card :deep(.el-card) {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-color: var(--el-border-color-light);
  background-color: var(--el-bg-color);
}

.calc-card :deep(.el-card__body) {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0px !important;
  background-color: var(--el-bg-color);
  padding: 16px 16px 0px 16px !important;
}

.calc-card :deep(.el-card__header) {
  padding: 10px 16px;
  background-color: var(--el-fill-color-light);
  border-bottom: 1px solid var(--el-border-color-light);
}

.card-header {
  font-weight: bold;
  font-size: 14px;
  color: var(--el-text-color-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 状态提示 */
.header-status {
  display: flex;
  align-items: center;
  gap: 6px;
  max-width: 65%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-status .status-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 500;
  color: #fff;
  background-color: var(--el-color-primary);
  border-radius: 10px;
  flex-shrink: 0;
}

.header-status .status-text {
  font-size: 12px;
  font-weight: 500;
  color: var(--el-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 卡片内容区域 */
.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  padding-right: 20px;
}

.card-content::-webkit-scrollbar {
  width: 5px;
}

.card-content::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
  margin: 4px 0;
}

.card-content::-webkit-scrollbar-thumb {
  background: rgba(128, 128, 128, 0.2);
  border-radius: 3px;
  transition: background 0.2s;
}

.card-content::-webkit-scrollbar-thumb:hover {
  background: rgba(128, 128, 128, 0.4);
}

/* 卡片底部 */
.card-footer {
  flex-shrink: 0;
  padding: 8px 0;
}

/* 按钮 */
.btn-group {
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
}

.calc-btn {
  flex: 1;
  justify-content: center;
  height: 32px;
  font-size: 13px;
  padding: 0 12px;
  border-radius: 3px;
}

.calc-btn.btn-help {
  font-weight: 500;
}

.calc-btn.btn-primary {
  font-weight: bold;
  flex: 1.2;
}

.calc-btn.btn-danger {
  font-weight: 500;
}

/* 右侧底部注释 */
.card-footer.result-note {
  padding: 8px 0;
  background: transparent;
  border: none;
}

.card-footer.result-note .note-box {
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

.card-footer.result-note .note-item {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  text-align: left;
  line-height: 1.4;
}

/* 响应式 */
@media (max-width: 768px) {
  .calc-row { flex-direction: column; }
}
</style>
