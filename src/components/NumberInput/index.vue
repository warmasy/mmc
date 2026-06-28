<template>
  <input
    type="text"
    inputmode="decimal"
    :value="modelValue"
    :style="computedStyle"
    class="native-number-input"
    @input="handleInput"
    @wheel.prevent="handleWheel"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [Number, String], default: '' },
  step: { type: [Number, String], default: 1 },
  min: { type: Number, default: -Infinity },
  max: { type: Number, default: Infinity },
  precision: { type: Number, default: 3 },
  width: { type: [Number, String], default: 100 },
  align: { type: String, default: 'center', validator: v => ['left', 'center', 'right'].includes(v) }
})

const emit = defineEmits(['update:modelValue', 'input', 'change'])

const computedStyle = computed(() => {
  const w = typeof props.width === 'number' ? `${props.width}px` : props.width
  return {
    width: w,
    textAlign: props.align
  }
})

function handleInput(e) {
  let val = e.target.value
  if (val !== '' && val !== null) {
    const num = parseFloat(val)
    if (!isNaN(num)) {
      if (props.precision >= 0) {
        val = parseFloat(num.toFixed(props.precision))
      }
      emit('update:modelValue', val)
      emit('input', val)
      emit('change', val)
    } else {
      emit('update:modelValue', val)
      emit('input', val)
    }
  } else {
    emit('update:modelValue', val)
    emit('input', val)
  }
}

let wheelTimer = null
function handleWheel(e) {
  if (props.readonly) return
  e.preventDefault()
  if (wheelTimer) return
  wheelTimer = setTimeout(() => { wheelTimer = null }, 30)
  const delta = e.deltaY > 0 ? -1 : 1
  const stepVal = parseFloat(props.step) || 1
  let currentVal = parseFloat(props.modelValue)
  if (isNaN(currentVal)) currentVal = 0
  let newVal = currentVal + delta * stepVal
  if (props.min !== -Infinity && newVal < props.min) newVal = props.min
  if (props.max !== Infinity && newVal > props.max) newVal = props.max
  if (props.precision >= 0) {
    newVal = parseFloat(newVal.toFixed(props.precision))
  } else if (stepVal < 1) {
    const stepDecimals = stepVal.toString().split('.')[1]?.length || 0
    newVal = parseFloat(newVal.toFixed(stepDecimals))
  }
  emit('update:modelValue', newVal)
  emit('input', newVal)
  emit('change', newVal)
}
</script>

<style scoped>
.native-number-input {
  width: 100px;
  height: 24px;
  min-height: 24px;
  max-height: 24px;
  padding: 0 8px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  font-size: 12px;
  color: var(--el-text-color-primary);
  background: var(--el-bg-color);
  outline: none;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  margin: 0;
  appearance: none;
  -webkit-appearance: none;
  scrollbar-width: none;
  -ms-overflow-style: none;
  transition: none !important;
  animation: none !important;
}

.native-number-input::-webkit-scrollbar {
  display: none;
}

.native-number-input:focus {
  border-color: var(--el-color-primary);
  outline: none;
  box-shadow: none;
}
</style>
