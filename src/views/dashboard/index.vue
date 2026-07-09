<template>
  <div class="dashboard-wrapper">
    <WelcomeCard />

    <div class="main-content">
      <el-row :gutter="16" class="dashboard-row">
        <el-col :span="16" :xs="24" :sm="24" :md="16" class="left-col">
          <ProjectList />
          <WebTable />
        </el-col>

        <el-col :span="8" :xs="24" :sm="24" :md="8" class="right-col">
          <DailyQuote />
          <CalendarCard />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { defineOptions } from 'vue';
import WelcomeCard from './components/WelcomeCard.vue';
import ProjectList from './components/ProjectList.vue';
import WebTable from './components/WebTable.vue';
import DailyQuote from './components/DailyQuote.vue';
import CalendarCard from './components/CalendarCard.vue';

defineOptions({ name: "DashBoard" });
</script>

<style scoped lang="less">
.dashboard-wrapper {
  width: 100%;
  padding: 16px 20px;
  box-sizing: border-box;
}
.main-content { padding: 0; }

/* 小屏幕：卡片按列纵向堆叠 */
@media screen and (max-width: 768px) {
  .dashboard-wrapper { padding: 16px 12px; }
  .dashboard-row {
    display: flex; flex-direction: column;
    margin-left: 0 !important; margin-right: 0 !important;
  }
  .dashboard-row > .el-col { padding-left: 0 !important; padding-right: 0 !important; }
  .dashboard-row .right-col { order: 1; margin-bottom: 16px; }
  .dashboard-row .left-col { order: 2; }
  .activeCard, .calendar-card { display: none !important; }
}
</style>