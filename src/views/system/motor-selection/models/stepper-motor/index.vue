<template>
  <MotorCalcLayout
    :inputParams="inputParams"
    :outputParams="outputParams"
    :form="form"
    :result="result"
    :statusText="statusText"
    :resultNotes="resultNotes"
    @calculate="handleCalculate"
    @reset="handleReset"
    @help="showHelp"
  />
</template>

<script setup name="StepperMotorSelection">
import { ElMessage, ElMessageBox } from 'element-plus'
import MotorCalcLayout from '../../components/MotorCalcLayout.vue'
import {
  inputParams,
  outputParams,
  resultNotes,
  getDefaultForm,
  getDefaultResult
} from './config'
import {
  calculateStepperMotor,
  validateParams
} from './calculator'

const props = defineProps({
  projectName: { type: String, default: '' },
  projectNo: { type: String, default: '' }
})

const emit = defineEmits(['update:projectName', 'update:projectNo', 'refreshUUID'])

const form = reactive(getDefaultForm())
watch(() => form.projectName, (val) => emit('update:projectName', val))
watch(() => form.projectNo, (val) => emit('update:projectNo', val))

const result = reactive(getDefaultResult())
const statusText = ref('等待输入参数...')
let isResetting = false

watch(form, () => {
  if (isResetting) return
  const current = statusText.value
  if (current !== '参数已更新，请重新计算' && current !== '已重置' && current !== '等待输入参数...') {
    statusText.value = '参数已更新，请重新计算'
  }
}, { deep: true })

function handleCalculate() {
  emit('refreshUUID')
  const error = validateParams(form)
  if (error) {
    statusText.value = '参数错误：' + error
    ElMessage.warning(error)
    return
  }
  try {
    const { result: calcResult, status } = calculateStepperMotor(form)
    Object.assign(result, calcResult)
    statusText.value = status
    ElMessage.success('计算完成')
  } catch (e) {
    statusText.value = '计算错误'
    ElMessage.error('计算错误: ' + e.message)
  }
}

function handleReset() {
  isResetting = true
  Object.assign(form, getDefaultForm())
  Object.assign(result, getDefaultResult())
  statusText.value = '已重置'
  ElMessage.info('已重置')
  isResetting = false
}

function showHelp() {
  ElMessageBox.alert(
    `步进电机选型帮助：\n\n该选型模块正在开发中，敬请期待。\n\n预留功能：\n• 开环/闭环控制方式选择\n• 脉冲频率计算\n• 步距角与分辨率匹配\n• 失步扭矩校核`,
    '步进电机选型帮助',
    { confirmButtonText: '知道了' }
  )
}

defineExpose({
  calculate: handleCalculate,
  reset: handleReset,
  help: showHelp,
  getStatus: () => statusText.value
})
</script>
