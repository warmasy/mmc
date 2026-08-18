import { ref } from 'vue'
import { ElMessage } from 'element-plus'

// OCCT 解析参数（提取常量，避免重复定义）
// linearDeflection 0.0006（包围盒比例 0.06%）：流畅度与曲面平滑的平衡点。
// 0.03% 过度细分（复杂件几十万面、渲染卡）；0.1% 曲面稍粗；
// 0.06% 曲面足够平滑、面数适中（配合边线显示棱线）。
const OCCT_PARAMS = {
  linearUnit: 'millimeter',
  linearDeflectionType: 'bounding_box_ratio',
  linearDeflection: 0.0006,
  angularDeflection: 0.5
}

// 文件大小限制：100MB
const MAX_FILE_SIZE = 100 * 1024 * 1024

// 支持的文件扩展名
const VALID_EXTS = ['step', 'stp', 'iges', 'igs', 'brep']

/**
 * OCCT 文件解析 Composable
 * 负责：加载 OCCT WASM 模块、解析 STEP/IGES/BREP 文件
 */
export function useOcctParser() {
  const occtModule = ref(null)
  const isLoading = ref(false)

  async function loadOcct() {
    try {
      if (window.occtimportjs) {
        occtModule.value = await window.occtimportjs()
      } else {
        console.warn('occt-import-js 尚未加载')
      }
    } catch (e) {
      console.warn('OCCT 加载失败:', e)
    }
  }

  /**
   * 解析用户上传的文件
   * @param {File} file - 文件对象
   * @param {Object} callbacks - { onSuccess(result, fileName), onError(err) }
   */
  async function parseFile(file, callbacks = {}) {
    const ext = file.name.split('.').pop().toLowerCase()
    if (!VALID_EXTS.includes(ext)) {
      ElMessage.warning('不支持的文件格式，请选择 STEP/IGES/BREP 文件')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      ElMessage.warning(`文件过大，请上传小于 ${MAX_FILE_SIZE / 1024 / 1024}MB 的文件`)
      return
    }

    isLoading.value = true
    try {
      if (!occtModule.value) {
        if (window.occtimportjs) {
          occtModule.value = await window.occtimportjs()
        } else {
          throw new Error('occt-import-js 尚未加载，请刷新页面')
        }
      }

      const arrayBuffer = await file.arrayBuffer()
      const fileBuffer = new Uint8Array(arrayBuffer)

      let result
      if (ext === 'step' || ext === 'stp') {
        result = occtModule.value.ReadStepFile(fileBuffer, OCCT_PARAMS)
      } else if (ext === 'iges' || ext === 'igs') {
        result = occtModule.value.ReadIgesFile(fileBuffer, OCCT_PARAMS)
      } else if (ext === 'brep') {
        result = occtModule.value.ReadBrepFile(fileBuffer, OCCT_PARAMS)
      }

      if (!result || !result.success) throw new Error('文件解析失败')

      callbacks.onSuccess?.(result, file.name)
    } catch (err) {
      console.error(err)
      ElMessage.error('解析出错: ' + err.message)
      callbacks.onError?.(err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 加载默认初始模型
   * @param {Object} callbacks - { onSuccess(result, fileName), onError(err) }
   */
  async function loadDefaultModel(callbacks = {}) {
    try {
      const response = await fetch('/初始模型.STEP')
      if (!response.ok) {
        console.warn('初始模型加载失败:', response.status)
        return
      }
      const arrayBuffer = await response.arrayBuffer()
      const fileBuffer = new Uint8Array(arrayBuffer)

      if (!occtModule.value) {
        if (window.occtimportjs) {
          occtModule.value = await window.occtimportjs()
        } else {
          console.warn('occt-import-js 未加载')
          return
        }
      }

      const result = occtModule.value.ReadStepFile(fileBuffer, OCCT_PARAMS)
      if (!result || !result.success) {
        console.warn('初始模型解析失败')
        return
      }

      callbacks.onSuccess?.(result, '初始模型.STEP')
    } catch (err) {
      console.warn('初始模型加载出错:', err)
      callbacks.onError?.(err)
    }
  }

  return { occtModule, isLoading, loadOcct, parseFile, loadDefaultModel }
}
