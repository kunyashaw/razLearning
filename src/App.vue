<template>
  <div class="min-h-screen transition-all duration-500" :style="mainBackground">
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <!-- 彩虹主题 - 弯弯的彩虹 -->
      <div v-if="themeStore.currentTheme === 'rainbow'" class="rainbow-arc">
        <div class="rainbow-band red"></div>
        <div class="rainbow-band orange"></div>
        <div class="rainbow-band yellow"></div>
        <div class="rainbow-band green"></div>
        <div class="rainbow-band blue"></div>
        <div class="rainbow-band indigo"></div>
        <div class="rainbow-band violet"></div>
      </div>
      
      <div 
        v-for="(item, index) in decorations" 
        :key="index"
        class="theme-decoration"
        :style="getDecorationStyle(index)"
      >
        {{ item }}
      </div>
    </div>
    
    <!-- 主题悬浮按钮 -->
    <button 
      class="fixed top-4 right-4 z-40 theme-toggle-btn opacity-60 hover:opacity-100 transition-opacity"
      :class="{ 'rainbow-btn': themeStore.currentTheme === 'rainbow' }"
      @click="showThemeModal = true"
      :title="'当前主题：' + currentName"
      :style="themeStore.currentTheme === 'rainbow' ? {} : { background: `linear-gradient(135deg, ${themeAccent}, ${adjustColor(themeAccent, -30)})`, width: '36px', height: '36px', fontSize: '18px' }"
    >
      <span class="theme-icon">{{ currentEmoji }}</span>
    </button>
    
    <main class="container mx-auto px-4 py-6 relative z-10 pb-32">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <div v-if="Component" class="page-wrapper">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </main>
    
    <footer class="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/90 shadow-lg border-t border-white/20">
      <div class="container mx-auto px-4 py-2">
        <nav class="relative z-10 backdrop-blur-sm bg-white/70 shadow-md -mt-6 rounded-t-2xl">
          <div class="flex justify-around py-3">
            <router-link 
              v-for="item in navItems" 
              :key="item.path"
              :to="item.path" 
              class="flex flex-col items-center px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105"
              :style="$route.path === item.path ? getNavClass(item.path) : {}"
            >
              <span class="text-2xl mb-1">{{ item.emoji }}</span>
              <span class="text-xs font-medium">{{ item.name }}</span>
            </router-link>
          </div>
        </nav>
      </div>
    </footer>
    
    <ThemeModal v-model:show="showThemeModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from './stores/themeStore'
import { useBookStore } from './stores/bookStore'
import ThemeModal from './components/ThemeModal.vue'
import bookService from './services/bookService.js'
import oxfordService from './services/oxfordService.js'
import './assets/themes.css'

const route = useRoute()
const themeStore = useThemeStore()
const bookStore = useBookStore()

const showThemeModal = ref(false)

const currentEmoji = computed(() => themeStore.themeData.emoji)
const currentName = computed(() => themeStore.themeData.name)
const decorations = computed(() => themeStore.themeData.decorations || ['🌈', '☁️', '⭐'])
const themeAccent = computed(() => themeStore.themeData.accent || '#f472b6')

const adjustColor = (hex, percent) => {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.min(255, Math.max(0, (num >> 16) + amt))
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt))
  const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt))
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}

const getNavClass = (path) => {
  const accent = themeAccent.value
  const darkAccent = adjustColor(accent, -30)
  
  // 彩虹主题特殊处理
  if (themeStore.currentTheme === 'rainbow') {
    return {
      background: 'linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      border: '2px solid white'
    }
  }
  
  return {
    background: `linear-gradient(135deg, ${accent}, ${darkAccent})`,
    color: 'white',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  }
}

const mainBackground = computed(() => {
  if (themeStore.wallpaper) {
    return {
      backgroundImage: `url(${themeStore.wallpaper})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }
  }
  
  return {
    background: themeStore.themeData.bg
  }
})

const decorationPositions = [
  { top: '10%', left: '5%', animation: 'float 3s infinite ease-in-out' },
  { top: '15%', right: '10%', animation: 'float 4s infinite ease-in-out reverse' },
  { top: '30%', left: '15%', animation: 'float 5s infinite ease-in-out' },
  { top: '25%', right: '20%', animation: 'float 3.5s infinite ease-in-out reverse' },
  { top: '50%', left: '8%', animation: 'float 4.5s infinite ease-in-out' },
  { top: '60%', right: '5%', animation: 'float 4s infinite ease-in-out' },
  { top: '70%', left: '20%', animation: 'float 5s infinite ease-in-out reverse' },
  { top: '65%', right: '15%', animation: 'float 3.5s infinite ease-in-out' },
  { top: '80%', left: '10%', animation: 'float 4s infinite ease-in-out reverse' },
  { top: '75%', right: '25%', animation: 'float 4.5s infinite ease-in-out' }
]

const getDecorationStyle = (index) => {
  const pos = decorationPositions[index % decorationPositions.length]
  const size = 24 + (index % 3) * 12
  return {
    position: 'absolute',
    top: pos.top,
    left: pos.left,
    right: pos.right,
    fontSize: `${size}px`,
    opacity: 0.15 + (index % 3) * 0.05,
    animation: pos.animation,
    filter: 'blur(0.5px)'
  }
}

const navItems = [
  { path: '/raz', name: 'RAZ', emoji: '📖' },
  { path: '/oxford', name: '牛津树', emoji: '🌳' },
  { path: '/me', name: '我的', emoji: '👤' },
  { path: '/settings', name: '设置', emoji: '⚙️' }
]

onMounted(() => {
  themeStore.loadSavedTheme()
  bookService.initBookStore(bookStore)
  oxfordService.initOxfordBookStore(bookStore)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.theme-toggle-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(168, 85, 247, 0.4);
  transition: all 0.2s ease;
}

.theme-toggle-btn:hover {
  transform: scale(1.1) rotate(10deg);
  box-shadow: 0 6px 24px rgba(168, 85, 247, 0.5);
}

.theme-toggle-btn:active {
  transform: scale(0.95);
}

.theme-icon {
  font-size: 24px;
}

.theme-label {
  font-size: 10px;
  font-weight: 600;
  color: white;
  margin-top: 2px;
}

@media (max-width: 640px) {
  .theme-toggle-btn {
    width: 48px;
    height: 48px;
  }
  
  .theme-icon {
    font-size: 20px;
  }
  
  .theme-label {
    font-size: 9px;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-10px) rotate(5deg);
  }
  50% {
    transform: translateY(-5px) rotate(-5deg);
  }
  75% {
    transform: translateY(-15px) rotate(3deg);
  }
}

/* 弯弯的彩虹 */
.rainbow-arc {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 300px;
  overflow: hidden;
  z-index: 0;
}

.rainbow-band {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50% 50% 0 0;
  opacity: 0.6;
}

.rainbow-band.red {
  width: 600px;
  height: 300px;
  background: #ff0000;
}

.rainbow-band.orange {
  width: 560px;
  height: 280px;
  background: #ff7f00;
}

.rainbow-band.yellow {
  width: 520px;
  height: 260px;
  background: #ffff00;
}

.rainbow-band.green {
  width: 480px;
  height: 240px;
  background: #00ff00;
}

.rainbow-band.blue {
  width: 440px;
  height: 220px;
  background: #0000ff;
}

.rainbow-band.indigo {
  width: 400px;
  height: 200px;
  background: #4b0082;
}

.rainbow-band.violet {
  width: 360px;
  height: 180px;
  background: #9400d3;
}

/* 彩虹按钮 */
.rainbow-btn {
  background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3) !important;
  border: 3px solid white !important;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important;
  animation: none !important;
}
</style>
