<template>
  <input
    type="number"
    :value="modelValue"
    :step="step"
    :min="min"
    :max="max"
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

function handleWheel(e) {
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
  padding: 0 8px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  font-size: 12px;
  color: var(--el-text-color-primary);
  background: var(--el-bg-color);
  outline: none;
}

.native-number-input:focus {
  border-color: var(--el-color-primary);
}

.native-number-input::-webkit-inner-spin-button,
.native-number-input::-webkit-outer-spin-button {
  opacity: 0;
  transition: opacity 0.2s;
  height: 16px;
  padding: 1px 0;
}

.native-number-input:hover::-webkit-inner-spin-button,
.native-number-input:hover::-webkit-outer-spin-button {
  opacity: 1;
}

.native-number-input { -moz-appearance: textfield; }
.native-number-input:hover { -moz-appearance: number-input; }
</style>
