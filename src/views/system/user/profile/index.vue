<template>
   <div class="app-container profile-page">
      <el-row :gutter="20" class="profile-row">
         <el-col :span="6" :xs="24">
            <el-card class="box-card info-card">
               <template v-slot:header>
                 <div class="clearfix">
                   <span>个人信息</span>
                 </div>
               </template>
               <div class="info-content">
                  <div class="text-center">
                     <userAvatar />
                  </div>
                  <ul class="list-group list-group-striped">
                     <li
                       v-for="(item, index) in profileInfoList"
                       :key="index"
                       class="list-group-item"
                     >
                        <svg-icon :icon-class="item.icon" />{{ item.label }}
                        <div class="pull-right">
                          <span
                            v-if="item.type === 'link'"
                            :class="item.className || 'info-link'"
                            @click="openUrl(item.url || item.value)"
                          >
                            {{ item.value }}
                          </span>
                          <span v-else>{{ item.value }}</span>
                        </div>
                     </li>
                  </ul>
               </div>
            </el-card>
         </el-col>
         <el-col :span="18" :xs="24">
            <el-card class="tab-card">
               <template v-slot:header>
                 <div class="clearfix">
                   <span>资料中心</span>
                 </div>
               </template>
               <el-tabs v-model="selectedTab">
                  <el-tab-pane label="神的说唱" name="userinfo">
                     <div class="lyric-box">
                        <h3>《神的说唱》</h3>
                        <p>天才在左疯子在右我在中间所以我是天子</p>
                        <p>上帝在天因为我在人间</p>
                        <p>我走在前方神明紧随其后</p>
                        <p>世上本没有白天只有无尽黑夜</p>
                        <p>因为我的醒来黑夜亮如白昼</p>
                        <p>自我降世，李白就此封笔</p>
                        <p>就连战神吕布也不敢与我一斗</p>
                        <p>王是残缺的玉，再加三笔叫狂</p>
                        <p>人才如过江之鲫装进我的鱼塘</p>
                        <p>就算地球毁灭也要等我死亡</p>
                        <p>我和巨便发热所以我是太阳</p>
                        <p>王是残缺的玉，再加三笔叫狂</p>
                        <p>人才如过江之鲫装进我的鱼塘</p>
                        <p>就算地球毁灭也要等等我死亡</p>
                        <p>Hold on hold on</p>
                        <p>牛顿高斯比我提前出生是笨鸟先飞还是避我锋芒</p>
                        <p>秦王嬴政比我早生千年是惧我三分还是王不见王</p>
                        <p>我闭眼就天黑睁眼就天亮我不是主角谁是主角</p>
                        <p>我想照镜子奈何神本无相</p>
                        <p>你是千里之堤不过我是蚁穴</p>
                        <p>文人墨客书写唐诗百篇</p>
                        <p>可我出生后全都变成才尽的江郎</p>
                        <p>圆的秘密困扰数学家千年</p>
                        <p>我用Π d瞬间就能求出圆形的周长</p>
                        <p>猴子到人需要万年的进化</p>
                        <p>我出生就是因为基因的优良</p>
                        <p>我知道你们口中所谓糖歌很多</p>
                        <p>那就看我如何做到孤篇压全糖</p>
                        <p>王不见王</p>
                        <p>避我锋芒</p>
                        <p>王不见王</p>
                        <p>避我锋芒</p>
                     </div>
                  </el-tab-pane>
               </el-tabs>
            </el-card>
         </el-col>
      </el-row>
   </div>
</template>

<script setup name="Profile">
import userAvatar from "./userAvatar";
import { getUserProfile } from "@/api/system/user";
import { profileInfoList } from "./profileInfo";

const route = useRoute()
const selectedTab = ref("userinfo")
const state = reactive({
  user: {},
  roleGroup: {},
  postGroup: {}
});

function getUser() {
  getUserProfile().then(response => {
    state.user = response.data;
    state.roleGroup = response.roleGroup;
    state.postGroup = response.postGroup;
  });
};

function openUrl(url) {
  if (url) {
    window.open(url, '_blank');
  }
}

onMounted(() => {
  const activeTab = route.params && route.params.activeTab
  if (activeTab) {
    selectedTab.value = activeTab
  }
  getUser()
})
</script>

<style scoped>
.profile-page {
  height: 100%;
}
.profile-row {
  height: 100%;
}
.profile-row > .el-col {
  height: 100%;
}
.info-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.info-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.info-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.list-group {
  flex: 1;
  padding-left: 0;
  list-style: none;
}
.list-group-item {
  display: flex;
  align-items: center;
  padding: 11px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
  font-size: 13px;
}
.list-group-item:last-child {
  border-bottom: none;
}
.list-group-item .svg-icon {
  margin-right: 8px;
  font-size: 16px;
}
.pull-right {
  margin-left: auto;
  color: var(--el-text-color-secondary);
}
.blog-url {
  cursor: pointer;
}
.blog-url:hover {
  text-decoration: underline;
}
.info-link {
  cursor: pointer;
  color: var(--el-color-primary);
}
.info-link:hover {
  text-decoration: underline;
}
.tab-card {
  height: 100%;
}
.tab-card :deep(.el-card__body) {
  height: calc(100% - 55px);
}
.tab-card :deep(.el-tabs) {
  height: 100%;
}
.tab-card :deep(.el-tabs__content) {
  height: calc(100% - 50px);
  overflow-y: auto;
}
.lyric-box {
  padding: 30px 20px;
  text-align: center;
}
.lyric-box h3 {
  font-size: 18px;
  color: var(--el-color-primary);
  margin-bottom: 24px;
  font-weight: 600;
}
.lyric-box p {
  font-size: 15px;
  line-height: 2.2;
  color: var(--el-text-color-regular);
  margin: 4px 0;
}
</style>
