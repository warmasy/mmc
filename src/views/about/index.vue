<template>
  <div class="app-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>关于本项目</span>
        </div>
      </template>
      <div class="about-content">
        <ul>
          <li>不知道写什么，就这样吧。哦，对了，此网站还在建设中。</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script setup>
</script>

<style scoped>
.about-content {
  line-height: 1.6;
  color: #333;
  padding: 2px;
}
.about-content h3 {
  margin-top: 0;
  color: #409EFF;
}
.about-content h4 {
  margin-top: 4px;
  color: #606266;
}
.about-content ul {
  padding-left: 16px;
}
.about-content li {
  margin-bottom: 4px;
}
.card-header {
  font-weight: bold;
  font-size: 16px;
}
.box-card {
  border-radius: 0;
  box-shadow: none;
}
</style>
