import { ref, computed, watch } from 'vue'
import { getCategoryById, getDefaultCategory, getSubTypeById } from '../categories'
import { formatResult } from '../../../utils'

export function useBasicPhysicsCalc(props, emit) {
  const currentCategoryId = ref(props.activeTypeId || getDefaultCategory().id)
  const currentCategory = computed(() => getCategoryById(currentCategoryId.value))

  const currentSubTypeId = ref('')
  const currentSubType = computed(() => {
    return getSubTypeById(currentCategoryId.value, currentSubTypeId.value)
  })

  const params = ref({})
  const results = ref([])
  const calculating = ref(false)
  const statusText = ref('')

  const currentParams = computed(() => {
    if (currentSubType.value && currentSubType.value.params) {
      return currentSubType.value.params
    }
    return {}
  })

  function initParams() {
    const p = {}
    const paramDefs = currentParams.value
    for (const key in paramDefs) {
      p[key] = paramDefs[key].default !== undefined ? paramDefs[key].default : 0
    }
    params.value = p
    results.value = []
  }

  watch(() => props.activeTypeId, (id) => {
    if (id && id !== currentCategoryId.value) {
      currentCategoryId.value = id
    }
  })

  watch(() => currentCategoryId.value, () => {
    if (currentCategory.value.subTypes && currentCategory.value.subTypes.length) {
      currentSubTypeId.value = currentCategory.value.subTypes[0].id
    }
    initParams()
    statusText.value = '已切换分类，等待输入...'
  }, { immediate: true })

  watch(() => currentSubTypeId.value, () => {
    initParams()
    statusText.value = '已切换子类型，等待输入...'
  })

  function onParamChange() {
    statusText.value = '参数已修改，请点击计算'
  }

  function calculate() {
    calculating.value = true
    const p = params.value
    const sub = currentSubType.value
    const res = []

    for (const key in currentParams.value) {
      if (p[key] === undefined || p[key] === null || isNaN(p[key]) || p[key] < 0) {
        results.value = []
        calculating.value = false
        statusText.value = '参数无效，请检查输入'
        return
      }
    }

    if (sub && sub.results) {
      for (const r of sub.results) {
        if (r.formula && typeof r.formula === 'function') {
          try {
            const val = r.formula(p)
            res.push({
              id: r.id,
              name: r.name,
              value: formatResult(val),
              unit: r.unit
            })
          } catch (e) {
            console.error('计算错误:', e)
          }
        }
      }
    }

    results.value = res
    calculating.value = false
    statusText.value = '计算完成'
  }

  return {
    currentCategoryId,
    currentCategory,
    currentSubTypeId,
    currentSubType,
    params,
    results,
    calculating,
    statusText,
    currentParams,
    onParamChange,
    calculate
  }
}
