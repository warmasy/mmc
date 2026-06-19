<template>
  <div class="app-container motor-selection-page">
    <!-- 顶部标题栏 -->
    <div class="calc-header">
      <div class="header-title">「选型工具」伺服电机选型计算</div>
      <div class="header-info">
        <div class="info-item">
          <label>标题：</label>
          <el-input v-model="form.projectName" placeholder="输入项目名称" size="small" style="width: 160px" />
        </div>
        <div class="info-item">
          <label>编号：</label>
          <el-input v-model="form.projectNo" placeholder="NO." size="small" style="width: 80px" />
        </div>
        <div class="info-item">
          <label>日期：</label>
          <el-input :value="currentDate" readonly size="small" style="width: 100px" />
        </div>
      </div>
    </div>

    <el-row :gutter="16" class="calc-row">
      <!-- 左侧参数填写卡片 -->
      <el-col :span="12" :xs="24">
        <el-card class="calc-card" :body-style="{ padding: '16px', display: 'flex', flexDirection: 'column', height: '100%' }">
          <template #header>
            <div class="card-header">
              <span>参数填写</span>
              <span class="header-status">
                <span class="status-tag">状态提示</span>
                <span class="status-text">{{ statusText }}</span>
              </span>
            </div>
          </template>

          <!-- 参数区域：占满整行 -->
          <div class="card-content">
            <!-- 运动参数 -->
            <fieldset class="calc-fieldset">
              <legend>运动参数</legend>
              <div class="radio-group">
                <label class="radio-item">
                  <input type="radio" v-model="form.motionMode" value="direct" />
                  <span>直接驱动</span>
                </label>
                <label class="radio-item">
                  <input type="radio" v-model="form.motionMode" value="reducer" />
                  <span>减速机驱动</span>
                </label>
                <label class="radio-item">
                  <input type="radio" v-model="form.motionMode" value="screw" />
                  <span>滚珠丝杠驱动</span>
                </label>
              </div>
              <div class="param-grid">
                <div class="param-row">
                  <div class="param-group">
                    <span class="param-label">行程 <i>L</i></span>
                    <el-input-number v-model="form.stroke" :step="0.1" :min="0" controls-position="right" size="small" style="width: 80px" />
                    <span class="param-unit">mm</span>
                  </div>
                  <div class="param-group">
                    <span class="param-label">定位时间 <i>t</i></span>
                    <el-input-number v-model="form.positionTime" :step="0.01" :min="0" controls-position="right" size="small" style="width: 80px" />
                    <span class="param-unit">s</span>
                  </div>
                  <div class="param-group">
                    <span class="param-label">最高速度 <i>V<sub>max</sub></i></span>
                    <el-input-number v-model="form.maxSpeed" :step="0.1" :min="0" controls-position="right" size="small" style="width: 80px" />
                    <span class="param-unit">mm/s</span>
                  </div>
                </div>
                <div class="param-row">
                  <div class="param-group">
                    <span class="param-label">加速度 <i>a</i></span>
                    <el-input-number v-model="form.acceleration" :step="0.1" :min="0" controls-position="right" size="small" style="width: 80px" />
                    <span class="param-unit">mm/s²</span>
                  </div>
                  <div class="param-group">
                    <span class="param-label">减速度 <i>d</i></span>
                    <el-input-number v-model="form.deceleration" :step="0.1" :min="0" controls-position="right" size="small" style="width: 80px" />
                    <span class="param-unit">mm/s²</span>
                  </div>
                  <div class="param-group">
                    <span class="param-label">运行周期 <i>t<sub>c</sub></i></span>
                    <el-input-number v-model="form.cycleTime" :step="0.1" :min="0" controls-position="right" size="small" style="width: 80px" />
                    <span class="param-unit">s</span>
                  </div>
                </div>
              </div>
            </fieldset>

            <!-- 负载参数 -->
            <fieldset class="calc-fieldset">
              <legend>负载参数</legend>
              <div class="param-grid">
                <div class="param-row">
                  <div class="param-group">
                    <span class="param-label">负载质量 <i>m</i></span>
                    <el-input-number v-model="form.loadMass" :step="0.1" :min="0" controls-position="right" size="small" style="width: 80px" />
                    <span class="param-unit">kg</span>
                  </div>
                  <div class="param-group">
                    <span class="param-label">负载惯量 <i>J<sub>L</sub></i></span>
                    <el-input-number v-model="form.loadInertia" :step="0.001" :min="0" controls-position="right" size="small" style="width: 80px" />
                    <span class="param-unit">kg·m²</span>
                  </div>
                  <div class="param-group">
                    <span class="param-label">摩擦系数 <i>μ</i></span>
                    <el-input-number v-model="form.frictionCoeff" :step="0.001" :min="0" :max="1" controls-position="right" size="small" style="width: 80px" />
                    <span class="param-unit">—</span>
                  </div>
                </div>
                <div class="param-row">
                  <div class="param-group">
                    <span class="param-label">外力 <i>F<sub>ext</sub></i></span>
                    <el-input-number v-model="form.externalForce" :step="0.1" controls-position="right" size="small" style="width: 80px" />
                    <span class="param-unit">N</span>
                  </div>
                  <div class="param-group" v-show="form.motionMode === 'screw'">
                    <span class="param-label">丝杠导程 <i>P<sub>b</sub></i></span>
                    <el-input-number v-model="form.screwLead" :step="0.1" :min="0" controls-position="right" size="small" style="width: 80px" />
                    <span class="param-unit">mm</span>
                  </div>
                  <div class="param-group" v-show="form.motionMode === 'screw'">
                    <span class="param-label">丝杠直径 <i>d</i></span>
                    <el-input-number v-model="form.screwDiameter" :step="0.1" :min="0" controls-position="right" size="small" style="width: 80px" />
                    <span class="param-unit">mm</span>
                  </div>
                </div>
                <div class="param-row">
                  <div class="param-group">
                    <span class="param-label">机械效率 <i>η</i></span>
                    <el-input-number v-model="form.efficiency" :step="0.01" :min="0" :max="1" controls-position="right" size="small" style="width: 80px" />
                    <span class="param-unit">—</span>
                  </div>
                  <div class="param-group">
                    <span class="param-label">安全系数 <i>S<sub>f</sub></i></span>
                    <el-input-number v-model="form.safetyFactor" :step="0.1" :min="1" controls-position="right" size="small" style="width: 80px" />
                    <span class="param-unit">—</span>
                  </div>
                  <div class="param-group" v-show="form.motionMode === 'reducer'">
                    <span class="param-label">减速比 <i>i</i></span>
                    <el-input-number v-model="form.gearRatio" :step="0.1" :min="1" controls-position="right" size="small" style="width: 80px" />
                    <span class="param-unit">—</span>
                  </div>
                </div>
              </div>
            </fieldset>

            <!-- 电机预选参数 -->
            <fieldset class="calc-fieldset">
              <legend>电机预选参数</legend>
              <div class="param-grid">
                <div class="param-row">
                  <div class="param-group">
                    <span class="param-label">额定转速 <i>n<sub>N</sub></i></span>
                    <el-input-number v-model="form.ratedSpeed" :step="1" :min="0" controls-position="right" size="small" style="width: 80px" />
                    <span class="param-unit">r/min</span>
                  </div>
                  <div class="param-group">
                    <span class="param-label">额定扭矩 <i>T<sub>N</sub></i></span>
                    <el-input-number v-model="form.ratedTorque" :step="0.01" :min="0" controls-position="right" size="small" style="width: 80px" />
                    <span class="param-unit">N·m</span>
                  </div>
                  <div class="param-group">
                    <span class="param-label">峰值扭矩 <i>T<sub>max</sub></i></span>
                    <el-input-number v-model="form.peakTorque" :step="0.01" :min="0" controls-position="right" size="small" style="width: 80px" />
                    <span class="param-unit">N·m</span>
                  </div>
                </div>
                <div class="param-row">
                  <div class="param-group">
                    <span class="param-label">电机惯量 <i>J<sub>M</sub></i></span>
                    <el-input-number v-model="form.motorInertia" :step="0.0001" :min="0" controls-position="right" size="small" style="width: 80px" />
                    <span class="param-unit">kg·m²</span>
                  </div>
                  <div class="param-group">
                    <span class="param-label">惯量比 <i>JR</i></span>
                    <el-input v-model="inertiaRatioDisplay" readonly size="small" style="width: 80px" />
                    <span class="param-unit">—</span>
                  </div>
                  <div class="param-group">
                    <span class="param-label">选用系列</span>
                    <el-select v-model="form.motorSeries" placeholder="请选择" size="small" style="width: 100px">
                      <el-option label="MS1 系列" value="MS1" />
                      <el-option label="MH1 系列" value="MH1" />
                      <el-option label="MG1 系列" value="MG1" />
                      <el-option label="MS2 高惯量" value="MS2" />
                    </el-select>
                  </div>
                </div>
              </div>
            </fieldset>

            <!-- 注释 -->
            <div class="note-box">
              <div class="note-title">注：</div>
              <div class="note-item">1. 惯量比 <i>JR</i> = 负载惯量 / 电机惯量，一般建议控制在 10 倍以内（高惯量电机可放宽至 30 倍）</div>
              <div class="note-item">2. 安全系数 <i>S<sub>f</sub></i> 建议取值 1.2~2.0，根据负载冲击情况选取</div>
              <div class="note-item">3. 机械效率 <i>η</i>：滚珠丝杠 0.9~0.95，齿轮齿条 0.8~0.9，同步带 0.95~0.98</div>
              <div class="note-item">4. 计算结果仅供参考，最终选型需考虑温升、再生电阻、控制精度等因素</div>
            </div>
          </div>

          <!-- 按钮区域：固定在底部 -->
          <div class="card-footer">
            <div class="btn-group">
              <el-button class="calc-btn btn-help" type="info" plain icon="QuestionFilled" @click="showHelp">帮 助</el-button>
              <el-button class="calc-btn btn-primary" type="primary" icon="Check" @click="calculate">计 算</el-button>
              <el-button class="calc-btn btn-danger" type="danger" plain icon="Close" @click="resetForm">取 消</el-button>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧计算结果展示卡片 -->
      <el-col :span="12" :xs="24">
        <el-card class="calc-card" :body-style="{ padding: '16px', display: 'flex', flexDirection: 'column', height: '100%' }">
          <template #header>
            <div class="card-header">计算结果展示</div>
          </template>

          <!-- 参数区域：占满整行 -->
          <div class="card-content">
            <!-- 运动参数（只读展示） -->
            <fieldset class="calc-fieldset">
              <legend>运动参数</legend>
              <div class="radio-group">
                <label class="radio-item">
                  <input type="radio" :checked="form.motionMode === 'direct'" disabled />
                  <span>直接驱动</span>
                </label>
                <label class="radio-item">
                  <input type="radio" :checked="form.motionMode === 'reducer'" disabled />
                  <span>减速机驱动</span>
                </label>
                <label class="radio-item">
                  <input type="radio" :checked="form.motionMode === 'screw'" disabled />
                  <span>滚珠丝杠驱动</span>
                </label>
              </div>
              <div class="param-grid">
                <div class="param-row">
                  <div class="param-group">
                    <span class="param-label">行程 <i>L</i></span>
                    <el-input v-model="form.stroke" readonly size="small" style="width: 80px" />
                    <span class="param-unit">mm</span>
                  </div>
                  <div class="param-group">
                    <span class="param-label">定位时间 <i>t</i></span>
                    <el-input v-model="form.positionTime" readonly size="small" style="width: 80px" />
                    <span class="param-unit">s</span>
                  </div>
                  <div class="param-group">
                    <span class="param-label">最高速度 <i>V<sub>max</sub></i></span>
                    <el-input v-model="form.maxSpeed" readonly size="small" style="width: 80px" />
                    <span class="param-unit">mm/s</span>
                  </div>
                </div>
                <div class="param-row">
                  <div class="param-group">
                    <span class="param-label">加速度 <i>a</i></span>
                    <el-input v-model="form.acceleration" readonly size="small" style="width: 80px" />
                    <span class="param-unit">mm/s²</span>
                  </div>
                  <div class="param-group">
                    <span class="param-label">减速度 <i>d</i></span>
                    <el-input v-model="form.deceleration" readonly size="small" style="width: 80px" />
                    <span class="param-unit">mm/s²</span>
                  </div>
                  <div class="param-group">
                    <span class="param-label">运行周期 <i>t<sub>c</sub></i></span>
                    <el-input v-model="form.cycleTime" readonly size="small" style="width: 80px" />
                    <span class="param-unit">s</span>
                  </div>
                </div>
              </div>
            </fieldset>

            <!-- 负载参数（只读展示） -->
            <fieldset class="calc-fieldset">
              <legend>负载参数</legend>
              <div class="param-grid">
                <div class="param-row">
                  <div class="param-group">
                    <span class="param-label">负载质量 <i>m</i></span>
                    <el-input v-model="form.loadMass" readonly size="small" style="width: 80px" />
                    <span class="param-unit">kg</span>
                  </div>
                  <div class="param-group">
                    <span class="param-label">负载惯量 <i>J<sub>L</sub></i></span>
                    <el-input v-model="form.loadInertia" readonly size="small" style="width: 80px" />
                    <span class="param-unit">kg·m²</span>
                  </div>
                  <div class="param-group">
                    <span class="param-label">摩擦系数 <i>μ</i></span>
                    <el-input v-model="form.frictionCoeff" readonly size="small" style="width: 80px" />
                    <span class="param-unit">—</span>
                  </div>
                </div>
                <div class="param-row">
                  <div class="param-group">
                    <span class="param-label">外力 <i>F<sub>ext</sub></i></span>
                    <el-input v-model="form.externalForce" readonly size="small" style="width: 80px" />
                    <span class="param-unit">N</span>
                  </div>
                  <div class="param-group" v-show="form.motionMode === 'screw'">
                    <span class="param-label">丝杠导程 <i>P<sub>b</sub></i></span>
                    <el-input v-model="form.screwLead" readonly size="small" style="width: 80px" />
                    <span class="param-unit">mm</span>
                  </div>
                  <div class="param-group" v-show="form.motionMode === 'screw'">
                    <span class="param-label">丝杠直径 <i>d</i></span>
                    <el-input v-model="form.screwDiameter" readonly size="small" style="width: 80px" />
                    <span class="param-unit">mm</span>
                  </div>
                </div>
                <div class="param-row">
                  <div class="param-group">
                    <span class="param-label">机械效率 <i>η</i></span>
                    <el-input v-model="form.efficiency" readonly size="small" style="width: 80px" />
                    <span class="param-unit">—</span>
                  </div>
                  <div class="param-group">
                    <span class="param-label">安全系数 <i>S<sub>f</sub></i></span>
                    <el-input v-model="form.safetyFactor" readonly size="small" style="width: 80px" />
                    <span class="param-unit">—</span>
                  </div>
                  <div class="param-group" v-show="form.motionMode === 'reducer'">
                    <span class="param-label">减速比 <i>i</i></span>
                    <el-input v-model="form.gearRatio" readonly size="small" style="width: 80px" />
                    <span class="param-unit">—</span>
                  </div>
                </div>
              </div>
            </fieldset>

            <!-- 电机预选参数（只读展示） -->
            <fieldset class="calc-fieldset">
              <legend>电机预选参数</legend>
              <div class="param-grid">
                <div class="param-row">
                  <div class="param-group">
                    <span class="param-label">额定转速 <i>n<sub>N</sub></i></span>
                    <el-input v-model="form.ratedSpeed" readonly size="small" style="width: 80px" />
                    <span class="param-unit">r/min</span>
                  </div>
                  <div class="param-group">
                    <span class="param-label">额定扭矩 <i>T<sub>N</sub></i></span>
                    <el-input v-model="form.ratedTorque" readonly size="small" style="width: 80px" />
                    <span class="param-unit">N·m</span>
                  </div>
                  <div class="param-group">
                    <span class="param-label">峰值扭矩 <i>T<sub>max</sub></i></span>
                    <el-input v-model="form.peakTorque" readonly size="small" style="width: 80px" />
                    <span class="param-unit">N·m</span>
                  </div>
                </div>
                <div class="param-row">
                  <div class="param-group">
                    <span class="param-label">电机惯量 <i>J<sub>M</sub></i></span>
                    <el-input v-model="form.motorInertia" readonly size="small" style="width: 80px" />
                    <span class="param-unit">kg·m²</span>
                  </div>
                  <div class="param-group">
                    <span class="param-label">惯量比 <i>JR</i></span>
                    <el-input v-model="inertiaRatioDisplay" readonly size="small" style="width: 80px" />
                    <span class="param-unit">—</span>
                  </div>
                  <div class="param-group">
                    <span class="param-label">选用系列</span>
                    <el-input v-model="form.motorSeries" readonly size="small" style="width: 100px" />
                  </div>
                </div>
              </div>
            </fieldset>

            <!-- 选型结果 -->
            <fieldset class="calc-fieldset">
              <legend>选型结果</legend>
              <div class="result-list">
                <div class="result-row">
                  <span class="result-label">负载扭矩 <i>T<sub>L</sub></i></span>
                  <span class="result-value">{{ result.loadTorque }} N·m</span>
                </div>
                <div class="result-row">
                  <span class="result-label">加速扭矩 <i>T<sub>a</sub></i></span>
                  <span class="result-value">{{ result.accelTorque }} N·m</span>
                </div>
                <div class="result-row">
                  <span class="result-label">所需峰值扭矩 <i>T<sub>req</sub></i></span>
                  <span class="result-value">{{ result.peakTorqueReq }} N·m</span>
                </div>
                <div class="result-row">
                  <span class="result-label">所需额定扭矩 <i>T<sub>reqN</sub></i></span>
                  <span class="result-value">{{ result.ratedTorqueReq }} N·m</span>
                </div>
                <div class="result-row">
                  <span class="result-label">最大转速 <i>n<sub>max</sub></i></span>
                  <span class="result-value">{{ result.maxSpeed }} r/min</span>
                </div>
                <div class="result-row highlight">
                  <span class="result-label">推荐电机型号</span>
                  <span class="result-value model">{{ result.motorModel }}</span>
                </div>
              </div>
            </fieldset>

            <!-- 注释 -->
            <div class="note-box">
              <div class="note-title">注：</div>
              <div class="note-item">1. 惯量比 <i>JR</i> = 负载惯量 / 电机惯量，一般建议控制在 10 倍以内（高惯量电机可放宽至 30 倍）</div>
              <div class="note-item">2. 安全系数 <i>S<sub>f</sub></i> 建议取值 1.2~2.0，根据负载冲击情况选取</div>
              <div class="note-item">3. 机械效率 <i>η</i>：滚珠丝杠 0.9~0.95，齿轮齿条 0.8~0.9，同步带 0.95~0.98</div>
              <div class="note-item">4. 计算结果仅供参考，最终选型需考虑温升、再生电阻、控制精度等因素</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="MotorSelection">
import { ElMessage, ElMessageBox } from 'element-plus'

// 当前日期
const currentDate = ref(new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}))

// 表单数据
const form = reactive({
  projectName: '',
  projectNo: '',
  motionMode: 'direct',
  stroke: 500,
  positionTime: 0.5,
  maxSpeed: 0,
  acceleration: 5000,
  deceleration: 5000,
  cycleTime: 2,
  loadMass: 10,
  loadInertia: 0,
  frictionCoeff: 0.01,
  externalForce: 0,
  screwLead: 10,
  screwDiameter: 20,
  efficiency: 0.9,
  safetyFactor: 1.5,
  gearRatio: 1,
  ratedSpeed: 3000,
  ratedTorque: 0,
  peakTorque: 0,
  motorInertia: 0,
  motorSeries: '',
  motorType: 'ac',
  powerType: '220'
})

// 计算结果
const result = reactive({
  loadTorque: '0.000',
  accelTorque: '0.000',
  peakTorqueReq: '0.000',
  ratedTorqueReq: '0.000',
  maxSpeed: '0',
  motorModel: '—'
})

// 状态文本
const statusText = ref('等待输入参数...')

// 惯量比显示
const inertiaRatioDisplay = computed(() => {
  if (form.motorInertia > 0 && form.loadInertia > 0) {
    return (form.loadInertia / form.motorInertia).toFixed(2)
  }
  return '0.00'
})

// 监听运动模式变化
watch(() => form.motionMode, (val) => {
  const modeMap = { direct: '直接驱动', reducer: '减速机驱动', screw: '滚珠丝杠驱动' }
  statusText.value = '等待输入参数...'
})

// 计算函数
function calculate() {
  try {
    const mode = form.motionMode
    const mass = form.loadMass || 0
    const stroke = form.stroke || 0
    const accel = form.acceleration || 0
    const friction = form.frictionCoeff || 0
    const extForce = form.externalForce || 0
    const efficiency = form.efficiency || 0.9
    const safety = form.safetyFactor || 1.5
    const lead = form.screwLead || 10
    const ratio = form.gearRatio || 1
    const motorInertia = form.motorInertia || 0

    let loadTorque, accelTorque, peakTorque, ratedTorque, maxSpeed, loadInertia
    const g = 9.8

    if (mode === 'screw') {
      const frictionTorque = mass * g * friction * lead / (2 * Math.PI * efficiency) / 1000
      const extTorque = extForce * lead / (2 * Math.PI * efficiency) / 1000
      loadTorque = (frictionTorque + extTorque) * safety

      const screwInertia = 0.5 * 7.8e3 * Math.PI * Math.pow(lead / 1000, 2) * stroke / 1000 * Math.pow(form.screwDiameter / 2000, 2)
      loadInertia = mass * Math.pow(lead / (2000 * Math.PI), 2) + (screwInertia || 0)
      accelTorque = loadInertia * accel / (lead / 1000) * (2 * Math.PI) / 60 / efficiency * safety

      maxSpeed = (form.maxSpeed || 0) * 60 / lead * ratio
    } else {
      const radius = 0.05
      loadTorque = (mass * g * friction * radius + extForce * radius) * safety / efficiency
      loadInertia = mass * radius * radius

      if (mode === 'reducer') {
        loadInertia = loadInertia / (ratio * ratio)
        loadTorque = loadTorque / ratio
        accelTorque = loadInertia * accel / radius * (2 * Math.PI) / 60 / efficiency * safety
        maxSpeed = (form.maxSpeed || 0) / (2 * Math.PI * radius) * 60 / ratio
      } else {
        accelTorque = loadInertia * accel / radius * (2 * Math.PI) / 60 / efficiency * safety
        maxSpeed = (form.maxSpeed || 0) / (2 * Math.PI * radius) * 60
      }
    }

    peakTorque = loadTorque + accelTorque
    ratedTorque = loadTorque * 1.2

    let inertiaRatio = 0
    if (motorInertia > 0) {
      inertiaRatio = loadInertia / motorInertia
    }

    result.loadTorque = loadTorque.toFixed(3)
    result.accelTorque = accelTorque.toFixed(3)
    result.peakTorqueReq = peakTorque.toFixed(3)
    result.ratedTorqueReq = ratedTorque.toFixed(3)
    result.maxSpeed = maxSpeed.toFixed(0)

    let model = '—'
    if (peakTorque > 0) {
      if (peakTorque <= 0.32) model = 'MS1H1-05B30CB'
      else if (peakTorque <= 0.64) model = 'MS1H1-10B30CB'
      else if (peakTorque <= 1.27) model = 'MS1H1-20B30CB'
      else if (peakTorque <= 2.39) model = 'MS1H1-40B30CB'
      else if (peakTorque <= 3.82) model = 'MS1H1-75B30CB'
      else if (peakTorque <= 7.0) model = 'MS1H2-100C30CB'
      else model = '需定制或并联电机'
    }
    result.motorModel = model

    statusText.value = '计算完成'

    ElMessage.success('计算完成')
  } catch (e) {
    statusText.value = '计算错误'
    ElMessage.error('计算错误: ' + e.message)
  }
}

// 重置表单
function resetForm() {
  form.projectName = ''
  form.projectNo = ''
  form.motionMode = 'direct'
  form.stroke = 500
  form.positionTime = 0.5
  form.maxSpeed = 0
  form.acceleration = 5000
  form.deceleration = 5000
  form.cycleTime = 2
  form.loadMass = 10
  form.loadInertia = 0
  form.frictionCoeff = 0.01
  form.externalForce = 0
  form.screwLead = 10
  form.screwDiameter = 20
  form.efficiency = 0.9
  form.safetyFactor = 1.5
  form.gearRatio = 1
  form.ratedSpeed = 3000
  form.ratedTorque = 0
  form.peakTorque = 0
  form.motorInertia = 0
  form.motorSeries = ''
  form.motorType = 'ac'
  form.powerType = '220'

  result.loadTorque = '0.000'
  result.accelTorque = '0.000'
  result.peakTorqueReq = '0.000'
  result.ratedTorqueReq = '0.000'
  result.maxSpeed = '0'
  result.motorModel = '—'

  statusText.value = '已重置'
  ElMessage.info('已重置')
}

function loadData() {
  ElMessage.info('提示: 装入数据功能需配合后端接口使用')
}

function saveData() {
  ElMessage.info('提示: 保存功能需配合后端接口使用')
}

function showHelp() {
  ElMessageBox.alert(
    `伺服电机选型计算帮助：\n\n1. 选择驱动方式（直接/减速机/丝杠）\n2. 输入负载质量、运动行程、时间等参数\n3. 填写机械效率和安全系数\n4. 点击"计算"获取选型结果\n5. 根据推荐型号查阅电机手册确认\n\n如有疑问请联系机械工程师。`,
    '帮助',
    { confirmButtonText: '知道了' }
  )
}
</script>

<style scoped>
.motor-selection-page {
  padding: 16px;
  background-color: #f0f0f0;
  height: calc(100vh - 132px);  /* 84px(顶部Navbar+TagsView) + 48px(底部版权栏) */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* 顶部标题栏 */
.calc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 2px solid #999;
  flex-wrap: wrap;
  gap: 12px;
  flex-shrink: 0;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.header-info {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.info-item label {
  white-space: nowrap;
  color: #555;
}

/* 卡片 */
.calc-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.calc-card :deep(.el-card) {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.calc-card :deep(.el-card__body) {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #f0f0f0;
  padding: 16px;
}

.calc-card :deep(.el-card__header) {
  padding: 10px 16px;
  background-color: var(--el-fill-color-light);
}

.card-header {
  font-weight: bold;
  font-size: 14px;
  color: var(--el-text-color-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-status {
  display: flex;
  align-items: center;
  gap: 6px;
  max-width: 65%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-status .status-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 500;
  color: #fff;
  background-color: var(--el-color-primary);
  border-radius: 10px;
  flex-shrink: 0;
}

.header-status .status-text {
  font-size: 12px;
  font-weight: 500;
  color: var(--el-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 卡片内容区域 */
.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
}

/* 卡片底部：固定 */
.card-footer {
  flex-shrink: 0;
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px solid #ddd;
}

/* 分组框 */
.calc-fieldset {
  border: 1px solid #aaa;
  border-radius: 3px;
  padding: 10px 12px;
  background-color: #f5f5f5;
  margin: 0;
}

.calc-fieldset legend {
  font-weight: bold;
  color: #333;
  padding: 0 6px;
  font-size: 13px;
}

.side-fieldset {
  margin-bottom: 10px;
}

/* 单选按钮组 */
.radio-group {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
  padding: 4px 0;
  flex-wrap: wrap;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: 13px;
}

.radio-item input[type="radio"] {
  margin: 0;
}

/* 参数网格 */
.param-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.param-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 0;
}

.param-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 200px;
  margin-bottom: 4px;
}

.param-label {
  min-width: 90px;
  text-align: right;
  font-size: 13px;
  color: #333;
  white-space: nowrap;
}

.param-label i {
  font-style: italic;
  font-family: 'Times New Roman', serif;
}

.param-unit {
  font-size: 13px;
  color: #555;
  min-width: 50px;
  white-space: nowrap;
}

/* 右侧单选 */
.side-radio-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.side-radio-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 13px;
  padding: 2px 0;
}

/* 选型结果 */
.result-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  border-bottom: 1px dotted #ccc;
}

.result-row:last-child {
  border-bottom: none;
}

.result-row.highlight {
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px solid #ccc;
  border-bottom: none;
}

.result-label {
  font-size: 13px;
  color: #555;
}

.result-label i {
  font-style: italic;
  font-family: 'Times New Roman', serif;
}

.result-value {
  font-weight: bold;
  color: #c9302c;
  font-family: Consolas, monospace;
  font-size: 13px;
}

.result-value.model {
  color: #2c5aa0;
}

/* 状态栏 */
.status-bar {
  border: 1px solid #aaa;
  border-radius: 3px;
  padding: 8px 12px;
  background: #f5f5f5;
  margin-top: 4px;
}

.status-title {
  font-weight: bold;
  font-size: 13px;
  margin-bottom: 4px;
  color: #333;
}

.status-content {
  color: #555;
  font-size: 12px;
  line-height: 1.5;
}

/* 注释 */
.note-box {
  font-size: 12px;
  color: #666;
  line-height: 1.6;
  padding: 8px 12px;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 3px;
  margin-top: 4px;
}

.note-title {
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.note-item {
  margin-bottom: 2px;
}

.note-item i {
  font-style: italic;
  font-family: 'Times New Roman', serif;
}

/* 按钮 */
.btn-group {
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
}

.calc-btn {
  flex: 1;
  justify-content: center;
  height: 36px;
  font-size: 14px;
  border-radius: 4px;
}

.calc-btn.btn-help {
  font-weight: 500;
}

.calc-btn.btn-primary {
  font-weight: bold;
  flex: 1.2;
}

.calc-btn.btn-danger {
  font-weight: 500;
}

/* 响应式 */
/* 主内容行：占满剩余空间 */
.calc-row {
  flex: 1;
  min-height: 0;
}

.calc-row > .el-col {
  height: 100%;
}

@media (max-width: 1200px) {
  .calc-row {
    flex-direction: column;
  }
  .param-group {
    min-width: 180px;
  }
}

/* el-input-number 箭头内置样式：默认隐藏，悬停显示 */
.calc-card :deep(.el-input-number.is-controls-right .el-input__wrapper) {
  padding-right: 0;
}

.calc-card :deep(.el-input-number.is-controls-right .el-input__inner) {
  text-align: left;
  padding-left: 8px;
  padding-right: 28px;
}

.calc-card :deep(.el-input-number.is-controls-right .el-input-number__decrease),
.calc-card :deep(.el-input-number.is-controls-right .el-input-number__increase) {
  width: 18px;
  height: 50%;
  border: none;
  background: transparent;
  color: var(--el-text-color-regular);
  right: 2px;
  opacity: 0;
  transition: opacity 0.2s;
}

.calc-card :deep(.el-input-number.is-controls-right .el-input-number__decrease .el-icon),
.calc-card :deep(.el-input-number.is-controls-right .el-input-number__increase .el-icon) {
  font-size: 10px;
}

.calc-card :deep(.el-input-number.is-controls-right .el-input-number__decrease) {
  bottom: 1px;
  border-radius: 0 0 2px 0;
  border-top: 1px solid var(--el-border-color-lighter);
}

.calc-card :deep(.el-input-number.is-controls-right .el-input-number__increase) {
  top: 1px;
  border-radius: 0 2px 0 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

/* 鼠标悬停在整个输入框上时显示箭头 */
.calc-card :deep(.el-input-number.is-controls-right:hover .el-input-number__decrease),
.calc-card :deep(.el-input-number.is-controls-right:hover .el-input-number__increase) {
  opacity: 1;
}

.calc-card :deep(.el-input-number.is-controls-right .el-input-number__decrease:hover),
.calc-card :deep(.el-input-number.is-controls-right .el-input-number__increase:hover) {
  color: var(--el-color-primary);
  background-color: var(--el-fill-color-light);
}

@media (max-width: 768px) {
  .calc-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .param-row {
    flex-direction: column;
  }
  .param-group {
    min-width: 100%;
  }
}
</style>