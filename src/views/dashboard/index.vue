<template>
  <div class="dashboard-wrapper">
    <el-card class="welcome-card" :body-style="{ padding: '16px 24px' }">
      <div class="pageHeaderContent">
        <div class="avatar">
          <el-avatar size="large" :src="currentUser.avatar" />
        </div>
        <div class="content">
          <div class="contentTitle">
            早安，{{ currentUser.name }}，祝你开心每一天！
          </div>
          <div>{{ currentUser.title }} | {{ currentUser.group }}</div>
        </div>
        <div class="blog-link" @click="openWebsite(blogAvatar.href)">
          <el-avatar size="large" :src="blogAvatar.url" />
        </div>

      </div>
    </el-card>

    <div class="main-content">
      <el-row :gutter="16">
        <el-col :span="16">
          <el-card class="projectList" :body-style="{ padding: '0px' }">
            <template #header>
              <div class="card-header">
                <span>进行中的项目</span>
                <a href="" target="_blank" rel="noopener noreferrer">
                  <span style="color: var(--el-color-primary)">全部项目</span>
                </a>
              </div>
            </template>
            <div class="project-grid-wrapper">
              <div
                v-for="item in projectNotice"
                :key="item.id"
                class="projectGrid"
              >
                <div class="grid-inner">
                  <div class="card-meta">
                    <div class="cardTitle">
                      <el-avatar size="small" :src="item.logo" />
                      <a :href="item.href" target="_blank" rel="noopener noreferrer">{{ item.title }}</a>
                    </div>
                    <div class="meta-description">{{ item.description }}</div>
                  </div>
                  <div class="projectItemContent">
                    <a :href="item.memberLink" target="_blank" rel="noopener noreferrer">{{ item.member || "" }}</a>
                    <span class="datetime" :title="item.updatedAt">
                      {{ item.updatedAt }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </el-card>

          <el-card class="activeCard" :body-style="{ padding: '0px' }" style="margin-top: 16px;">
            <template #header>
              <div class="card-header"><span>当前网址</span></div>
            </template>
            <el-table :data="webNotice" class="site-table">
              <el-table-column type="index" label="序号" width="80" align="center" />
              <el-table-column label="网址" min-width="200" align="center">
                <template #default="scope">
                  <span class="table-url">{{ scope.row.url }}</span>
                </template>
              </el-table-column>
              <el-table-column label="平台" prop="lab" width="120" align="center" />
              <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
                  <el-button type="primary" link size="small" icon="CopyDocument" @click="copyUrl(scope.row.url, scope.row.lab)">复制</el-button>
                  <el-button type="success" link size="small" icon="TopRight" @click="openWebsite(scope.row.url)">跳转</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card :body-style="{ padding: '16px' }">
            <template #header>
              <div class="card-header">
                <span
                  class="quote-title"
                  @click="refreshQuote"
                  style="cursor: pointer"
                  >今日一言</span
                >
              </div>
            </template>
            <div class="daily-quote">
              <div class="quote-text">{{ currentQuote.text }}</div>
              <div class="quote-author">—— {{ currentQuote.author }}</div>
            </div>
          </el-card>

          <el-card style="margin-top: 16px;">
            <template #header>
              <div class="card-header"><span>日历</span></div>
            </template>
            <div class="compact-calendar">
              <div class="calendar-toolbar">
                <div class="calendar-year-month">
                  <el-popover
                    placement="bottom"
                    :width="220"
                    trigger="click"
                    v-model:visible="yearPopoverVisible"
                  >
                    <template #reference>
                      <span class="calendar-year-text">{{ currentYear }}年</span>
                    </template>
                    <div class="year-picker">
                      <div
                        v-for="y in yearOptions"
                        :key="y"
                        class="picker-item"
                        :class="{ active: y === currentYear }"
                        @click="onYearSelect(y)"
                      >
                        {{ y }}
                      </div>
                    </div>
                  </el-popover>
                  <el-popover
                    placement="bottom"
                    :width="220"
                    trigger="click"
                    v-model:visible="monthPopoverVisible"
                  >
                    <template #reference>
                      <span class="calendar-month-text">{{ currentMonthNum }}月</span>
                    </template>
                    <div class="month-picker">
                      <div
                        v-for="m in monthOptions"
                        :key="m.value"
                        class="picker-item"
                        :class="{ active: m.value === currentMonthNum }"
                        @click="onMonthSelect(m.value)"
                      >
                        {{ m.label }}
                      </div>
                    </div>
                  </el-popover>
                </div>
                <div class="calendar-btns">
                  <el-button text size="small" @click="prevMonth">上个月</el-button>
                  <el-button text size="small" @click="goToday">今天</el-button>
                  <el-button text size="small" @click="nextMonth">下个月</el-button>
                </div>
              </div>
              <table class="compact-calendar-table">
                <thead>
                  <tr>
                    <th class="week-col">周数</th>
                    <th>一</th>
                    <th>二</th>
                    <th>三</th>
                    <th>四</th>
                    <th>五</th>
                    <th>六</th>
                    <th>日</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(week, wIdx) in calendarWeeks" :key="wIdx">
                    <td class="week-col">{{ week.weekNum }}</td>
                    <td
                      v-for="(day, dIdx) in week.days"
                      :key="dIdx"
                      :class="{
                        'other-month': !day.isCurrentMonth,
                        'is-today': day.isToday,
                        'is-selected': day.isSelected,
                      }"
                      @click="selectDate(day)"
                    >
                      <div class="day-circle">
                        {{ day.date ? day.date.getDate() : "" }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineOptions } from 'vue';
import { ElMessage } from 'element-plus';
import { currentUser, projectNotice, webNotice, blogAvatar } from './data';
defineOptions({
  name: "DashBoard",
});


// ===================== 网址操作 =====================
function openWebsite(url) {
  if (url) {
    window.open(url, '_blank')
  }
}

function copyUrl(url, name) {
  if (!url) {
    ElMessage.warning('网址为空，无法复制')
    return
  }
  navigator.clipboard.writeText(url).then(() => {
    ElMessage.success(`已复制 ${name} 的网址`)
  }).catch(() => {
    const input = document.createElement('input')
    input.value = url
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    ElMessage.success(`已复制 ${name} 的网址`)
  })
}

// ===================== 日历逻辑 =====================
const currentMonth = ref(new Date());
const currentYear = computed({
  get: () => currentMonth.value.getFullYear(),
  set: (val) => {
    const d = new Date(currentMonth.value);
    d.setFullYear(val);
    currentMonth.value = d;
  }
});
const currentMonthNum = computed({
  get: () => currentMonth.value.getMonth() + 1,
  set: (val) => {
    const d = new Date(currentMonth.value);
    d.setMonth(val - 1);
    currentMonth.value = d;
  }
});

const yearOptions = computed(() => {
  const currentY = new Date().getFullYear();
  const years = [];
  for (let y = currentY - 10; y <= currentY + 10; y++) {
    years.push(y);
  }
  return years;
});

const monthOptions = [
  { value: 1, label: '1月' },
  { value: 2, label: '2月' },
  { value: 3, label: '3月' },
  { value: 4, label: '4月' },
  { value: 5, label: '5月' },
  { value: 6, label: '6月' },
  { value: 7, label: '7月' },
  { value: 8, label: '8月' },
  { value: 9, label: '9月' },
  { value: 10, label: '10月' },
  { value: 11, label: '11月' },
  { value: 12, label: '12月' },
];

const yearPopoverVisible = ref(false);
const monthPopoverVisible = ref(false);

function onYearSelect(val) {
  const d = new Date(currentMonth.value);
  d.setFullYear(val);
  currentMonth.value = d;
  yearPopoverVisible.value = false;
}

function onMonthSelect(val) {
  const d = new Date(currentMonth.value);
  d.setMonth(val - 1);
  currentMonth.value = d;
  monthPopoverVisible.value = false;
}
const selectedDate = ref(new Date());

function getISOWeek(date) {
  const tmp = new Date(date.getTime());
  tmp.setHours(0, 0, 0, 0);
  tmp.setDate(tmp.getDate() + 4 - (tmp.getDay() || 7));
  const yearStart = new Date(tmp.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((tmp - yearStart) / 86400000) + 1) / 7);
  return weekNo;
}

function isSameDay(d1, d2) {
  return d1 && d2 &&
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

const calendarWeeks = computed(() => {
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  let startDay = firstDayOfMonth.getDay();
  if (startDay === 0) startDay = 7;
  startDay = startDay - 1;

  const totalDays = lastDayOfMonth.getDate();
  const weeks = [];
  let currentWeek = [];
  let weekNum = null;

  for (let i = 0; i < startDay; i++) {
    currentWeek.push({ date: null, isCurrentMonth: false, isToday: false, isSelected: false });
  }

  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(year, month, d);
    if (weekNum === null) weekNum = getISOWeek(date);
    currentWeek.push({
      date,
      isCurrentMonth: true,
      isToday: isSameDay(date, new Date()),
      isSelected: isSameDay(date, selectedDate.value),
    });
    if (currentWeek.length === 7) {
      weeks.push({ weekNum, days: currentWeek });
      currentWeek = [];
      weekNum = null;
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: null, isCurrentMonth: false, isToday: false, isSelected: false });
    }
    weeks.push({ weekNum: weekNum || getISOWeek(new Date(year, month, totalDays)), days: currentWeek });
  }

  return weeks;
});

function prevMonth() {
  const d = new Date(currentMonth.value);
  d.setMonth(d.getMonth() - 1);
  currentMonth.value = d;
}

function nextMonth() {
  const d = new Date(currentMonth.value);
  d.setMonth(d.getMonth() + 1);
  currentMonth.value = d;
}

function goToday() {
  currentMonth.value = new Date();
  selectedDate.value = new Date();
}

function selectDate(day) {
  if (day.date) {
    selectedDate.value = day.date;
  }
}

// ===================== 今日一言 =====================
const quotes = [
  { text: "种一棵树最好的时间是十年前，其次是现在。", author: "Dambisa Moyo" },
  { text: "生活不是等待风暴过去，而是学会在雨中翩翩起舞。", author: "Vivian Greene" },
  { text: "每一个不曾起舞的日子，都是对生命的辜负。", author: "尼采" },
  { text: "既然选择了远方，便只顾风雨兼程。", author: "汪国真" },
  { text: "世界上只有一种真正的英雄主义，那就是认清生活的真相后依然热爱生活。", author: "罗曼·罗兰" },
  { text: "你若盛开，蝴蝶自来。", author: "佚名" },
  { text: "路漫漫其修远兮，吾将上下而求索。", author: "屈原" },
  { text: "不积跬步，无以至千里；不积小流，无以成江海。", author: "荀子" },
  { text: "长风破浪会有时，直挂云帆济沧海。", author: "李白" },
  { text: "天行健，君子以自强不息。", author: "《周易》" },
  { text: "知之者不如好之者，好之者不如乐之者。", author: "孔子" },
  { text: "千里之行，始于足下。", author: "老子" },
  { text: "博学之，审问之，慎思之，明辨之，笃行之。", author: "《中庸》" },
  { text: "纸上得来终觉浅，绝知此事要躬行。", author: "陆游" },
];

const currentQuoteIndex = ref(Math.floor(Math.random() * quotes.length));
const currentQuote = computed(() => quotes[currentQuoteIndex.value]);

function refreshQuote() {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * quotes.length);
  } while (newIndex === currentQuoteIndex.value && quotes.length > 1);
  currentQuoteIndex.value = newIndex;
}
</script>

<style scoped lang="less">
/* ========== 占满全宽：抵消外层 .app-container 的 20px padding ========== */
.dashboard-wrapper {
  width: 100%;
  padding: 16px 20px;
  box-sizing: border-box;
}

.main-content {
  padding: 0;
}

/* ========== 欢迎卡片 ========== */
.welcome-card {
  margin-bottom: 16px;
}

/* ========== Header ========== */
.pageHeaderContent {
  display: flex;
  align-items: center;
  .avatar {
    flex: 0 1 72px;
    & > span {
      display: block;
      width: 72px;
      height: 72px;
      border-radius: 72px;
      background-color: #ffffff !important;
    }
  }
  .content {
    position: relative;
    top: 4px;
    flex: 1 1 auto;
    margin-left: 24px;
    color: var(--el-text-color-secondary);
    line-height: 22px;
    .contentTitle {
      margin-bottom: 12px;
      color: var(--el-text-color-primary);
      font-weight: 500;
      font-size: 20px;
      line-height: 28px;
    }
  }
  .blog-link {
    display: flex;
    align-items: center;
    margin-left: auto;
    cursor: pointer;
    padding: 0 16px;
    & > span {
      display: block;
      width: 72px;
      height: 72px;
      border-radius: 72px;
      background-color: #ffffff !important;
    }
  }
}

/* ========== Card Header ========== */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
}

/* ========== 项目网格 ========== */
.projectList {
  .project-grid-wrapper {
    display: flex;
    flex-wrap: wrap;
    border-top: 1px solid var(--el-border-color-lighter);
    border-left: 1px solid var(--el-border-color-lighter);
  }
  .projectGrid {
    width: 33.33%;
    border-right: 1px solid var(--el-border-color-lighter);
    border-bottom: 1px solid var(--el-border-color-lighter);
    box-sizing: border-box;
  }
  .grid-inner {
    padding: 20px;
  }
  .meta-description {
    height: 44px;
    overflow: hidden;
    color: var(--el-text-color-secondary);
    line-height: 22px;
    margin-top: 8px;
  }
  .cardTitle {
    font-size: 0;
    :deep(.el-avatar) {
      background-color: #ffffff !important;
    }
    a {
      display: inline-block;
      height: 24px;
      margin-left: 12px;
      color: var(--el-text-color-primary);
      font-size: 14px;
      line-height: 24px;
      vertical-align: top;
      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
  .projectItemContent {
    display: flex;
    flex-basis: 100%;
    height: 20px;
    margin-top: 16px;
    overflow: hidden;
    font-size: 12px;
    line-height: 20px;
    a {
      display: inline-block;
      flex: 1 1 0;
      color: var(--el-text-color-secondary);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
      &:hover {
        color: var(--el-color-primary);
      }
    }
    .datetime {
      flex: 0 0 auto;
      float: right;
      color: var(--el-text-color-placeholder);
    }
  }
}

/* ========== 动态列表 ========== */
.activitiesList {
  padding: 0 24px 8px 24px;
  .username {
    color: var(--el-text-color-regular);
  }
  .event {
    font-weight: normal;
  }
}

.activity-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
  &:last-child {
    border-bottom: none;
  }
}
.activity-avatar {
  flex-shrink: 0;
  margin-right: 16px;
}
.activity-content {
  flex: 1;
}
.activity-title {
  margin-bottom: 4px;
  color: var(--el-text-color-primary);
  font-size: 14px;
}
.activity-description {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.datetime {
  color: var(--el-text-color-placeholder);
}

/* ========== 日历 ========== */
.compact-calendar {
  padding: 8px 12px;
}
.calendar-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  gap: 8px;
}
.calendar-year-month {
  display: flex;
  align-items: center;
  gap: 4px;
}
.calendar-year-text,
.calendar-month-text {
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-color-regular);
  cursor: pointer;
  user-select: none;
  padding: 4px 10px;
  border-radius: 4px;
  transition: all 0.2s;
  line-height: 1;
  background-color: transparent;
  border: none;
  outline: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  vertical-align: middle;
}
.calendar-year-text:hover,
.calendar-month-text:hover {
  color: var(--el-color-primary);
  background-color: var(--el-fill-color-light);
}
.year-picker,
.month-picker {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  padding: 4px;
}
.picker-item {
  text-align: center;
  padding: 6px 0;
  font-size: 13px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--el-text-color-primary);
}
.picker-item:hover {
  background-color: var(--el-fill-color-light);
  color: var(--el-color-primary);
}
.picker-item.active {
  background-color: var(--el-color-primary);
  color: #fff;
}
.calendar-btns {
  display: flex;
  gap: 4px;
}
.calendar-btns .el-button {
  padding: 4px 10px;
  font-size: 13px;
}

.compact-calendar-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 2px;
  table-layout: fixed;
}
.compact-calendar-table th {
  text-align: center;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  padding: 4px 2px;
  font-weight: 500;
}
.compact-calendar-table td {
  text-align: center;
  padding: 2px;
  cursor: pointer;
  vertical-align: middle;
}
.compact-calendar-table td.week-col {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  width: 36px;
  cursor: default;
  vertical-align: middle;
  font-weight: 500;
  background-color: var(--el-color-primary-light-9);
  border-radius: 4px;
}
.day-circle {
  width: 32px;
  height: 32px;
  line-height: 32px;
  border-radius: 50%;
  margin: 0 auto;
  font-size: 13px;
  color: var(--el-text-color-primary);
  transition: all 0.2s;
}
.compact-calendar-table td:hover .day-circle {
  background-color: var(--el-color-primary-light-9);
}
.compact-calendar-table td.is-today .day-circle {
  color: var(--el-color-primary);
  font-weight: 700;
}
.compact-calendar-table td.is-selected .day-circle {
  background-color: var(--el-color-primary);
  color: #fff;
}
.compact-calendar-table td.other-month .day-circle {
  color: var(--el-text-color-placeholder);
}

/* ========== 今日一言 ========== */
.daily-quote {
  text-align: left;
}
.quote-title {
  cursor: pointer;
  user-select: none;
}
.quote-title:hover {
  color: var(--el-color-primary);
}
.quote-text {
  font-size: 15px;
  line-height: 1.8;
  color: var(--el-text-color-primary);
  margin-bottom: 10px;
  font-family: inherit;
  letter-spacing: 0.3px;
}
.quote-author {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  text-align: right;
  font-family: inherit;
}

/* ========== 表格样式（与操作日志一致，无 hover） ========== */
.site-table {
  width: 100%;
}
.site-table :deep(.el-table__header-wrapper th) {
  font-weight: 500;
}
.site-table :deep(.el-table__row td) {
  border-bottom: 1px solid var(--el-border-color-lighter);
}

/* ========== 响应式 ========== */
@media screen and (max-width: 992px) {
  .projectList .projectGrid {
    width: 50%;
  }
}

@media screen and (max-width: 576px) {
  .pageHeaderContent {
    display: block;
    .content {
      margin-left: 0;
    }
  }
  .projectList .projectGrid {
    width: 100%;
  }
}
</style>