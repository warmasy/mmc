// ============================================================
// 📝 个人中心 - 左侧面板信息配置
// ============================================================
// 说明：
//   - icon:      svg-icon 的图标名称（对应 src/assets/icons/svg/ 下的文件名）
//   - label:     信息项的显示名称（左侧文字）
//   - value:     信息项的值（右侧显示内容）
//   - type:      显示类型：'text' 纯文本 | 'link' 可点击链接
//   - url:       当 type 为 'link' 时，点击跳转的网址（可选）
//   - className: 额外的 CSS 类名（可选，如 'blog-url' 给链接加下划线样式）
//
// 💡 随意添加新项即可自动展示，无需修改页面代码！
// ============================================================

export const profileInfoList = [
  {
    icon: 'documentation',
    label: '网站名称',
    value: '地球online',
    type: 'text'
  },
  {
    icon: 'link',
    label: '站长博客',
    value: 'https://myblog.3139822.xyz/',
    type: 'link',
    url: 'https://myblog.3139822.xyz/',
    className: 'blog-url'
  },
  {
    icon: 'peoples',
    label: '角色',
    value: 'NPC',
    type: 'text'
  },
  {
    icon: 'phone',
    label: '手记号码',
    value: '88888888',
    type: 'text'
  },
  {
    icon: 'email',
    label: '邮箱',
    value: '123@3139822.xyz',
    type: 'text'
  },
  {
    icon: 'date',
    label: '创建日期',
    value: '2025-05-01 09:30:00',
    type: 'text'
  }
]
