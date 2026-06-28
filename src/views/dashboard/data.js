// 首页数据配置
// 当前用户信息
export const currentUser = {
  avatar: "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",
  name: "吴彦祖",
  userid: "00000001",
  email: "3139822307@qq.com",
  signature: "海纳百川，有容乃大",
  title: "朋友，你饿了么",
  group: "一定要好好的哦 ！！",
};

// 项目/网址列表
export const projectNotice = [
  {
    id: "0001",
    title: "主站",
    logo: "https://3139822.xyz/favicon.ico",
    description: "xxx",
    updatedAt: "几天前",
    member: "醉摘镜中花",
    href: "https://3139822.xyz/",
    memberLink: "https://myblog.3139822.xyz/",
  },
  {
    id: "0002",
    title: "站长博客",
    logo: "https://myblog.3139822.xyz/favicon.ico",
    description: "我饿了，想吃饭",
    updatedAt: "几秒前",
    member: "醉摘镜中花",
    href: "https://myblog.3139822.xyz/",
    memberLink: "https://myblog.3139822.xyz/",
  },
  {
    id: "0003",
    title: "Memos",
    logo: "http://memos.3139822.xyz/full-logo.webp",
    description: "希望会越来越好吧",
    updatedAt: "几天前",
    member: "xxx",
    href: "http://memos.3139822.xyz/",
    memberLink: "http://memos.3139822.xyz/",
  },
];

// 当前网址/网址列表（用于首页"当前网址"表格）
export const webNotice = [
  {
    url: "http://mmbc.3139822.xyz/",
    lab: "博客",
  },
];

// 我的博客头像（点击跳转到博客）
export const blogAvatar = {
  url: "/wblogavatar.ico",
  href: "https://myblog.3139822.xyz/",
};