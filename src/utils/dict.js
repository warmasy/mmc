import useDictStore from '@/store/modules/dict'
// 字典管理已删除，getDicts API 已移除

/**
 * 获取字典数据
 */
export function useDict(...args) {
  const res = ref({});
  return (() => {
    args.forEach((dictType, index) => {
      res.value[dictType] = [];
      const dicts = useDictStore().getDict(dictType);
      if (dicts) {
        res.value[dictType] = dicts;
      } else {
        // 字典管理已删除，不再请求后端
        // getDicts(dictType).then(resp => {
        //   res.value[dictType] = resp.data.map(p => ({ label: p.dictLabel, value: p.dictValue, elTagType: p.listClass, elTagClass: p.cssClass }))
        //   useDictStore().setDict(dictType, res.value[dictType]);
        // })
      }
    })
    return toRefs(res.value);
  })()
}