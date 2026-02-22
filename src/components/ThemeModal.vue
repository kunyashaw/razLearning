<template>
  <Teleport to="body">
    <div v-if="show" class="theme-overlay" @click.self="close">
      <div class="theme-modal">
        <header class="modal-header">
          <h2>🎨 主题商店</h2>
          <button class="close-btn" @click="close">✕</button>
        </header>

        <section class="themes-section">
          <h3>✨ 选择你喜欢的</h3>
          <div class="theme-grid">
            <div 
              v-for="theme in presetThemes" 
              :key="theme.id"
              class="theme-card"
              :class="{ 'active': themeStore.currentTheme === theme.id && !themeStore.isCustom }"
              @click="selectPreset(theme.id)"
            >
              <div 
                class="theme-card-inner"
                :style="{ background: theme.bg }"
              >
                <span class="theme-emoji">{{ theme.emoji }}</span>
              </div>
              <span class="theme-name">{{ theme.name }}</span>
            </div>
          </div>
        </section>

        <section class="diy-section">
          <h3>🎨 创意DIY</h3>
          <p class="diy-hint">选择你最喜欢的颜色</p>
          <div class="color-grid">
            <button 
              v-for="color in colorOptions" 
              :key="color.hex"
              class="color-btn"
              :class="{ 'active': themeStore.customColor === color.hex && themeStore.isCustom }"
              :style="{ backgroundColor: color.hex }"
              @click="selectColor(color.hex)"
              :title="color.name"
            >
              <span class="color-emoji">{{ color.emoji }}</span>
            </button>
          </div>
        </section>

        <section class="preview-section">
          <h3>👀 预览效果</h3>
          <div 
            class="mini-preview"
            :style="previewStyle"
          >
            <span class="preview-text">{{ currentThemeName }}</span>
            <button class="preview-btn">按钮</button>
          </div>
        </section>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../stores/themeStore'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['update:show'])

const themeStore = useThemeStore()

const presetThemes = [
  { id: 'rainbow', name: '彩虹', emoji: '🌈', bg: '#e3f2fd' },
  { id: 'forest', name: '森林', emoji: '🌲', bg: 'linear-gradient(135deg, #ecfccb, #dcfce7)' },
  { id: 'ocean', name: '海洋', emoji: '🌊', bg: 'linear-gradient(135deg, #e0f2fe, #bae6fd)' },
  { id: 'space', name: '太空', emoji: '🚀', bg: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)' },
  { id: 'candy', name: '糖果', emoji: '🍭', bg: 'linear-gradient(135deg, #fce7f3, #fbcfe8)' },
  { id: 'animal', name: '动物', emoji: '🦁', bg: 'linear-gradient(135deg, #fef3c7, #fde68a)' },
  { id: 'nezha', name: '哪吒', emoji: '🎨', bg: 'linear-gradient(135deg, #fee2e2, #ffedd5)' },
  { id: 'aocing', name: '敖丙', emoji: '🐉', bg: 'linear-gradient(135deg, #e0f2fe, #dbeafe)' },
  { id: 'zootopia', name: '疯狂动物城', emoji: '🐰', bg: 'linear-gradient(135deg, #fef9c3, #fef08a)' },
  { id: 'spongebob', name: '海绵宝宝', emoji: '🧽', bg: 'linear-gradient(135deg, #fef08a, #fde047)' },
  { id: 'shukebeta', name: '舒克贝塔', emoji: '🐭', bg: 'linear-gradient(135deg, #fed7aa, #fdba74)' },
  { id: 'eyecare', name: '护眼', emoji: '👁️', bg: 'linear-gradient(135deg, #dcfce7, #bbf7d0)' },
  { id: 'night', name: '夜间', emoji: '🌙', bg: 'linear-gradient(135deg, #1e293b, #334155)' }
]

const colorOptions = [
  { name: '热情红', hex: '#ef4444', emoji: '❤️' },
  { name: '阳光橙', hex: '#f97316', emoji: '🧡' },
  { name: '柠檬黄', hex: '#eab308', emoji: '💛' },
  { name: '草地绿', hex: '#22c55e', emoji: '💚' },
  { name: '天空蓝', hex: '#3b82f6', emoji: '💙' },
  { name: '薰衣草紫', hex: '#a855f7', emoji: '💜' },
  { name: '糖果粉', hex: '#ec4899', emoji: '💗' },
  { name: '巧克力', hex: '#78350f', emoji: '🤎' }
]

const currentThemeName = computed(() => {
  if (themeStore.isCustom) {
    return '自定义主题'
  }
  const theme = presetThemes.find(t => t.id === themeStore.currentTheme)
  return theme ? theme.name + '主题' : '彩虹主题'
})

const previewStyle = computed(() => {
  if (themeStore.isCustom) {
    return {
      background: `linear-gradient(135deg, ${themeStore.customColor}30, white)`,
      '--accent': themeStore.customColor
    }
  }
  const theme = presetThemes.find(t => t.id === themeStore.currentTheme)
  if (theme) {
    return {
      background: theme.bg,
      '--accent': themeStore.themeData.accent
    }
  }
  return {
    background: presetThemes[0].bg,
    '--accent': '#f472b6'
  }
})

const selectPreset = (themeId) => {
  themeStore.setTheme(themeId)
}

const selectColor = (color) => {
  themeStore.setCustomColor(color)
}

const close = () => {
  emit('update:show', false)
}
</script>

<style scoped>
/* 彩虹主题预览按钮 */
.mini-preview:has(.preview-text) .preview-btn {
  transition: all 0.3s ease;
}

.mini-preview[style*="e3f2fd"] .preview-btn {
  background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
  color: white;
  border: 2px solid white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}
</style>
