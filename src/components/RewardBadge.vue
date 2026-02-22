<template>
  <div class="reward-wrapper">
    <div
      class="reward-badge"
      :class="[
        unlocked ? 'unlocked' : 'locked',
        `level-${level}`,
        { 'is-cycle': isCycle }
      ]"
      :style="badgeStyle"
      @click="toggleDetail"
    >
      <div class="badge-glow" v-if="unlocked && glow"></div>
      <div class="badge-inner">
        <div class="badge-icon">{{ icon }}</div>
        <div class="badge-label">{{ isCycle ? count + '次' : milestone + '本' }}</div>
      </div>
      <div v-if="!unlocked" class="locked-mask">
        <span class="lock-icon">🔒</span>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="isActive" class="detail-overlay" @click="closeDetail">
        <div class="detail-card" :class="[`level-bg-${level}`, { 'locked': !unlocked, 'unlocked': unlocked }]" :style="cardStyle" @click.stop>
          <button class="close-btn" @click="closeDetail">✕</button>
          
          <div class="detail-glow" v-if="unlocked && glow"></div>
          
          <div class="detail-icon-wrapper" :class="{ 'locked-icon': !unlocked }">
            <div class="detail-icon">{{ icon }}</div>
          </div>
          
          <h3 class="detail-title" :class="{ 'locked-title': !unlocked }">{{ name }}</h3>
          <p class="detail-desc">{{ description }}</p>
          
          <div class="detail-milestone">
            <span class="milestone-num">{{ isCycle ? count : milestone }}</span>
            <span class="milestone-text">{{ isCycle ? '次达成' : '本绘本' }}</span>
          </div>
          
          <div class="level-badge" :class="`level-${level}`">
            {{ levelText }}
          </div>
          
          <div v-if="!unlocked" class="detail-status locked">
            🔒 未解锁
          </div>
          
          <div v-else-if="unlockedTime" class="detail-time">
            {{ unlockedTime }}
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'

const props = defineProps({
  id: { type: String, required: true },
  icon: { type: String, default: '⭐' },
  milestone: { type: Number, required: true },
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  unlocked: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
  isCycle: { type: Boolean, default: false },
  count: { type: Number, default: 1 },
  bg: { type: String, default: 'from-gray-400 to-gray-600' },
  border: { type: String, default: 'border-gray-400' },
  glow: { type: String, default: '' },
  level: { type: String, default: 'bronze' },
  unlockedAt: { type: String, default: '' }
})

const emit = defineEmits(['select'])

const isActive = ref(false)

const levelText = computed(() => {
  const texts = {
    bronze: '铜牌',
    silver: '银牌',
    gold: '金牌',
    platinum: '铂金',
    legend: '传奇'
  }
  return texts[props.level] || ''
})

const unlockedTime = computed(() => {
  if (!props.unlockedAt) return ''
  const date = new Date(props.unlockedAt)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${month}月${day}日 ${hours}:${minutes}`
})

const gradientMap = {
  'from-gray-400 to-gray-600': ['#9ca3af', '#4b5563'],
  'from-green-400 to-green-600': ['#4ade80', '#16a34a'],
  'from-blue-400 to-blue-600': ['#60a5fa', '#2563eb'],
  'from-cyan-400 to-cyan-600': ['#22d3ee', '#0891b2'],
  'from-indigo-400 to-indigo-600': ['#818cf8', '#4f46e5'],
  'from-amber-400 to-amber-600': ['#fbbf24', '#d97706'],
  'from-purple-500 to-purple-700': ['#a855f7', '#7c3aed'],
  'from-pink-500 to-pink-700': ['#ec4899', '#db2777'],
  'from-rose-500 to-rose-700': ['#f43f5e', '#e11d48'],
  'from-violet-500 to-violet-800': ['#8b5cf6', '#6d28d9'],
  'from-yellow-400 via-orange-500 to-red-500': ['#facc15', '#f97316', '#ef4444'],
  'from-yellow-500 to-orange-500': ['#eab308', '#f97316'],
  'from-orange-500 to-red-500': ['#f97316', '#ef4444'],
  'from-purple-600 via-violet-600 to-purple-800': ['#9333ea', '#7c3aed', '#6b21a8'],
  'from-blue-500 to-indigo-600': ['#3b82f6', '#4f46e5'],
}

const getGradientColors = (gradientClass) => {
  return gradientMap[gradientClass] || ['#9ca3af', '#4b5563']
}

const badgeStyle = computed(() => {
  if (!props.unlocked) return {}
  const colors = getGradientColors(props.bg)
  return {
    '--bg-start': colors[0],
    '--bg-end': colors[1] || colors[0],
    '--border-color': props.border.replace('border-', '')
  }
})

const cardStyle = computed(() => {
  const colors = getGradientColors(props.bg)
  const glowColor = colors[0]
  const glowColorEnd = colors[colors.length - 1]
  
  return {
    '--glow-color': glowColor,
    '--glow-color-end': glowColorEnd,
    background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1] || colors[0]} 60%, ${colors[colors.length - 1]} 100%)`
  }
})

const toggleDetail = () => {
  emit('select', props.id)
}

const closeDetail = () => {
  isActive.value = false
  emit('select', null)
}

watch(() => props.active, (newVal) => {
  isActive.value = newVal
})

onMounted(() => {
  if (props.active) {
    isActive.value = true
  }
})
</script>

<style scoped>
.reward-wrapper {
  display: inline-block;
}

.reward-badge {
  width: 75px;
  height: 90px;
  cursor: pointer;
  position: relative;
  border-radius: 16px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.reward-badge.unlocked {
  background: linear-gradient(135deg, var(--bg-start), var(--bg-end));
  border: 3px solid;
  border-color: var(--border-color);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  position: relative;
}

.reward-badge.unlocked::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 20px;
  background: linear-gradient(45deg, 
    var(--bg-start), 
    var(--border-color), 
    var(--bg-end), 
    var(--border-color), 
    var(--bg-start));
  background-size: 400% 400%;
  z-index: -1;
  animation: borderShine 3s ease infinite;
}

@keyframes borderShine {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.reward-badge.locked {
  background: #f3f4f6;
  border: 2px solid #d1d5db;
  opacity: 0.7;
}

.badge-glow {
  position: absolute;
  inset: -4px;
  border-radius: 20px;
  background: inherit;
  filter: blur(10px);
  opacity: 0.6;
  z-index: -1;
}

.reward-badge.level-legend .badge-glow {
  animation: legendPulse 2s ease-in-out infinite;
}

@keyframes legendPulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

.badge-inner {
  width: 100%;
  height: 100%;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.reward-badge.unlocked .badge-inner {
  background: rgba(255, 255, 255, 0.95);
}

.reward-badge.locked .badge-inner {
  background: rgba(249, 250, 251, 0.9);
}

.badge-icon {
  font-size: 36px;
  margin-bottom: 4px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.reward-badge.level-gold .badge-icon {
  filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.6));
}

.reward-badge.level-platinum .badge-icon {
  filter: drop-shadow(0 0 12px rgba(168, 85, 247, 0.8));
}

.reward-badge.level-legend .badge-icon {
  filter: drop-shadow(0 0 16px rgba(251, 191, 36, 1));
  animation: legendShine 3s ease-in-out infinite;
}

@keyframes legendShine {
  0%, 100% { filter: drop-shadow(0 0 16px rgba(251, 191, 36, 1)); }
  50% { filter: drop-shadow(0 0 24px rgba(251, 146, 60, 1)); }
}

.badge-label {
  font-size: 12px;
  font-weight: bold;
  padding: 4px 0;
  width: 100%;
  text-align: center;
  border-radius: 0 0 12px 12px;
}

.reward-badge.unlocked .badge-label {
  background: linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(243,244,246,0.9));
  color: #374151;
}

.reward-badge.locked .badge-label {
  background: #e5e7eb;
  color: #6b7280;
}

.locked-mask {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 16px;
}

.lock-icon {
  font-size: 24px;
  opacity: 0.5;
}

/* Detail Popup */
.detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.detail-card {
  border-radius: 20px;
  padding: 24px;
  max-width: 280px;
  width: 85%;
  text-align: center;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s ease;
  overflow: hidden;
}

.detail-card.unlocked {
  border: 4px solid;
  animation: borderGlow 2s ease-in-out infinite alternate;
}

@keyframes borderGlow {
  0% {
    border-color: var(--glow-color, #fbbf24);
    box-shadow: 0 0 20px var(--glow-color, #fbbf24), 0 20px 40px rgba(0, 0, 0, 0.25);
  }
  100% {
    border-color: var(--glow-color-end, #f59e0b);
    box-shadow: 0 0 35px var(--glow-color-end, #f59e0b), 0 20px 40px rgba(0, 0, 0, 0.25);
  }
}

.detail-card.level-bg-legend {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 60%, #fde68a 100%);
}

.detail-card.level-bg-platinum {
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 60%, #c4b5fd 100%);
}

.detail-card.level-bg-gold {
  background: linear-gradient(135deg, #fefce8 0%, #fef9c3 60%, #fde047 100%);
}

.detail-card.level-bg-silver {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 60%, #e5e7eb 100%);
}

.detail-card.level-bg-bronze {
  background: linear-gradient(135deg, #fafaf9 0%, #f5f5f4 60%, #e7e5e4 100%);
}

.detail-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, transparent 60%);
  animation: glowRotate 10s linear infinite;
  pointer-events: none;
}

@keyframes glowRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(0, 0, 0, 0.1);
  color: #374151;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.close-btn:hover {
  background: white;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.detail-icon-wrapper {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  background: white;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  border: 3px solid rgba(255, 255, 255, 0.8);
}

.detail-icon-wrapper.locked-icon {
  background: #f3f4f6;
  filter: grayscale(0.8);
}

.detail-icon {
  font-size: 56px;
}

.detail-card.level-bg-legend .detail-icon {
  animation: legendShine 2s ease-in-out infinite;
}

.detail-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #1f2937;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.detail-title.locked-title {
  color: #9ca3af;
}

.detail-desc {
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 16px;
  line-height: 1.5;
}

.detail-milestone {
  margin-bottom: 16px;
}

.milestone-num {
  font-size: 42px;
  font-weight: bold;
  color: #1f2937;
  display: block;
}

.detail-card.level-bg-legend .milestone-num {
  color: #b45309;
}

.milestone-text {
  display: block;
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
}

.level-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
}

.level-badge.level-legend {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #78350f;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
}

.level-badge.level-platinum {
  background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}

.level-badge.level-gold {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #78350f;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

.level-badge.level-silver {
  background: linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%);
  color: #374151;
  box-shadow: 0 4px 12px rgba(156, 163, 175, 0.4);
}

.level-badge.level-bronze {
  background: linear-gradient(135deg, #d6d3d1 0%, #a8a29e 100%);
  color: #44403c;
  box-shadow: 0 4px 12px rgba(168, 162, 158, 0.4);
}

.detail-time {
  font-size: 13px;
  color: #6b7280;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.detail-time::before {
  content: '🕐 ';
}

.detail-status.locked {
  font-size: 14px;
  font-weight: bold;
  color: #6b7280;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

@keyframes slideUp {
  from { transform: translateY(30px) scale(0.95); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}
</style>