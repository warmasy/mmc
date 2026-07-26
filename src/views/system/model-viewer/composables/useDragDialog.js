import { ref, onBeforeUnmount } from 'vue'

/**
 * 弹窗拖拽 Composable
 * 负责：剖切控制弹窗的拖拽移动，并确保组件卸载时清理事件
 */
export function useDragDialog(containerRef) {
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
    dialogX.value = Math.max(0, Math.min(dialogX.value, rect.width - 220))
    dialogY.value = Math.max(0, Math.min(dialogY.value, rect.height - 180))
  }

  function stopDrag() {
    isDragging = false
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', stopDrag)
  }

  function startDrag(e) {
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
