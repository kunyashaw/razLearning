<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-800">我的学习</h2>
    
    <!-- RAZ已掌握单词 -->
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <span>📖</span>
        <span>RAZ已掌握单词</span>
        <span class="text-xs px-2 py-0.5 rounded-full text-white" :style="{ background: themeAccent }">{{ filteredBooks.length }}</span>
      </h3>
      
      <!-- 搜索框 -->
      <div class="mb-4">
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="搜索绘本名称..."
          class="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2"
          :style="{ '--tw-ring-color': themeAccent + '50' }"
        />
      </div>
      
      <!-- 统计卡片 -->
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="bg-gray-50 rounded-xl p-4 text-center">
          <div class="text-2xl font-bold" :style="{ color: themeAccent }">{{ learnedWordsCount }}</div>
          <div class="text-xs text-gray-600">掌握单词(个)</div>
        </div>
        <div class="bg-gray-50 rounded-xl p-4 text-center">
          <div class="text-2xl font-bold" :style="{ color: themeAccent }">{{ learnedBooksCount }}</div>
          <div class="text-xs text-gray-600">学习绘本(本)</div>
        </div>
      </div>
      
      <!-- 绘本单词列表 - 固定高度可滚动 -->
      <div v-if="filteredBooks.length > 0" class="max-h-80 overflow-y-auto space-y-2 pr-2">
        <div 
          v-for="book in filteredBooks" 
          :key="book.bookId"
          class="border border-gray-200 rounded-xl overflow-hidden"
        >
          <div class="w-full flex items-center justify-between p-3 bg-gray-50">
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <span class="text-lg shrink-0">{{ book.type === 'raz' ? '📖' : '🌳' }}</span>
              <span class="text-sm font-medium text-gray-800 truncate">{{ book.title }}</span>
              <span class="text-xs px-2 py-0.5 rounded-full shrink-0" :style="{ background: themeAccent + '30', color: themeAccent }">
                {{ book.level }}
              </span>
              <span class="text-xs text-gray-500 shrink-0">
                ({{ book.wordCount }}词)
              </span>
            </div>
            <button 
              @click="playAudio(book)"
              class="p-2 rounded-full hover:bg-white/50 transition-colors shrink-0"
              :style="{ color: themeAccent }"
            >
              <svg v-if="playingBookId !== book.bookId" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div class="p-3 bg-white border-t border-gray-100">
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="(word, idx) in book.words" 
                :key="idx"
                class="text-sm px-3 py-1 rounded-full bg-green-50 text-green-700"
              >
                {{ word }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-8 text-gray-400">
        <span class="text-4xl mb-2 block">📚</span>
        <p class="text-sm">还没有记录单词</p>
        <p class="text-xs mt-1">完成绘本学习后将自动记录</p>
      </div>
    </div>
    
    <!-- 学习统计卡片 -->
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 text-center">
        <div class="text-3xl mb-1" :style="{ color: themeAccent }">{{ completedCount }}</div>
        <div class="text-xs text-gray-600">已完成绘本</div>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 text-center">
        <div class="text-3xl mb-1" :style="{ color: themeAccent }">{{ formatTime(totalStudyTime) }}</div>
        <div class="text-xs text-gray-600">累计学习(分钟)</div>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 text-center">
        <div class="text-3xl mb-1" :style="{ color: themeAccent }">{{ streakDays }}</div>
        <div class="text-xs text-gray-600">连续学习(天)</div>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 text-center">
        <div class="text-3xl mb-1" :style="{ color: themeAccent }">{{ weeklyStudyCount }}</div>
        <div class="text-xs text-gray-600">本周学习(次)</div>
      </div>
    </div>

    <!-- 成就徽章 -->
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <span>🏆</span>
        <span>成就徽章</span>
        <span class="text-xs px-2 py-0.5 rounded-full text-white" :style="{ background: themeAccent }">{{ rewardStore.completedCount }}</span>
        <button @click="showHelpModal = true" class="help-btn" title="徽章等级说明">?</button>
      </h3>

      <!-- 进度条 -->
      <div class="mb-4">
        <div class="flex justify-between text-sm mb-1">
          <span class="text-gray-600">距离下一个徽章 ({{ rewardStore.nextRewardProgress.nextName || '新徽章' }})</span>
          <span :style="{ color: themeAccent }">{{ rewardStore.nextRewardProgress.booksUntilNext }} 本</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :style="{ width: rewardStore.nextRewardProgress.percentage + '%', background: `linear-gradient(90deg, ${themeAccent}, ${adjustColor(themeAccent, -20)})` }"
          ></div>
        </div>
        <p class="text-xs text-gray-500 mt-1">已读 {{ rewardStore.totalBooksRead }} 本，再读 {{ rewardStore.nextRewardProgress.booksUntilNext }} 本解锁「{{ rewardStore.nextRewardProgress.nextName || '新徽章' }}」</p>
      </div>

      <!-- 徽章网格 -->
      <div class="flex flex-wrap justify-center gap-3">
        <RewardBadge
          v-for="reward in rewardStore.rewardsByMilestone"
          :key="reward.id"
          :id="reward.id"
          :icon="reward.icon"
          :milestone="reward.milestone"
          :name="reward.name"
          :description="reward.desc"
          :unlocked="reward.unlocked"
          :unlocked-at="reward.unlockedAt"
          :active="selectedBadge === reward.id"
          :is-cycle="reward.isCycle || false"
          :count="reward.count || 1"
          :bg="reward.bg"
          :border="reward.border"
          :glow="reward.glow"
          :level="reward.level"
          @select="selectBadge"
        />
      </div>
    </div>
    
    <!-- RAZ进度 -->
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <span>📖</span>
        <span>RAZ学习进度</span>
      </h3>
      <div class="text-2xl font-bold mb-2" :style="{ color: themeAccent }">
        {{ completedByType.raz }} / {{ totalRazBooks }} 本
      </div>
      <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          class="h-full rounded-full transition-all duration-500"
          :style="{ width: razProgress + '%', background: `linear-gradient(90deg, ${themeAccent}, ${adjustColor(themeAccent, -20)})` }"
        ></div>
      </div>
    </div>
    
    <!-- 牛津树进度 -->
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <span>🌳</span>
        <span>牛津树进度</span>
      </h3>
      <div class="text-2xl font-bold mb-2" :style="{ color: themeAccent }">
        {{ completedByType.oxford }} / {{ totalOxfordBooks }} 本
      </div>
      <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          class="h-full rounded-full transition-all duration-500"
          :style="{ width: oxfordProgress + '%', background: `linear-gradient(90deg, ${themeAccent}, ${adjustColor(themeAccent, -20)})` }"
        ></div>
      </div>
    </div>
    
    <!-- 最近学习 -->
    <div v-if="recentHistory.length > 0" class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <span>📚</span>
        <span>最近学习</span>
      </h3>
      <div class="space-y-3">
        <div 
          v-for="(item, index) in recentHistory" 
          :key="index"
          class="flex items-center justify-between p-3 rounded-xl bg-gray-50"
        >
          <div class="flex items-center gap-3">
            <span class="text-xl">{{ item.type === 'raz' ? '📖' : '🌳' }}</span>
            <div>
              <div class="text-sm font-medium text-gray-800">{{ item.title }}</div>
              <div class="text-xs text-gray-500">{{ formatDateTime(item.timestamp) }}</div>
            </div>
          </div>
          <span class="text-xs" :style="{ color: themeAccent }">{{ item.duration }}分钟</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 帮助弹窗 -->
  <Teleport to="body">
    <div v-if="showHelpModal" class="help-overlay" @click="showHelpModal = false">
      <div class="help-modal" @click.stop>
        <button class="help-close" @click="showHelpModal = false">✕</button>
        
        <div class="help-header">
          <span class="help-icon">🏆</span>
          <h2 class="help-title">勋章等级体系</h2>
        </div>
        
        <div class="help-content">
          <p class="help-desc">读完绘本即可解锁相应勋章，级别越高越奢华！</p>
          
          <div class="level-list">
            <div class="level-item legend">
              <div class="level-icon">👑💎🌟</div>
              <div class="level-info">
                <div class="level-name">传奇 <span class="level-tag">最高</span></div>
                <div class="level-requirement">读完 1000 本绘本</div>
                <div class="level-desc">至高无上的荣誉，金光闪耀</div>
              </div>
            </div>
            
            <div class="level-item platinum">
              <div class="level-icon">🎓💎</div>
              <div class="level-info">
                <div class="level-name">铂金 <span class="level-tag">稀有</span></div>
                <div class="level-requirement">读完 500 本绘本</div>
                <div class="level-desc">璀璨夺目的铂金荣誉</div>
              </div>
            </div>
            
            <div class="level-item gold">
              <div class="level-icon">🏆📜✨</div>
              <div class="level-info">
                <div class="level-name">金牌</div>
                <div class="level-requirement">读完 100-300 本绘本</div>
                <div class="level-desc">耀眼的金色荣耀</div>
              </div>
            </div>
            
            <div class="level-item silver">
              <div class="level-icon">📚🔦</div>
              <div class="level-info">
                <div class="level-name">银牌</div>
                <div class="level-requirement">读完 10-50 本绘本</div>
                <div class="level-desc">闪耀的银蓝光芒</div>
              </div>
            </div>
            
            <div class="level-item bronze">
              <div class="level-icon">🎯🌱</div>
              <div class="level-info">
                <div class="level-name">铜牌</div>
                <div class="level-requirement">读完 0-5 本绘本</div>
                <div class="level-desc">学习之旅的开始</div>
              </div>
            </div>
          </div>
          
          <div class="cycle-section">
            <h4 class="cycle-title">🌟 学习之星循环勋章</h4>
            <p class="cycle-desc">每读完 10 本绘本，可获得一颗「学习之星」⭐</p>
            <ul class="cycle-list">
              <li>⭐ 学习之星 (10-99本)</li>
              <li>🌟✨ 闪亮学习之星 (100-249本)</li>
              <li>🌟✨💎 超级学霸 (250-499本)</li>
              <li>🌠💫✨ 超级学圣 (500+本)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useBookStore } from '../stores/bookStore.js'
import { useThemeStore } from '../stores/themeStore.js'
import { useRewardStore } from '../stores/rewardStore.js'
import RewardBadge from '../components/RewardBadge.vue'
import bookService from '../services/bookService.js'
import oxfordService from '../services/oxfordService.js'

const bookStore = useBookStore()
const themeStore = useThemeStore()
const rewardStore = useRewardStore()

const selectedBadge = ref(null)

const selectBadge = (id) => {
  if (selectedBadge.value === id) {
    selectedBadge.value = null
  } else {
    selectedBadge.value = id
  }
}

const showHelpModal = ref(false)

const themeAccent = computed(() => themeStore.themeData.accent || '#f472b6')

const playingBookId = ref(null)
let audioElement = null

// 搜索关键词
const searchQuery = ref('')

// 获取所有绘本（倒序）
const allLearnedBooks = computed(() => {
  return [...bookStore.learnedWordsByBook].sort((a, b) => 
    new Date(b.learnedAt) - new Date(a.learnedAt)
  )
})

// 过滤后的绘本列表
const filteredBooks = computed(() => {
  let books = allLearnedBooks.value
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    books = books.filter(book => 
      book.title.toLowerCase().includes(query) ||
      book.words.some(word => word.toLowerCase().includes(query))
    )
  }
  
  return books
})

// 获取音频URL
const getAudioUrl = (book) => {
  if (book.type !== 'raz') return null
  
  const fileName = book.title
  const encodedFileName = encodeURIComponent(fileName)
  
  return `/myBooks/raz/${book.level.toLowerCase()}/audio/${encodedFileName}.mp3`
}

// 播放音频
const playAudio = (book) => {
  const audioUrl = getAudioUrl(book)
  
  if (!audioUrl) {
    alert('该绘本暂无音频')
    return
  }
  
  // 如果点击的是正在播放的绘本，则停止
  if (playingBookId.value === book.bookId) {
    if (audioElement) {
      audioElement.pause()
      audioElement = null
    }
    playingBookId.value = null
    return
  }
  
  // 停止当前播放
  if (audioElement) {
    audioElement.pause()
    audioElement = null
  }
  
  playingBookId.value = book.bookId
  
  audioElement = new Audio(audioUrl)
  
  audioElement.onended = () => {
    playingBookId.value = null
  }
  
  audioElement.onerror = () => {
    alert('音频加载失败')
    playingBookId.value = null
  }
  
  audioElement.play().catch(() => {
    alert('播放失败')
    playingBookId.value = null
  })
}

const adjustColor = (hex, percent) => {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.min(255, Math.max(0, (num >> 16) + amt))
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt))
  const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt))
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}

const completedCount = computed(() => bookStore.completedCount)
const totalStudyTime = computed(() => bookStore.totalStudyTime)
const streakDays = computed(() => bookStore.streakDays)
const weeklyStudyCount = computed(() => bookStore.weeklyStudyCount)
const completedByType = computed(() => {
  const stats = bookStore.completedByType
  console.log('completedByType:', stats)
  return stats
})
const learnedWordsCount = computed(() => bookStore.learnedWordsCount)
const learnedWordsByBook = computed(() => bookStore.learnedWordsByBook)
const learnedBooksCount = computed(() => bookStore.learnedWordsByBook.length)

// 最近5条学习记录（按时间倒序）
const recentHistory = computed(() => {
  return [...bookStore.studyHistory]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5)
})

// RAZ总进度
const totalRazBooks = computed(() => bookService.getAllBooks('raz').length)
const razProgress = computed(() => {
  const completed = completedByType.value.raz
  const total = totalRazBooks.value
  return total > 0 ? Math.round((completed / total) * 100) : 0
})

// 牛津树总进度
const totalOxfordBooks = computed(() => oxfordService.getAllBooks('oxford').length)
const oxfordProgress = computed(() => {
  const completed = completedByType.value.oxford
  const total = totalOxfordBooks.value
  return total > 0 ? Math.round((completed / total) * 100) : 0
})

const formatTime = (minutes) => {
  if (minutes < 60) return minutes.toString()
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h${mins}m` : `${hours}h`
}

// 格式化时间：几月几日几时几分几秒
const formatDateTime = (timestamp) => {
  const date = new Date(timestamp)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${month}月${day}日 ${hours}:${minutes}:${seconds}`
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`
  
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.help-btn {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
  color: white;
  border: none;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.help-btn:hover {
  transform: scale(1.1);
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
}

.help-overlay {
  position: fixed;
  inset: 0;
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

.help-modal {
  background: linear-gradient(135deg, #fff 0%, #f8fafc 100%);
  border-radius: 24px;
  padding: 28px;
  max-width: 380px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(30px) scale(0.95); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

.help-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f1f5f9;
  border: none;
  color: #64748b;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.help-close:hover {
  background: #e2e8f0;
  color: #334155;
}

.help-header {
  text-align: center;
  margin-bottom: 20px;
}

.help-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 8px;
}

.help-title {
  font-size: 22px;
  font-weight: bold;
  color: #1e293b;
  margin: 0;
}

.help-desc {
  text-align: center;
  color: #64748b;
  font-size: 14px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.level-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.level-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
}

.level-item.legend {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%);
}

.level-item.platinum {
  background: linear-gradient(135deg, #f5f3ff 0%, #ddd6fe 100%);
}

.level-item.gold {
  background: linear-gradient(135deg, #fef9c3 0%, #fde047 100%);
}

.level-item.silver {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
}

.level-item.bronze {
  background: linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%);
}

.level-icon {
  font-size: 32px;
  min-width: 50px;
  text-align: center;
}

.level-info {
  flex: 1;
}

.level-name {
  font-size: 16px;
  font-weight: bold;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.level-tag {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 8px;
  background: #ef4444;
  color: white;
}

.level-item.legend .level-tag {
  background: #dc2626;
}

.level-item.platinum .level-tag {
  background: #8b5cf6;
}

.level-requirement {
  font-size: 12px;
  color: #64748b;
  margin: 4px 0;
}

.level-desc {
  font-size: 11px;
  color: #94a3b8;
}

.cycle-section {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.cycle-title {
  font-size: 16px;
  font-weight: bold;
  color: #1e293b;
  margin: 0 0 8px 0;
  text-align: center;
}

.cycle-desc {
  font-size: 13px;
  color: #64748b;
  text-align: center;
  margin-bottom: 12px;
}

.cycle-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.cycle-list li {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  background: #f1f5f9;
  color: #475569;
}
</style>
