
# 🌍 地球online 项目配置信息总览

---

## 一、网站名称 & 标题

| 配置项 | 文件路径 | 配置内容 | 说明 |
|--------|---------|---------|------|
| 浏览器标签页标题 | `.env.development` | `VITE_APP_TITLE = 地球online` | 开发环境 |
| 浏览器标签页标题 | `.env.production` | `VITE_APP_TITLE = 地球online` | 生产环境 |
| 浏览器标签页标题 | `.env.staging` | `VITE_APP_TITLE = 地球online` | 测试环境 |
| 浏览器标签页标题 | `.env.docker` | `VITE_APP_TITLE = 地球online` | Docker环境 |
| HTML标题占位 | `index.html` | `<title>%VITE_APP_TITLE%</title>` | 引用环境变量 |
| 侧边栏Logo文字 | `src/layout/components/Sidebar/Logo.vue` | `const title = import.meta.env.VITE_APP_TITLE` | 读取环境变量 |
| 登录页标题 | `src/views/login.vue` | `const title = import.meta.env.VITE_APP_TITLE` | 读取环境变量 |

> 💡 **改标题**：修改 4 个 `.env.*` 文件中的 `VITE_APP_TITLE`，然后重启开发服务器。

---

## 二、网站图标（Favicon）

| 配置项 | 文件路径 | 说明 |
|--------|---------|------|
| 浏览器标签页图标 | `public/favicon.ico` | 主图标文件 |
| 备用SVG图标 | `public/favicon-jx.svg` | 备用 |
| 备用ICO图标 | `public/favicon1.ico` | 备用 |
| HTML引用 | `index.html` | `<link rel="icon" href="/favicon.ico">` |

> 💡 **改图标**：替换 `public/favicon.ico` 文件，或修改 `index.html` 中的 `href`。

---

## 三、侧边栏 Logo 图片

| 配置项 | 文件路径 | 说明 |
|--------|---------|------|
| Logo图片 | `src/assets/logo/logo.png` | 侧边栏展开时显示 |
| 备用Logo | `src/assets/logo/logo1.png` | 备用 |
| 引用位置 | `src/layout/components/Sidebar/Logo.vue` | `import logo from '@/assets/logo/logo.png'` |

> 💡 **改Logo**：替换 `src/assets/logo/logo.png` 文件。

---

## 四、底部版权信息

| 配置项 | 文件路径 | 配置内容 | 说明 |
|--------|---------|---------|------|
| 版权文字 | `src/settings.js` | `footerContent: '© 2025-2026 地球online'` | 底部左侧 |
| 备案号 | `src/settings.js` | `footerIcp: '豫ICP备2025140685号-1'` | 备案信息 |
| 徽章图标 | `src/settings.js` | `footerBadges: [...]` | Netlify/阿里云/又拍云/EdgeOne |
| 时钟显示 | `src/layout/components/Copyright/index.vue` | 实时时钟 | 自动生成，无需配置 |

> 💡 **改版权**：修改 `src/settings.js` 中的 `footerContent` 和 `footerIcp`。

---

## 五、首页欢迎卡片（Dashboard）

**文件路径**：`src/views/dashboard/data.js`

### 5.1 左侧用户头像和问候语

```js
export const currentUser = {
  avatar: "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",  // 头像
  name: "吴彦祖",                                                                    // 问候名
  title: "地球online",                                                               // 职位/标题
  group: "一定要好好的哦 ！！",                                                       // 分组/签名
};
```

### 5.2 右侧博客头像（点击跳转）

```js
export const blogAvatar = {
  url: "https://myblog.3139822.xyz/favicon.ico",  // 右侧显示的头像图标
  href: "https://myblog.3139822.xyz/",              // 点击跳转的链接
};
```

### 5.3 进行中的项目列表

```js
export const projectNotice = [
  {
    id: "0001",
    title: "博客",
    logo: "https://myblog.3139822.xyz/favicon.ico",
    description: "那是一种内在的东西...",
    updatedAt: "几天前",
    member: "醉摘镜中花",
    href: "https://myblog.3139822.xyz/",
    memberLink: "https://myblog.3139822.xyz/",
  },
  {
    id: "0002",
    title: "Memos",
    logo: "http://memos.3139822.xyz/full-logo.webp",
    description: "希望是一个好东西...",
    updatedAt: "几天前",
    member: "你好呀",
    href: "http://memos.3139822.xyz/",
    memberLink: "http://memos.3139822.xyz/",
  },
];
```

### 5.4 当前网址表格

```js
export const webNotice = [
  { url: "https://myblog.3139822.xyz/", lab: "博客" },
  { url: "http://memos.3139822.xyz/", lab: "Memos" },
];
```

---

## 六、个人中心左侧面板信息

**文件路径**：`src/views/system/user/profile/profileInfo.js`（已提取）

```js
export const profileInfoList = [
  {
    icon: 'documentation',      // svg图标名
    label: '网站名称',           // 显示名称
    value: '地球online',        // 显示值
    type: 'text'                // text=纯文本 / link=可点击链接
  },
  {
    icon: 'link',
    label: '站长博客',
    value: 'https://myblog.3139822.xyz/',
    type: 'link',
    url: 'https://myblog.3139822.xyz/',  // 点击跳转地址
    className: 'blog-url'                 // 自定义样式类
  },
  // ... 可自由添加新项
];
```

| 字段 | 说明 | 必填 |
|------|------|------|
| `icon` | svg图标名称（对应 `src/assets/icons/svg/`） | ✅ |
| `label` | 信息项名称 | ✅ |
| `value` | 显示的值 | ✅ |
| `type` | `'text'` 纯文本 / `'link'` 可点击链接 | ✅ |
| `url` | 点击跳转地址（`type: 'link'` 时生效） | 可选 |
| `className` | 自定义CSS类 | 可选 |

> 💡 **添加新项**：直接在数组里追加对象，页面会自动渲染，无需改页面代码。

---

## 七、全局用户状态（影响导航栏、登录等）

**文件路径**：`src/store/modules/user.js`

```js
export const FAKE_USER = {
  userId: 1,
  userName: 'admin',              // 登录账号
  nickName: '地球online',         // 导航栏右上角显示的名字
  avatar: '',                     // 头像（空则使用默认头像）
  email: 'admin@ruoyi.com',       // 邮箱
  phonenumber: '13800138001',     // 手机号
  sex: '0',                       // 性别
  status: '0',                    // 账号状态
  createTime: '2024-01-15 09:30:00', // 创建时间
  dept: { deptName: '研发部门' },   // 部门
  roles: [{ roleName: '超级管理员' }] // 角色权限
};
```

| 字段 | 影响位置 |
|------|---------|
| `nickName` | 导航栏右上角用户名 |
| `avatar` | 导航栏头像、个人中心头像（空则用默认） |
| `userName` | 登录账号名 |
| `roles` | 页面权限判断 |
| `email` / `phonenumber` | 仅存储，未直接展示 |

> 💡 **注意**：`FAKE_USER.avatar` 目前为空，实际头像由 `defAva`（`src/assets/images/profile.jpg`）提供。

---

## 八、头像来源

| 位置 | 来源 | 文件路径 |
|------|------|---------|
| 个人中心头像 | `userStore.avatar` → `defAva` | `src/assets/images/profile.jpg` |
| 导航栏头像 | `userStore.avatar` → `defAva` | `src/assets/images/profile.jpg` |
| 首页左侧头像 | `currentUser.avatar` | `src/views/dashboard/data.js` |
| 首页右侧头像 | `blogAvatar.url` | `src/views/dashboard/data.js` |

> 💡 **改全局头像**：替换 `src/assets/images/profile.jpg` 或修改 `user.js` 中 `avatar` 为网络地址。

---

## 九、快速修改对照表

| 想改什么 | 修改文件 | 具体位置 |
|---------|---------|---------|
| 网站标题 | `.env.development` 等 4 个文件 | `VITE_APP_TITLE` |
| 浏览器图标 | `public/favicon.ico` | 替换文件 |
| 侧边栏Logo | `src/assets/logo/logo.png` | 替换文件 |
| 底部版权 | `src/settings.js` | `footerContent` / `footerIcp` |
| 底部徽章 | `src/settings.js` | `footerBadges` 数组 |
| 首页问候名 | `src/views/dashboard/data.js` | `currentUser.name` |
| 首页右侧头像 | `src/views/dashboard/data.js` | `blogAvatar` |
| 首页项目列表 | `src/views/dashboard/data.js` | `projectNotice` |
| 个人中心信息 | `src/views/system/user/profile/profileInfo.js` | `profileInfoList` |
| 导航栏昵称 | `src/store/modules/user.js` | `FAKE_USER.nickName` |
| 全局头像 | `src/assets/images/profile.jpg` | 替换文件 |
| 登录页背景 | `src/assets/images/login-background.jpg` | 替换文件 |

---

## 十、环境变量加载优先级（Vite）

```
.env.[mode].local   ← 最高（本地覆盖，不提交git）
.env.[mode]         ← 次之（如 .env.production）
.env.local          ← 再次
.env                ← 最低（通用配置）
```

> 修改 `.env` 文件后需要 **重启开发服务器** 才能生效。
