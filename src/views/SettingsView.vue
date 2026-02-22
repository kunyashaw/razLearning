<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-800">设置</h2>
    
    <!-- 主题设置 -->
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <span>🎨</span>
        <span>主题选择</span>
        <span class="text-sm" :style="{ color: themeAccent }">{{ currentEmoji }} {{ currentName }}</span>
      </h3>
      <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
        <button 
          v-for="theme in themes" 
          :key="theme.id"
          @click="selectTheme(theme.id)"
          class="p-3 rounded-xl transition-all duration-300 relative theme-btn"
          :class="{ 'theme-selected': selectedTheme === theme.id, 'theme-night': theme.id === 'night' }"
          :style="getThemeStyle(theme)"
        >
          <span class="text-2xl">{{ theme.emoji }}</span>
          <span class="text-xs font-medium mt-1" :class="{ 'text-gray-800': theme.id !== 'night', 'text-gray-200': theme.id === 'night' }">{{ theme.name }}</span>
          <div v-if="selectedTheme === theme.id" class="selected-badge">
            <span class="text-lg">✓</span>
          </div>
          <div v-if="selectedTheme === theme.id" class="selected-ring"></div>
        </button>
      </div>
    </div>
    
    <!-- 学习偏好 -->
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <span>📚</span>
        <span>学习偏好</span>
      </h3>
      <div class="space-y-4">
        <div class="p-4 rounded-xl" :style="{ background: themeAccent + '18' }">
          <h4 class="text-sm font-medium text-gray-800 mb-2">默认学习方式</h4>
          <select v-model="defaultMode" class="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm">
            <option value="pdf">PDF绘本</option>
            <option value="video">视频学习</option>
            <option value="audio">音频朗读</option>
          </select>
          <p class="text-xs text-gray-500 mt-2">打开绘本时默认显示的内容</p>
        </div>
        
        <div class="p-4 rounded-xl" :style="{ background: themeAccent + '18' }">
          <h4 class="text-sm font-medium text-gray-800 mb-2">PDF自动翻页</h4>
          <select v-model="autoFlipDefault" class="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm">
            <option value="true">默认开启</option>
            <option value="false">默认关闭</option>
          </select>
          <p class="text-xs text-gray-500 mt-2">音频播放时是否自动翻页</p>
        </div>
      </div>
    </div>
    
    <!-- 显示设置 -->
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <span>🖥️</span>
        <span>显示设置</span>
      </h3>
      <div class="space-y-4">
        <div class="flex justify-between items-center p-4 rounded-xl" :style="{ background: themeAccent + '18' }">
          <div>
            <h4 class="text-sm font-medium text-gray-800">显示完成标记</h4>
            <p class="text-xs text-gray-500">在列表中显示已完成的绘本</p>
          </div>
          <button @click="toggleShowCompleted" class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors" :style="{ background: showCompleted ? themeAccent : '#d1d5db' }">
            <span :class="['inline-block h-4 w-4 transform rounded-full transition-transform bg-white', showCompleted ? 'translate-x-6' : 'translate-x-1']"></span>
          </button>
        </div>
        
        <div class="p-4 rounded-xl" :style="{ background: themeAccent + '18' }">
          <h4 class="text-sm font-medium text-gray-800 mb-2">PDF默认缩放</h4>
          <select v-model="defaultZoom" class="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm">
            <option value="0.6">60% - 适合小屏幕</option>
            <option value="0.8">80% - 推荐</option>
            <option value="1.0">100% - 原始大小</option>
            <option value="1.2">120% - 放大显示</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- 关于 -->
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <span>ℹ️</span>
        <span>关于</span>
      </h3>
      <div class="space-y-3">
        <div class="flex justify-between items-center p-3">
          <span class="text-sm text-gray-600">版本</span>
          <div class="flex items-center gap-2">
            <span 
              class="text-sm text-gray-800 cursor-pointer hover:text-blue-500 px-2 py-1 rounded"
              :class="{ 'bg-yellow-100': clickCount > 0 }"
              @click="handleVersionClick"
            >1.0.0</span>
            <label v-if="showDeveloperToggle" class="toggle-switch">
              <input type="checkbox" v-model="isDevMode" @change="onDevModeChange">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
        <div class="flex justify-between items-center p-3">
          <span class="text-sm text-gray-600">开发者</span>
          <span class="text-sm text-gray-800">kunyashaw</span>
        </div>
      </div>
    </div>
    
    <!-- 缓存管理 -->
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <span>💾</span>
        <span>缓存管理</span>
      </h3>
      <div class="space-y-4">
        <div class="flex justify-between items-center p-4 rounded-xl" :style="{ background: themeAccent + '18' }">
          <div>
            <h4 class="text-sm font-medium text-gray-800">PDF缓存</h4>
            <p class="text-xs text-gray-500">已缓存 {{ cacheStats.count }} 个绘本 ({{ formatBytes(cacheStats.totalSize) }})</p>
          </div>
          <button 
            @click="showCacheModal = true"
            class="px-4 py-2 rounded-lg text-sm font-medium text-white"
            :style="{ background: themeAccent }"
          >
            管理
          </button>
        </div>
        <p class="text-xs text-gray-500">缓存有效期: {{ cacheStats.cacheDays }}天</p>
      </div>
    </div>
    
    <!-- 缓存管理弹窗 -->
    <Teleport to="body">
      <div v-if="showCacheModal" class="fixed inset-0 flex items-center justify-center z-50 bg-black/50" @click.self="showCacheModal = false">
        <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
          <h3 class="text-lg font-bold text-gray-800 mb-4">PDF缓存管理</h3>
          
          <div class="flex-1 overflow-y-auto space-y-2 mb-4">
            <div v-if="cachedPDFs.length === 0" class="text-center text-gray-500 py-8">
              暂无缓存
            </div>
            <div 
              v-for="pdf in cachedPDFs" 
              :key="pdf.url"
              class="p-3 bg-gray-50 rounded-lg"
            >
              <div class="text-sm font-medium text-gray-800 truncate">{{ pdf.url.split('/').pop() }}</div>
              <div class="text-xs text-gray-500 mt-1">
                缓存时间: {{ formatDate(pdf.cachedAt) }}
                <span class="mx-1">|</span>
                过期时间: {{ formatDate(pdf.expiresAt) }}
              </div>
            </div>
          </div>
          
          <div class="flex gap-2">
            <button 
              @click="handleClearExpired"
              class="flex-1 py-2 rounded-lg text-sm font-medium bg-yellow-500 text-white hover:bg-yellow-600"
            >
              清除过期
            </button>
            <button 
              @click="handleClearAll"
              class="flex-1 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600"
            >
              清除全部
            </button>
            <button 
              @click="showCacheModal = false"
              class="flex-1 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </Teleport>
    
    <!-- 开发者菜单 -->
    <div v-if="showDeveloperMenu" class="bg-gray-900 rounded-2xl shadow-lg p-6 text-white">
      <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>🔧</span>
        <span>开发者菜单</span>
      </h3>

      <div class="space-y-4">
        <div class="flex gap-2">
          <button
            @click="exportData"
            class="flex-1 py-2 rounded bg-blue-600 hover:bg-blue-700 text-sm"
          >
            导出数据
          </button>
          <button
            @click="importData"
            class="flex-1 py-2 rounded bg-purple-600 hover:bg-purple-700 text-sm"
          >
            导入数据
          </button>
        </div>
        
        <div class="flex gap-2 mt-4">
          <button 
            @click="toggleDevMode"
            class="flex-1 py-2 rounded text-sm"
            :class="isDevMode ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'"
          >
            {{ isDevMode ? '🔴 关闭开发者模式' : '🟢 开启开发者模式' }}
          </button>
        </div>
        
        <button 
          @click="closeDeveloperMenu"
          class="w-full py-2 rounded bg-gray-700 hover:bg-gray-600 text-sm mt-4"
        >
          关闭开发者菜单
        </button>
      </div>
    </div>
    
    <!-- 危险操作 -->
    <div class="bg-red-50 rounded-2xl shadow-lg p-6">
      <h3 class="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
        <span>⚠️</span>
        <span>危险操作</span>
      </h3>
      
      <button 
        @click="showClearDialog = true"
        class="w-full py-3 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
      >
        <span>🗑️</span>
        <span>清除所有学习数据</span>
      </button>
      <p class="text-xs text-gray-500 mt-2 text-center">清除后将无法恢复，请谨慎操作</p>
    </div>

    <!-- 清除数据确认弹窗 -->
    <div v-if="showClearDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl max-w-sm w-full">
        <div class="p-6">
          <div class="text-center mb-4">
            <span class="text-4xl">⚠️</span>
            <h3 class="text-lg font-bold text-gray-800 mt-2">确认清除</h3>
          </div>
          <div class="bg-red-50 rounded-xl p-4 mb-4">
            <p class="text-sm text-gray-700 mb-2">此操作将永久删除以下数据：</p>
            <ul class="text-xs text-gray-600 space-y-1 list-disc list-inside">
              <li>已完成绘本记录</li>
              <li>学习历史</li>
              <li>累计学习时间</li>
              <li>已解锁的徽章和勋章</li>
              <li>已掌握的单词记录</li>
              <li>学习连续天数</li>
            </ul>
            <p class="text-xs text-red-600 mt-3 font-medium">⚠️ 数据删除后无法恢复，请谨慎操作</p>
          </div>
          <div class="space-y-3">
            <div>
              <label class="text-sm text-gray-600 mb-1 block">请输入 <span class="text-red-500 font-bold">删除</span> 确认：</label>
              <input
                v-model="verifyText"
                type="text"
                placeholder="请输入删除"
                class="w-full p-3 border rounded-xl text-sm"
                :class="{ 'border-red-500': verifyError, 'border-gray-300': !verifyError }"
              >
              <p v-if="verifyError" class="text-red-500 text-xs mt-1">{{ verifyError }}</p>
            </div>
            <div class="flex gap-3">
              <button
                @click="confirmClear"
                :disabled="verifyText !== '删除'"
                class="flex-1 py-3 rounded-xl font-medium transition-colors"
                :class="verifyText === '删除' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
              >
                确认清除
              </button>
              <button
                @click="cancelVerify"
                class="flex-1 py-3 rounded-xl font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useThemeStore } from '../stores/themeStore'
import { useBookStore } from '../stores/bookStore'
import { useRewardStore } from '../stores/rewardStore.js'
import { getAllCachedPDFs, clearAllCache, getCacheStats, clearExpiredCache } from '../services/pdfCache'

const themeStore = useThemeStore()
const bookStore = useBookStore()
const rewardStore = useRewardStore()

const showCacheModal = ref(false)
const cachedPDFs = ref([])
const cacheStats = ref({ count: 0, totalSize: 0, cacheDays: 15 })

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadCacheStats = async () => {
  cacheStats.value = await getCacheStats()
}

const loadCachedPDFs = async () => {
  cachedPDFs.value = await getAllCachedPDFs()
}

const handleClearExpired = async () => {
  await clearExpiredCache()
  await loadCachedPDFs()
  await loadCacheStats()
}

const handleClearAll = async () => {
  if (confirm('确定要清除所有缓存吗？')) {
    await clearAllCache()
    await loadCachedPDFs()
    await loadCacheStats()
  }
}

onMounted(() => {
  themeStore.initTheme()
  localStorage.removeItem('learning_app_backups')
  loadCacheStats()
})

watch(showCacheModal, (val) => {
  if (val) loadCachedPDFs()
})

// 版本点击计数器
const clickCount = ref(0)
const showDeveloperMenu = ref(false)
const showDeveloperToggle = ref(localStorage.getItem('showDeveloperToggle') === 'true')
const isDevMode = ref(localStorage.getItem('devMode') === 'true')

const handleVersionClick = () => {
  clickCount.value++
  if (clickCount.value >= 10) {
    showDeveloperToggle.value = true
    localStorage.setItem('showDeveloperToggle', 'true')
    clickCount.value = 0
  }
}

const onDevModeChange = () => {
  localStorage.setItem('devMode', isDevMode.value.toString())
  if (isDevMode.value) {
    showDeveloperToggle.value = true
    localStorage.setItem('showDeveloperToggle', 'true')
    showDeveloperMenu.value = true
  } else {
    showDeveloperToggle.value = false
    localStorage.setItem('showDeveloperToggle', 'false')
    showDeveloperMenu.value = false
  }
  window.dispatchEvent(new CustomEvent('devModeChanged', { detail: { isDevMode: isDevMode.value } }))
}

const toggleDevMode = () => {
  isDevMode.value = !isDevMode.value
  localStorage.setItem('devMode', isDevMode.value.toString())
  window.dispatchEvent(new CustomEvent('devModeChanged', { detail: { isDevMode: isDevMode.value } }))
}

const closeDeveloperMenu = () => {
  showDeveloperMenu.value = false
}

const exportData = () => {
  const data = {
    exportDate: new Date().toISOString(),
    totalBooksRead: parseInt(localStorage.getItem('totalBooksRead') || '0'),
    unlockedRewards: JSON.parse(localStorage.getItem('unlockedRewards') || '[]'),
    unlockedTimes: JSON.parse(localStorage.getItem('unlockedTimes') || '{}'),
    currentStreak: parseInt(localStorage.getItem('currentStreak') || '0'),
    completedBooks: JSON.parse(localStorage.getItem('completedBooks') || '[]'),
    studyHistory: JSON.parse(localStorage.getItem('studyHistory') || '[]'),
    studyTimeByDate: JSON.parse(localStorage.getItem('studyTimeByDate') || '{}'),
    learnedWords: JSON.parse(localStorage.getItem('learnedWords') || '[]')
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `learning_export_${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const importData = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result)
          if (data.totalBooksRead !== undefined) {
            localStorage.setItem('totalBooksRead', data.totalBooksRead.toString())
          }
          if (data.unlockedRewards) {
            localStorage.setItem('unlockedRewards', JSON.stringify(data.unlockedRewards))
          }
          if (data.currentStreak !== undefined) {
            localStorage.setItem('currentStreak', data.currentStreak.toString())
          }
          if (data.completedBooks) {
            localStorage.setItem('completedBooks', JSON.stringify(data.completedBooks))
          }
          if (data.studyHistory) {
            localStorage.setItem('studyHistory', JSON.stringify(data.studyHistory))
          }
          if (data.studyTimeByDate) {
            localStorage.setItem('studyTimeByDate', JSON.stringify(data.studyTimeByDate))
          }
          if (data.unlockedTimes) {
            localStorage.setItem('unlockedTimes', JSON.stringify(data.unlockedTimes))
          }
          if (data.learnedWords) {
            localStorage.setItem('learnedWords', JSON.stringify(data.learnedWords))
          }
          
          showDeveloperMenu.value = false
          alert('数据导入成功，请刷新页面查看')
          location.reload()
        } catch (err) {
          alert('导入失败：文件格式错误')
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}

const themeAccent = computed(() => themeStore.themeData.accent || '#f472b6')
const currentEmoji = computed(() => themeStore.themeData.emoji)
const currentName = computed(() => themeStore.themeData.name)
const selectedTheme = computed(() => {
  return themeStore.currentTheme
})

// 主题列表
const themes = [
  { id: 'rainbow', name: '彩虹', emoji: '🌈', accent: '#f472b6', bg: 'linear-gradient(135deg, #ffebf3 0%, #e0f2fe 50%, #fef3c7 100%)' },
  { id: 'forest', name: '森林', emoji: '🌲', accent: '#22c55e', bg: 'linear-gradient(135deg, #ecfccb 0%, #dcfce7 100%)' },
  { id: 'ocean', name: '海洋', emoji: '🌊', accent: '#0ea5e9', bg: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)' },
  { id: 'space', name: '太空', emoji: '🚀', accent: '#6366f1', bg: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)' },
  { id: 'candy', name: '糖果', emoji: '🍬', accent: '#ec4899', bg: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)' },
  { id: 'animal', name: '动物', emoji: '🦁', accent: '#f59e0b', bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' },
  { id: 'nezha', name: '哪吒', emoji: '🎨', accent: '#ef4444', bg: 'linear-gradient(135deg, #fee2e2 0%, #ffedd5 100%)' },
  { id: 'aocing', name: '敖丙', emoji: '🐉', accent: '#3b82f6', bg: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)' },
  { id: 'zootopia', name: '动物城', emoji: '🐰', accent: '#eab308', bg: 'linear-gradient(135deg, #fef9c3 0%, #fef08a 100%)' },
  { id: 'spongebob', name: '海绵', emoji: '🧽', accent: '#eab308', bg: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)' },
  { id: 'shukebeta', name: '舒克', emoji: '🐭', accent: '#f97316', bg: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)' },
  { id: 'eyecare', name: '护眼', emoji: '👁️', accent: '#22c55e', bg: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' },
  { id: 'night', name: '夜间', emoji: '🌙', accent: '#94a3b8', bg: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }
]

const getThemeStyle = (theme) => {
  return {
    background: theme.bg
  }
}

const selectTheme = (id) => {
  themeStore.setTheme(id)
}

// 从localStorage读取设置
const defaultMode = ref(localStorage.getItem('defaultMode') || 'pdf')
const autoFlipDefault = ref(localStorage.getItem('autoFlipDefault') || 'false')
const showCompleted = ref(localStorage.getItem('showCompleted') !== 'false')
const defaultZoom = ref(localStorage.getItem('defaultZoom') || '0.8')

const toggleShowCompleted = () => {
  showCompleted.value = !showCompleted.value
  localStorage.setItem('showCompleted', showCompleted.value)
}

// 保存设置
watch(defaultMode, (val) => localStorage.setItem('defaultMode', val))
watch(autoFlipDefault, (val) => localStorage.setItem('autoFlipDefault', val))
watch(defaultZoom, (val) => localStorage.setItem('defaultZoom', val))

// 高级验证
const showClearDialog = ref(false)
const verifyText = ref('')
const verifyError = ref('')

const confirmClear = () => {
  if (verifyText.value === '删除') {
    bookStore.clearAllData()
    rewardStore.clearAllData()
    verifyText.value = ''
    verifyError.value = ''
    showClearDialog.value = false
    alert('删除成功')
  } else {
    verifyError.value = '输入内容不正确'
  }
}

const cancelVerify = () => {
  verifyText.value = ''
  verifyError.value = ''
  showClearDialog.value = false
}
</script>

<style scoped>
.theme-btn {
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border: 2px solid transparent;
  position: relative;
}

.theme-btn:hover {
  transform: scale(1.05);
}

.theme-night {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
}

.theme-night .text-emoji,
.theme-night .text-name {
  color: #e2e8f0;
}

.theme-selected {
  border-color: var(--theme-accent, #f472b6) !important;
  box-shadow: 0 0 0 4px var(--theme-accent, #f472b6), 0 4px 16px rgba(0, 0, 0, 0.2);
  transform: scale(1.08);
  z-index: 1;
}

.theme-selected.theme-night {
  border-color: #94a3b8 !important;
  box-shadow: 0 0 0 4px #94a3b8, 0 4px 16px rgba(0, 0, 0, 0.4);
}

.selected-ring {
  position: absolute;
  inset: -4px;
  border: 3px solid var(--theme-accent, #f472b6);
  border-radius: 16px;
  pointer-events: none;
  animation: ringPulse 2s ease-in-out infinite;
}

.theme-selected.theme-night .selected-ring {
  border-color: #94a3b8;
}

@keyframes ringPulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
}

.selected-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 28px;
  height: 28px;
  background: var(--theme-accent, #f472b6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  z-index: 10;
  border: 2px solid white;
}

.theme-night .selected-badge {
  background: #94a3b8;
}

.selected-badge span {
  font-size: 16px;
  font-weight: bold;
  line-height: 1;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #22c55e;
}

input:checked + .toggle-slider:before {
  transform: translateX(20px);
}
</style>
