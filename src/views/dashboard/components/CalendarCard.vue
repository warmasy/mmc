<template>
  <el-card class="calendar-card" style="margin-top: 16px;">
    <template #header>
      <div class="card-header"><span>日历</span></div>
    </template>
    <div class="compact-calendar">
      <div class="calendar-toolbar">
        <div class="calendar-year-month">
          <el-popover placement="bottom" :width="220" trigger="click" v-model:visible="yearPopoverVisible">
            <template #reference>
              <span class="calendar-year-text">{{ currentYear }}年</span>
            </template>
            <div class="year-picker">
              <div v-for="y in yearOptions" :key="y" class="picker-item" :class="{ active: y === currentYear }" @click="onYearSelect(y)">{{ y }}</div>
            </div>
          </el-popover>
          <el-popover placement="bottom" :width="220" trigger="click" v-model:visible="monthPopoverVisible">
            <template #reference>
              <span class="calendar-month-text">{{ currentMonthNum }}月</span>
            </template>
            <div class="month-picker">
              <div v-for="m in monthOptions" :key="m.value" class="picker-item" :class="{ active: m.value === currentMonthNum }" @click="onMonthSelect(m.value)">{{ m.label }}</div>
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
            <th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th><th>日</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(week, wIdx) in calendarWeeks" :key="wIdx">
            <td class="week-col">{{ week.weekNum }}</td>
            <td v-for="(day, dIdx) in week.days" :key="dIdx"
              :class="{ 'other-month': !day.isCurrentMonth, 'is-today': day.isToday, 'is-selected': day.isSelected }"
              @click="selectDate(day)">
              <div class="day-circle">{{ day.date ? day.date.getDate() : "" }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </el-card>
</template>

<script setup>
import { ref, computed } from 'vue';

const currentMonth = ref(new Date());
const currentYear = computed({
  get: () => currentMonth.value.getFullYear(),
  set: (val) => { const d = new Date(currentMonth.value); d.setFullYear(val); currentMonth.value = d; }
});
const currentMonthNum = computed({
  get: () => currentMonth.value.getMonth() + 1,
  set: (val) => { const d = new Date(currentMonth.value); d.setMonth(val - 1); currentMonth.value = d; }
});

const yearOptions = computed(() => {
  const currentY = new Date().getFullYear();
  const years = [];
  for (let y = currentY - 10; y <= currentY + 10; y++) years.push(y);
  return years;
});

const monthOptions = [
  { value: 1, label: '1月' }, { value: 2, label: '2月' }, { value: 3, label: '3月' },
  { value: 4, label: '4月' }, { value: 5, label: '5月' }, { value: 6, label: '6月' },
  { value: 7, label: '7月' }, { value: 8, label: '8月' }, { value: 9, label: '9月' },
  { value: 10, label: '10月' }, { value: 11, label: '11月' }, { value: 12, label: '12月' },
];

const yearPopoverVisible = ref(false);
const monthPopoverVisible = ref(false);

function onYearSelect(val) {
  const d = new Date(currentMonth.value); d.setFullYear(val); currentMonth.value = d; yearPopoverVisible.value = false;
}
function onMonthSelect(val) {
  const d = new Date(currentMonth.value); d.setMonth(val - 1); currentMonth.value = d; monthPopoverVisible.value = false;
}

const selectedDate = ref(new Date());

function getISOWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function getCalendarWeeks(year, month) {
  const weeks = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDayOfWeek = firstDay.getDay() === 0 ? 7 : firstDay.getDay();
  const totalDays = lastDay.getDate();
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  let currentWeek = [];
  let weekNum = getISOWeekNumber(firstDay);

  for (let i = startDayOfWeek - 2; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthLastDay - i);
    currentWeek.push({ date: d, isCurrentMonth: false, isToday: isToday(d), isSelected: isSelected(d) });
  }
  for (let day = 1; day <= totalDays; day++) {
    const d = new Date(year, month, day);
    if (currentWeek.length === 7) {
      weeks.push({ weekNum, days: currentWeek });
      currentWeek = [];
      weekNum = getISOWeekNumber(d);
    }
    currentWeek.push({ date: d, isCurrentMonth: true, isToday: isToday(d), isSelected: isSelected(d) });
  }
  const remaining = 7 - currentWeek.length;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i);
    currentWeek.push({ date: d, isCurrentMonth: false, isToday: isToday(d), isSelected: isSelected(d) });
  }
  if (currentWeek.length > 0) weeks.push({ weekNum, days: currentWeek });
  return weeks;
}

function isToday(date) {
  const today = new Date();
  return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
}

function isSelected(date) {
  return selectedDate.value && date.getFullYear() === selectedDate.value.getFullYear() && date.getMonth() === selectedDate.value.getMonth() && date.getDate() === selectedDate.value.getDate();
}

const calendarWeeks = computed(() => getCalendarWeeks(currentYear.value, currentMonthNum.value - 1));

function selectDate(day) {
  if (day.date) selectedDate.value = day.date;
}
function prevMonth() { currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() - 1, 1); }
function nextMonth() { currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 1); }
function goToday() { currentMonth.value = new Date(); selectedDate.value = new Date(); }
</script>

<style scoped lang="less">
.card-header { display: flex; justify-content: space-between; align-items: center; font-weight: 500; }

.compact-calendar { padding: 8px 12px; }
.calendar-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 8px; }
.calendar-year-month { display: flex; align-items: center; gap: 4px; }
.calendar-year-text, .calendar-month-text {
  font-size: 13px; font-weight: 500; color: var(--el-text-color-regular); cursor: pointer; user-select: none;
  padding: 4px 10px; border-radius: 4px; transition: all 0.2s; line-height: 1;
  background-color: transparent; border: none; outline: none; display: inline-flex; align-items: center; justify-content: center; white-space: nowrap; vertical-align: middle;
  &:hover { color: var(--el-color-primary); background-color: var(--el-fill-color-light); }
}
.year-picker, .month-picker { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; padding: 4px; }
.picker-item { text-align: center; padding: 6px 0; font-size: 13px; border-radius: 4px; cursor: pointer; transition: all 0.2s; color: var(--el-text-color-primary); }
.picker-item:hover { background-color: var(--el-fill-color-light); color: var(--el-color-primary); }
.picker-item.active { background-color: var(--el-color-primary); color: #fff; }
.calendar-btns { display: flex; gap: 4px; }
.calendar-btns .el-button { padding: 4px 10px; font-size: 13px; }

.compact-calendar-table { width: 100%; border-collapse: separate; border-spacing: 2px; table-layout: fixed; }
.compact-calendar-table th { text-align: center; font-size: 13px; color: var(--el-text-color-secondary); padding: 4px 2px; font-weight: 500; }
.compact-calendar-table td { text-align: center; padding: 2px; cursor: pointer; vertical-align: middle; }
.compact-calendar-table td.week-col { font-size: 13px; color: var(--el-text-color-secondary); width: 36px; cursor: default; vertical-align: middle; font-weight: 500; background-color: var(--el-color-primary-light-9); border-radius: 4px; }
.day-circle { width: 32px; height: 32px; line-height: 32px; border-radius: 50%; margin: 0 auto; font-size: 13px; color: var(--el-text-color-primary); transition: all 0.2s; }
.compact-calendar-table td:hover .day-circle { background-color: var(--el-color-primary-light-9); }
.compact-calendar-table td.is-today .day-circle { color: var(--el-color-primary); font-weight: 700; }
.compact-calendar-table td.is-selected .day-circle { background-color: var(--el-color-primary); color: #fff; }
.compact-calendar-table td.other-month .day-circle { color: var(--el-text-color-placeholder); }
</style>
