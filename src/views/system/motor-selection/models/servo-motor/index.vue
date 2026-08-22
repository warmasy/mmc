<template>
  <MotorCalcLayout
    :inputParams="inputParams"
    :outputParams="outputParams"
    :form="form"
    :result="result"
    :statusText="statusText"
    :resultNotes="resultNotes"
    :readonlyDisplay="{ inertiaRatio: inertiaRatioDisplay }"
    @calculate="handleCalculate"
    @reset="handleReset"
    @help="showHelp"
  />
</template>

<script setup name="ServoMotorSelection">
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
  calculateServoMotor,
  getInertiaRatioDisplay,
  validateParams
} from './calculator'

const props = defineProps({
  projectName: { type: String, default: '' },
  projectNo: { type: String, default: '' }
})

const emit = defineEmits(['update:projectName', 'update:projectNo', 'refreshUUID'])

// ==================== 表单数据 ====================
const form = reactive(getDefaultForm())

watch(() => form.projectName, (val) => emit('update:projectName', val))
watch(() => form.projectNo, (val) => emit('update:projectNo', val))

// ==================== 计算结果 ====================
const result = reactive(getDefaultResult())

// ==================== 状态文本 ====================
const statusText = ref('等待输入参数...')
let isResetting = false

watch(form, () => {
  if (isResetting) return
  const current = statusText.value
  if (current !== '参数已更新，请重新计算' && current !== '已重置' && current !== '等待输入参数...') {
    statusText.value = '参数已更新，请重新计算'
  }
}, { deep: true })

// ==================== 惯量比显示 ====================
const inertiaRatioDisplay = computed(() => getInertiaRatioDisplay(form))

// ==================== 计算函数 ====================
function handleCalculate() {
  emit('refreshUUID')
  const error = validateParams(form)
  if (error) {
    statusText.value = '参数错误：' + error
    ElMessage.warning(error)
    return
  }

  try {
    const { result: calcResult, status } = calculateServoMotor(form)
    Object.assign(result, calcResult)
    statusText.value = status
    ElMessage.success('计算完成')
  } catch (e) {
    statusText.value = '计算错误'
    ElMessage.error('计算错误: ' + e.message)
  }
}

// ==================== 重置表单 ====================
function handleReset() {
  isResetting = true
  Object.assign(form, getDefaultForm())
  Object.assign(result, getDefaultResult())
  statusText.value = '已重置'
  ElMessage.info('已重置')
  isResetting = false
}

// ==================== 帮助 ====================
function showHelp() {
  ElMessageBox.alert(
    `伺服电机选型计算帮助：\n\n1. 选择驱动方式（直接/减速机/丝杠）\n2. 输入负载质量、运动行程、时间等参数\n3. 填写机械效率和安全系数\n4. 点击"计算"获取选型结果\n5. 根据推荐型号查阅电机手册确认\n\n参数说明：\n• 惯量比 JR = JL / JM，建议 < 10（高惯量电机可放宽至 30）\n• 安全系数 Sf 建议 1.2~2.0\n• 机械效率 η：丝杠 0.9~0.95，齿轮 0.8~0.9`,
    '伺服电机选型帮助',
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
