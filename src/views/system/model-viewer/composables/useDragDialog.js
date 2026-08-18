import { ref, onBeforeUnmount } from 'vue'

/**
 * 弹窗拖拽 Composable
 * 负责：弹窗（剖切控制 / 模型颜色等）的拖拽移动，并确保组件卸载时清理事件
 * @param {Object} containerRef 容器引用（弹窗相对容器定位）
 * @param {Object} opts { width, height } 弹窗尺寸，用于边界裁剪
 */
export function useDragDialog(containerRef, opts = {}) {
  const w = opts.width || 220
  const h = opts.height || 180

  const dialogX = ref(100)
  const dialogY = ref(100)
  let isDragging = false
  let dragOffsetX = 0
  let dragOffsetY = 0

  function onDrag(e) {
    if (!isDragging || !containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    dialogX.value = e.clientX - rect.left - dragOffsetX
    dialogY.value = e.clientY - rect.top - dragOffsetY
    dialogX.value = Math.max(0, Math.min(dialogX.value, rect.width - w))
    dialogY.value = Math.max(0, Math.min(dialogY.value, rect.height - h))
  }

  function stopDrag() {
    if (!isDragging) return
    isDragging = false
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', stopDrag)
  }

  function startDrag(e) {
    // 只响应左键
    if (e.button !== undefined && e.button !== 0) return
    // 阻止文本选择/默认拖拽，保证拖动跟手
    e.preventDefault()
    isDragging = true
    const rect = containerRef.value.getBoundingClientRect()
    dragOffsetX = e.clientX - rect.left - dialogX.value
    dragOffsetY = e.clientY - rect.top - dialogY.value
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', stopDrag)
  }

  // 确保组件卸载时清理事件监听器，防止内存泄漏
  onBeforeUnmount(() => {
    stopDrag()
  })

  return { dialogX, dialogY, startDrag }
}
