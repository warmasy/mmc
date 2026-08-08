<template>
  <div class="base-table">
    <el-table ref="tableRef" v-loading="loading" :data="data" style="width: 100%" v-bind="$attrs">
      <el-table-column
        v-for="col in columns"
        :key="col.prop || col.slot || col.type || col.label"
        v-bind="resolveColumnProps(col)"
      >
        <!-- 自定义单元格内容：通过插槽注入，插槽名由列配置的 slot 指定 -->
        <template v-if="col.slot" #default="scope">
          <slot :name="col.slot" v-bind="scope" />
        </template>
      </el-table-column>

      <!-- 空数据状态，可被父组件 #empty 插槽覆盖 -->
      <template #empty>
        <slot name="empty">
          <el-empty :image-size="80" :description="emptyText" />
        </slot>
      </template>
    </el-table>

    <!-- 内置分页（复用全局 Pagination 组件），pagination 为 true 时显示 -->
    <pagination
      v-if="pagination"
      v-show="total > 0"
      v-model:page="innerPage"
      v-model:limit="innerLimit"
      :total="total"
      :page-sizes="pageSizes"
      :layout="paginationLayout"
      @pagination="handlePagination"
    />
  </div>
</template>

<script setup>
/**
 * BaseTable 通用表格组件
 *
 * 对 el-table 的轻量封装，统一全站表格的写法与样式：
 * - 列通过 columns 配置数组声明，无需手写 el-table-column
 * - 自定义单元格通过命名插槽注入（列配置 slot: 'xxx'，父组件用 <template #xxx="{ row }">）
 * - 内置 loading、空状态、分页（复用全局 Pagination 组件）
 * - el-table 原生的属性与事件（如 stripe、border、@selection-change、@sort-change）
 *   直接写在 <base-table> 上即可，自动透传
 *
 * 列配置项说明：
 * {
 *   label: '列标题',               // 必填（type 列可省略）
 *   prop: 'fieldName',             // 数据字段名（普通文本列）
 *   type: 'index' | 'selection',   // 特殊列类型：序号列 / 多选列
 *   slot: 'slotName',              // 自定义内容插槽名（优先级高于 prop）
 *   width: 120,                    // 固定宽度
 *   minWidth: 200,                 // 最小宽度（自适应列）
 *   align: 'center',               // 对齐方式，默认 'center'
 *   showOverflowTooltip: true,     // 超出省略号+悬浮提示，普通列默认 true
 *   fixed: 'left' | 'right',       // 固定列
 *   sortable: true | 'custom',     // 排序
 *   formatter: (row, column, cellValue, index) => {},  // 自定义格式化
 *   className: '',                 // 列 class
 * }
 *
 * 使用示例：
 * <base-table :data="list" :columns="columns" :loading="loading">
 *   <template #url="{ row }"><span>{{ row.url }}</span></template>
 *   <template #action="{ row }">
 *     <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
 *   </template>
 * </base-table>
 *
 * 带分页：
 * <base-table :data="list" :columns="columns" :loading="loading"
 *             pagination :total="total" v-model:page="pageNum" v-model:limit="pageSize"
 *             @pagination="getList" />
 */
import { ElEmpty } from 'element-plus'

defineOptions({ name: 'BaseTable', inheritAttrs: false })

const props = defineProps({
  // 表格数据
  data: { type: Array, default: () => [] },
  // 列配置数组
  columns: { type: Array, default: () => [] },
  // 加载状态
  loading: { type: Boolean, default: false },
  // 空数据提示文案
  emptyText: { type: String, default: '暂无数据' },
  // 是否显示内置分页
  pagination: { type: Boolean, default: false },
  // 分页：总条数
  total: { type: Number, default: 0 },
  // 分页：当前页（v-model:page）
  page: { type: Number, default: 1 },
  // 分页：每页条数（v-model:limit）
  limit: { type: Number, default: 10 },
  // 分页：每页条数可选项
  pageSizes: { type: Array, default: () => [10, 20, 30, 50] },
  // 分页：布局
  paginationLayout: { type: String, default: 'total, sizes, prev, pager, next, jumper' }
})

const emit = defineEmits(['update:page', 'update:limit', 'pagination'])

const tableRef = ref()

const innerPage = computed({
  get: () => props.page,
  set: val => emit('update:page', val)
})
const innerLimit = computed({
  get: () => props.limit,
  set: val => emit('update:limit', val)
})

function handlePagination({ page, limit }) {
  emit('update:page', page)
  emit('update:limit', limit)
  emit('pagination', { page, limit })
}

// 将列配置转换为 el-table-column 的 props
function resolveColumnProps(col) {
  const columnProps = {
    label: col.label,
    align: col.align || 'center'
  }
  // 特殊列类型：序号列 / 多选列
  if (col.type) {
    columnProps.type = col.type
    if (col.type === 'index' && !col.label) columnProps.label = '序号'
    columnProps.width = col.width || (col.type === 'selection' ? 55 : 80)
  } else {
    columnProps.prop = col.prop
    if (col.width) columnProps.width = col.width
    if (col.minWidth) columnProps.minWidth = col.minWidth
    // 普通文本列默认开启超出提示
    columnProps.showOverflowTooltip = col.showOverflowTooltip ?? (!!col.prop && !col.slot)
  }
  if (col.fixed) columnProps.fixed = col.fixed
  if (col.sortable) columnProps.sortable = col.sortable
  if (col.formatter) columnProps.formatter = col.formatter
  if (col.className) columnProps.className = col.className
  return columnProps
}

// 暴露 el-table 常用方法，父组件可通过 ref 调用
defineExpose({
  clearSelection: (...args) => tableRef.value?.clearSelection(...args),
  toggleRowSelection: (...args) => tableRef.value?.toggleRowSelection(...args),
  toggleAllSelection: (...args) => tableRef.value?.toggleAllSelection(...args),
  setCurrentRow: (...args) => tableRef.value?.setCurrentRow(...args),
  clearSort: (...args) => tableRef.value?.clearSort(...args),
  clearFilter: (...args) => tableRef.value?.clearFilter(...args),
  doLayout: (...args) => tableRef.value?.doLayout(...args),
  scrollTo: (...args) => tableRef.value?.scrollTo(...args),
  getTable: () => tableRef.value
})
</script>

<style scoped lang="less">
.base-table {
  width: 100%;

  /* 全站统一的表格样式（原各页面 .site-table 样式收敛于此） */
  :deep(.el-table__header-wrapper th) {
    font-weight: 500;
  }
  :deep(.el-table__row td) {
    border-bottom: 1px solid var(--el-border-color-lighter);
  }
}
</style>
