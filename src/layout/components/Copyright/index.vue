<<template>
  <footer v-if="visible" class="copyright" :style="copyrightStyle">
    <div class="copyright-left">
      <div class="copyright-badges">
        <!-- 实时时钟 badge：永远排在第一个 -->
        <span class="badge-tag split-badge clock-badge">
          <span class="badge-left">{{ timeLeft }}</span>
          <span class="badge-right">{{ timeRight }}</span>
        </span>
        <a
          v-for="(badge, index) in badgeList"
          :key="index"
          :href="badge.href"
          target="_blank"
          rel="noopener noreferrer"
          class="badge-link"
        >
          <img :src="badge.img" :alt="badge.alt" class="badge-img" />
        </a>
      </div>
    </div>
    <div class="copyright-right">
      <!-- 备案 badge：左灰右蓝 -->
      <a
        class="badge-tag split-badge"
        href="https://beian.miit.gov.cn/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="badge-left">{{ icpLeft }}</span>
        <span class="badge-right">{{ icpRight }}</span>
      </a>
      <!-- 版权 badge：左灰右蓝 -->
      <span class="badge-tag split-badge">
        <span class="badge-left">{{ copyrightLeft }}</span>
        <span class="badge-right">{{ copyrightRight }}</span>
      </span>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import useAppStore from '@/store/modules/app'
import useSettingsStore from '@/store/modules/settings'

const appStore = useAppStore()
const settingsStore = useSettingsStore()

const visible = computed(() => settingsStore.footerVisible)
const copyrightText = computed(() => settingsStore.footerContent || 'Copyright © 2024-2026 地球online 纯前端演示版 All Rights Reserved.')
const icpText = computed(() => settingsStore.footerIcp || '本项目为纯前端演示，数据均为本地Mock')
const badgeList = computed(() => settingsStore.footerBadges || [])

/* ========== 实时时钟 ========== */
const timeLeft = ref('')
const timeRight = ref('')
let timeTimer = null

function updateTime() {
  const now = new Date()
  const y = now.getFullYear()
  const M = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  timeLeft.value = `${y}-${M}-${d}`
  timeRight.value = `${h}:${m}:${s}`
}

onMounted(() => {
  updateTime()
  timeTimer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeTimer) clearInterval(timeTimer)
})

/* ========== 智能拆分 badge 文本 ========== */
const icpParts = computed(() => {
  const text = icpText.value
  const match = text.match(/^(豫ICP备)(.*)$/)
  if (match) {
    return { left: match[1], right: match[2] }
  }
  const numIdx = text.search(/\d/)
  if (numIdx > 0) {
    return { left: text.slice(0, numIdx), right: text.slice(numIdx) }
  }
  return { left: text, right: '' }
})

const copyrightParts = computed(() => {
  const text = copyrightText.value
  const match = text.match(/^(©\s*\d{4}-\d{4}\s*)(.*)$/)
  if (match) {
    return { left: match[1].trim(), right: match[2].trim() }
  }
  const parts = text.split(/\s+/)
  if (parts.length >= 2) {
    const mid = Math.ceil(parts.length / 2)
    return { left: parts.slice(0, mid).join(' '), right: parts.slice(mid).join(' ') }
  }
  return { left: text, right: '' }
})

const icpLeft = computed(() => icpParts.value.left)
const icpRight = computed(() => icpParts.value.right)
const copyrightLeft = computed(() => copyrightParts.value.left)
const copyrightRight = computed(() => copyrightParts.value.right)

const sidebarOpened = computed(() => appStore.sidebar.opened)
const isMobile = computed(() => appStore.device === 'mobile')
const sidebarHide = computed(() => appStore.sidebar.hide)

const leftWidth = computed(() => {
  if (isMobile.value || sidebarHide.value) return '0px'
  return sidebarOpened.value ? '210px' : '54px'
})

const copyrightStyle = computed(() => ({
  position: 'fixed',
  bottom: '0',
  left: leftWidth.value,
  right: '0',
  height: '48px',
  padding: '0 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: 'var(--copyright-bg, #f8f8f8)',
  color: 'var(--copyright-color, #666)',
  fontSize: '13px',
  borderTop: '1px solid var(--copyright-border, #e7e7e7)',
  zIndex: 999,
  transition: 'left 0.28s'
}))
</script>

<style scoped>
.copyright-left {
  text-align: left;
  flex-shrink: 0;
}

.copyright-right {
  text-align: right;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.copyright-badges {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.badge-link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  line-height: 0;
}

.badge-img {
  height: 20px;
  width: auto;
  display: block;
  border-radius: 3px;
}

/* ===== 分割式 badge（shields.io 风格） ===== */
.badge-tag {
  display: inline-flex;
  align-items: center;
  height: 20px;
  border-radius: 3px;
  overflow: hidden;
  padding: 0;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.2px;
  line-height: 1;
  white-space: nowrap;
  text-decoration: none;
  transition: opacity 0.2s;
  cursor: default;
}

.badge-tag:hover {
  opacity: 0.85;
}

.badge-left {
  background-color: #555555;
  color: #fff;
  padding: 0 6px;
  height: 100%;
  display: inline-flex;
  align-items: center;
}

.badge-right {
  background-color: #007ec6;
  color: #fff;
  padding: 0 6px;
  height: 100%;
  display: inline-flex;
  align-items: center;
}

/* 备案 badge 可点击 */
.badge-tag[href] {
  cursor: pointer;
}
</style>