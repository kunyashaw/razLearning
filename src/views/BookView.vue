<template>
  <div class="space-y-6">
    <div class="flex items-center">
      <router-link :to="bookType === 'raz' ? '/raz' : '/oxford'" class="mr-4 text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2">
        <span>←</span>
        <span>返回</span>
      </router-link>
    </div>
    
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <span>📚</span>
        <span>资源选择</span>
      </h3>
      <div class="flex flex-row gap-2 overflow-x-auto">
        <button 
          v-for="resource in book.resources" 
          :key="resource.type"
          @click="selectResource(resource.type)"
          class="flex-shrink-0 px-3 py-2 border-2 border-gray-200 rounded-lg hover:border-[var(--theme-accent)] transition-all flex items-center gap-2"
          :style="{ '--theme-accent': themeAccent, borderColor: selectedResource === resource.type ? themeAccent : undefined, background: selectedResource === resource.type ? `${themeAcccent}15` : 'transparent' }"
        >
          <span class="text-xl">{{ resource.icon }}</span>
          <span class="text-xs font-medium text-gray-800 whitespace-nowrap">{{ resource.name }}</span>
        </button>
      </div>
    </div>

    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <span>📖</span>
        <span>学习内容</span>
      </h3>
      
      <!-- PDF 查看器 -->
      <div v-if="selectedResource === 'pdf'">
        <PDFViewer 
          :pdf-url="book.pdfUrl" 
          :theme-accent="themeAccent"
          :audio-url="book.audioUrl"
          :book-content="book.bookContent"
          :book-title="book.title"
        />
      </div>
      
      <!-- 视频播放器 -->
      <div v-else-if="selectedResource === 'video'" class="bg-gray-50 rounded-xl p-4">
        <div class="flex justify-between items-center mb-4">
          <h4 class="text-sm font-medium text-gray-700">视频播放器</h4>
          <a 
            :href="selectedVideoUrl" 
            target="_blank" 
            rel="noopener noreferrer"
            class="px-3 py-1 text-xs rounded-lg transition-colors whitespace-nowrap"
            :style="{ background: `${themeAccent}20`, color: themeAccent }"
          >
            在新窗口打开
          </a>
        </div>
        <div v-if="book.videos.length > 1" class="mb-4">
          <h4 class="text-sm font-medium text-gray-700 mb-2">选择视频</h4>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="(video, index) in book.videos" 
              :key="index"
              @click="selectVideo(index)"
              class="px-3 py-1 text-xs rounded-full transition-colors"
              :style="selectedVideoIndex === index ? { background: themeAccent, color: 'white' } : { background: '#f3f4f6', color: '#374151' }"
            >
              {{ video.name }}
            </button>
          </div>
        </div>
        <div class="flex justify-center">
          <video 
            ref="videoPlayer"
            :src="selectedVideoUrl" 
            class="w-full max-w-2xl border border-gray-200 rounded-lg"
            controls
            autoplay
          ></video>
        </div>
      </div>
      
      <!-- 音频播放器 -->
      <div v-else-if="selectedResource === 'audio'" class="bg-gray-50 rounded-xl p-6">
        <div class="flex flex-col items-center">
          <!-- 播放/暂停大按钮 -->
          <button 
            @click="toggleAudio"
            class="w-20 h-20 rounded-full shadow-lg flex items-center justify-center mb-4 transition-all transform active:scale-95"
            :style="{ background: `linear-gradient(135deg, ${themeAccent}, ${adjustColor(themeAccent, -20)})` }"
          >
            <span class="text-4xl text-white">{{ isPlaying ? '⏸' : '▶️' }}</span>
          </button>
          
          <!-- 播放状态 -->
          <p class="text-sm font-medium mb-4" :style="{ color: themeAccent }">
            {{ isPlaying ? '正在播放音频...' : '点击播放音频' }}
          </p>
          
          <!-- 进度条 -->
          <div class="w-full max-w-md mb-2">
            <input 
              type="range" 
              :value="audioCurrentTime" 
              :max="audioDuration || 100"
              @input="seekAudio($event.target.value)"
              class="w-full h-2 rounded-lg appearance-none cursor-pointer"
              :style="{ 
                background: `linear-gradient(to right, ${themeAccent} 0%, ${themeAccent} ${(audioCurrentTime / (audioDuration || 1)) * 100}%, #e5e7eb ${(audioCurrentTime / (audioDuration || 1)) * 100}%, #e5e7eb 100%)`
              }"
            >
          </div>
          
          <!-- 时间显示 -->
          <div class="flex justify-between w-full max-w-md text-xs text-gray-500">
            <span>{{ formatTime(audioCurrentTime) }}</span>
            <span>{{ formatTime(audioDuration) }}</span>
          </div>
          
          <!-- 隐藏的 audio 元素 -->
          <audio 
            ref="audioPlayer"
            :src="book.audioUrl"
            @timeupdate="updateAudioProgress"
            @loadedmetadata="onAudioLoaded"
            @ended="onAudioEnded"
          ></audio>
        </div>
      </div>
    </div>
    
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      <div class="flex gap-3">
        <button 
          @click="markAsCompleted" 
          class="flex-1 py-3 rounded-xl font-medium transition-all"
          :style="{ background: book.completed ? '#22c55e20' : `${themeAccent}20`, color: book.completed ? '#22c55e' : themeAccent }"
        >
          {{ book.completed ? '✓ 已完成' : '标记为完成' }}
        </button>
        <button 
          v-if="nextBook"
          @click="goToNextBook"
          class="flex-1 py-3 rounded-xl font-medium transition-all text-white"
          :style="{ background: `linear-gradient(135deg, ${themeAccent}, ${adjustColor(themeAccent, -20)})` }"
        >
          下一本 →
        </button>
      </div>
    </div>
    
    <!-- 移动端提示 - PDF查看器建议 -->
    <div class="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
      <p class="flex items-center gap-2">
        <span>📱</span>
        <span>如果PDF无法显示，建议使用浏览器内置查看器</span>
      </p>
    </div>
    
    <!-- 搜索绘本弹窗 -->
    <Teleport to="body">
      <div v-if="showSearchModal" class="fixed inset-0 flex items-center justify-center z-50 bg-black/50" @click.self="closeSearchModal">
        <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 max-h-[80vh] flex flex-col">
          <div class="text-center mb-4">
            <div class="text-4xl mb-2">🔍</div>
            <h3 class="text-xl font-bold text-gray-800 mb-1">搜索绘本</h3>
            <p class="text-gray-600 text-sm">输入绘本名称快速跳转</p>
          </div>
          
          <!-- 搜索模式切换 -->
          <div class="flex gap-2 mb-4">
            <button 
              @click="searchMode = 'fuzzy'"
              class="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
              :style="{ 
                background: searchMode === 'fuzzy' ? `${themeAccent}20` : '#f3f4f6',
                color: searchMode === 'fuzzy' ? themeAccent : '#6b7280',
                border: searchMode === 'fuzzy' ? `2px solid ${themeAccent}` : '2px solid transparent'
              }"
            >
              🔤 模糊搜索
            </button>
            <button 
              @click="searchMode = 'exact'"
              class="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
              :style="{ 
                background: searchMode === 'exact' ? `${themeAccent}20` : '#f3f4f6',
                color: searchMode === 'exact' ? themeAccent : '#6b7280',
                border: searchMode === 'exact' ? `2px solid ${themeAccent}` : '2px solid transparent'
              }"
            >
              🔍 精确搜索
            </button>
          </div>
          
          <!-- 搜索输入框 -->
          <div class="mb-4">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="输入绘本名称..."
              class="w-full px-4 py-3 rounded-xl bg-gray-100 border-2 border-transparent focus:border-gray-300 outline-none"
              @input="searchBooks"
            />
          </div>
          
          <!-- 搜索结果列表 -->
          <div class="flex-1 overflow-y-auto">
            <div v-if="searchResults.length === 0 && searchQuery.trim()" class="text-center text-gray-400 py-4">
              未找到匹配的绘本
            </div>
            <div v-else-if="!searchQuery.trim()" class="text-center text-gray-400 py-4">
              请输入绘本名称进行搜索
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="result in searchResults"
                :key="result.id"
                @click="goToBook(result)"
                class="p-4 rounded-xl cursor-pointer transition-all border-2 relative"
                :class="selectedBook?.id === result.id 
                  ? 'bg-blue-100 border-blue-500 shadow-md ring-2 ring-blue-300' 
                  : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'"
              >
                <!-- 选中标记 -->
                <div v-if="selectedBook?.id === result.id" class="absolute top-2 right-2">
                  <span class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">已选择</span>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-2xl" :class="selectedBook?.id === result.id ? 'grayscale-0' : 'grayscale'">📚</span>
                  <div class="flex-1">
                    <div class="font-bold" :class="selectedBook?.id === result.id ? 'text-blue-800 text-lg' : 'text-gray-800'">{{ result.title }}</div>
                    <div class="text-sm" :class="selectedBook?.id === result.id ? 'text-blue-600 font-medium' : 'text-gray-500'">{{ bookType === 'raz' ? 'RAZ ' + result.level : '牛津树 ' + result.level }}</div>
                  </div>
                  <span v-if="result.completed" class="text-green-500 text-sm font-bold bg-green-100 px-2 py-1 rounded">✓ 已完成</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex gap-3 mt-4 pt-4 border-t">
            <button 
              @click="closeSearchModal"
              class="flex-1 py-3 rounded-xl font-medium transition-all bg-gray-100 text-gray-600"
            >
              取消
            </button>
            <button 
              v-if="selectedBook"
              @click="goToSelectedBook"
              class="flex-1 py-3 rounded-xl font-medium transition-all text-white"
              :style="{ background: `linear-gradient(135deg, ${themeAccent}, ${adjustColor(themeAccent, -20)})` }"
            >
              前往绘本
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 奖励庆祝弹窗 -->
    <RewardCelebration
      :visible="showRewardCelebration"
      :reward-type="unlockedReward?.type || 'trophy'"
      :milestone="unlockedReward?.milestone || 5"
      :books-read="unlockedReward?.booksRead || 0"
      :theme-color="themeAccent"
      @close="showRewardCelebration = false"
    />

    <!-- 下一本确认弹窗 -->
    <Teleport to="body">
      <div v-if="showNextBookModal" class="fixed inset-0 flex items-center justify-center z-50 bg-black/50" @click.self="cancelNextBook">
        <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 text-center animate-bounce-in">
          <div class="text-4xl mb-3">📚</div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">即将跳转下一本</h3>
          <p class="text-gray-600 mb-4">正在为您准备：</p>
          <div class="bg-gray-50 rounded-xl p-4 mb-4">
            <div class="font-bold text-lg" :style="{ color: themeAccent }">{{ nextBook?.title }}</div>
            <div class="text-gray-500 text-sm mt-1">{{ bookType === 'raz' ? 'RAZ ' + nextBook?.level : '牛津树 ' + nextBook?.level }}</div>
          </div>
          <div class="text-3xl font-bold mb-4" :style="{ color: themeAccent }">{{ nextBookCountdown }}s</div>
          <div class="flex gap-3">
            <button 
              @click="cancelNextBook"
              class="flex-1 py-3 rounded-xl font-medium transition-all bg-gray-100 text-gray-600"
            >
              取消
            </button>
            <button 
              @click="navigateToNextBook"
              class="flex-1 py-3 rounded-xl font-medium transition-all text-white"
              :style="{ background: `linear-gradient(135deg, ${themeAccent}, ${adjustColor(themeAccent, -20)})` }"
            >
              立即跳转
            </button>
          </div>
        </div>
      </div>
    </Teleport>
    <!-- 完成确认弹窗 -->
    <Teleport to="body">
      <div v-if="showCompleteConfirmModal" class="fixed inset-0 flex items-center justify-center z-50 bg-black/50" @click.self="cancelCompleteConfirm">
        <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 text-center animate-bounce-in">
          <div class="text-4xl mb-3">📚</div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">确认完成</h3>
          <p class="text-gray-600">是否将《{{ book.title }}》加入已掌握列表？</p>
          <div class="flex flex-col gap-3 mt-4">
            <button 
              @click="confirmComplete"
              class="w-full py-3 rounded-xl font-medium transition-all text-white"
              :style="{ background: `linear-gradient(135deg, ${themeAccent}, ${adjustColor(themeAccent, -20)})` }"
            >
              确认完成
            </button>
            <button 
              @click="searchOtherBooks"
              class="w-full py-3 rounded-xl font-medium transition-all bg-blue-500 text-white"
            >
              确认并搜索其他绘本
            </button>
            <button 
              @click="cancelCompleteConfirm"
              class="w-full py-3 rounded-xl font-medium transition-all bg-gray-100 text-gray-600"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import bookService from '../services/bookService.js'
import oxfordService from '../services/oxfordService.js'
import wordService from '../services/wordService.js'
import { useBookStore } from '../stores/bookStore.js'
import { useThemeStore } from '../stores/themeStore.js'
import { useRewardStore } from '../stores/rewardStore.js'
import RewardCelebration from '../components/RewardCelebration.vue'
import PDFViewer from '../components/PDFViewer.vue'

const route = useRoute()
const router = useRouter()
const bookStore = useBookStore()
const themeStore = useThemeStore()
const rewardStore = useRewardStore()

const themeAcccent = computed(() => themeStore.themeData.accent || '#f472b6')
const themeAccent = computed(() => themeStore.themeData.accent || '#f472b6')

const adjustColor = (hex, percent) => {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.min(255, Math.max(0, (num >> 16) + amt))
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt))
  const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt))
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}

const bookType = computed(() => route.query.type || 'raz')

const selectedResource = ref('pdf')
const selectedVideoIndex = ref(0)
const videoPlayer = ref(null)
const audioPlayer = ref(null)
const isPlaying = ref(false)
const audioCurrentTime = ref(0)
const audioDuration = ref(0)
const studyProgress = ref(0)
const showReward = ref(false)
const showNextBookModal = ref(false)
const showSearchModal = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const selectedBook = ref(null)
const searchMode = ref('fuzzy')
const showRewardCelebration = ref(false)
const unlockedReward = ref(null)
const rewardTypes = ['trophy', 'shield', 'star', 'fire', 'certificate']
const nextBookCountdown = ref(3)
const nextBookTimer = ref(null)
const showCompleteConfirmModal = ref(false)
const completeConfirmCountdown = ref(5)
const completeConfirmTimer = ref(null)

const book = ref({
  id: null,
  title: '加载中...',
  completed: false,
  resources: [],
  pdfUrl: '',
  videos: [],
  audioUrl: '',
  originalFileName: '',
  bookContent: ''
})

const selectedVideoUrl = computed(() => {
  return book.value.videos[selectedVideoIndex.value]?.url || ''
})

const allBooks = computed(() => {
  return bookType.value === 'raz' 
    ? bookService.getAllBooks('raz')
    : oxfordService.getAllBooks('oxford')
})

const currentBookIndex = computed(() => {
  // 首先尝试用ID匹配（转换为字符串比较）
  if (book.value.id) {
    const bookIdStr = String(book.value.id)
    const indexById = allBooks.value.findIndex(b => String(b.id) === bookIdStr)
    if (indexById !== -1) return indexById
  }
  // 其次尝试用标题匹配
  return allBooks.value.findIndex(b => b.title === book.value.originalFileName || b.title === book.value.title)
})

const nextBook = computed(() => {
  if (currentBookIndex.value === -1 || currentBookIndex.value >= allBooks.value.length - 1) {
    return null
  }
  return allBooks.value[currentBookIndex.value + 1]
})

const goToNextBook = () => {
  if (nextBook.value) {
    showNextBookModal.value = true
    nextBookCountdown.value = 3
    
    nextBookTimer.value = setInterval(() => {
      nextBookCountdown.value--
      if (nextBookCountdown.value <= 0) {
        clearInterval(nextBookTimer.value)
        navigateToNextBook()
      }
    }, 1000)
  }
}

const navigateToNextBook = () => {
  console.log('navigateToNextBook called, nextBook:', nextBook.value)
  // 停止倒计时
  if (nextBookTimer.value) {
    clearInterval(nextBookTimer.value)
    nextBookTimer.value = null
  }
  showNextBookModal.value = false
  if (nextBook.value) {
    const next = nextBook.value
    const type = bookType.value || 'raz'
    console.log('Navigating to next book:', { type, level: next.level, id: next.id?.toString() || next.title, title: next.title })
    
    // 保存到store
    bookStore.setCurrentBook(next)
    
    router.push({
      name: 'bookDetail',
      query: {
        type: type,
        level: next.level,
        id: next.id?.toString() || next.title,
        title: next.title
      }
    }).catch(err => {
      console.error('跳转下一本失败:', err)
    })
  } else {
    console.warn('没有下一本书')
  }
}

const cancelNextBook = () => {
  if (nextBookTimer.value) {
    clearInterval(nextBookTimer.value)
    nextBookTimer.value = null
  }
  showNextBookModal.value = false
}

const selectResource = (resourceType) => {
  selectedResource.value = resourceType
  studyProgress.value = Math.min(studyProgress.value + 25, 100)
  
  // 如果选择视频，尝试自动播放，同时停止音频
  if (resourceType === 'video') {
    if (audioPlayer.value && isPlaying.value) {
      audioPlayer.value.pause()
      isPlaying.value = false
    }
    setTimeout(() => {
      if (videoPlayer.value) {
        videoPlayer.value.play().catch(err => {
          console.log('自动播放被阻止:', err)
        })
      }
    }, 100)
  }
  
  // 如果切换到PDF，也停止音频
  if (resourceType === 'pdf' && audioPlayer.value && isPlaying.value) {
    audioPlayer.value.pause()
    isPlaying.value = false
  }
}

const selectVideo = (index) => {
  selectedVideoIndex.value = index
}

const toggleAudio = () => {
  if (!audioPlayer.value) return
  
  if (isPlaying.value) {
    audioPlayer.value.pause()
    isPlaying.value = false
  } else {
    audioPlayer.value.play().then(() => {
      isPlaying.value = true
    }).catch(err => {
      console.log('播放失败:', err)
    })
  }
}

const updateAudioProgress = () => {
  if (audioPlayer.value) {
    audioCurrentTime.value = audioPlayer.value.currentTime
  }
}

const onAudioLoaded = () => {
  if (audioPlayer.value) {
    audioDuration.value = audioPlayer.value.duration
  }
}

const onAudioEnded = () => {
  isPlaying.value = false
  audioCurrentTime.value = 0
}

const seekAudio = (value) => {
  if (audioPlayer.value) {
    audioPlayer.value.currentTime = parseFloat(value)
    audioCurrentTime.value = parseFloat(value)
  }
}

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const studyStartTime = ref(null)

const startStudySession = () => {
  studyStartTime.value = Date.now()
  bookStore.recordStudySession()
}

const markAsCompleted = () => {
  if (book.value.completed) return
  
  showCompleteConfirmModal.value = true
}

const cancelCompleteConfirm = () => {
  if (completeConfirmTimer.value) {
    clearInterval(completeConfirmTimer.value)
    completeConfirmTimer.value = null
  }
  showCompleteConfirmModal.value = false
}

const confirmComplete = () => {
  clearInterval(completeConfirmTimer.value)
  showCompleteConfirmModal.value = false
  doMarkAsCompleted()
}

const searchOtherBooks = () => {
  clearInterval(completeConfirmTimer.value)
  showCompleteConfirmModal.value = false
  doMarkAsCompleted()
  showSearchModal.value = true
  searchQuery.value = ''
  searchResults.value = []
  selectedBook.value = null
}

const doMarkAsCompleted = () => {
  book.value.completed = true
  studyProgress.value = 100
  showReward.value = true
  
  // 记录真实学习数据
  const studyDuration = studyStartTime.value 
    ? Math.max(1, Math.round((Date.now() - studyStartTime.value) / 60000))
    : 5 // 默认5分钟
  
  // 标记绘本完成
  bookStore.markBookCompleted({
    id: route.query.id,
    title: book.value.title,
    type: bookType.value,
    level: route.query.level
  })

  // 检查是否解锁新奖励
  const newReward = rewardStore.addBooksRead(1)
  if (newReward && newReward.milestone !== undefined) {
    const milestoneNum = newReward.milestone
    const rewardIndex = Math.floor((milestoneNum / 5) % 5)
    unlockedReward.value = {
      type: rewardTypes[rewardIndex] || 'trophy',
      milestone: milestoneNum,
      booksRead: rewardStore.totalBooksRead
    }
    showRewardCelebration.value = true
  }
  
  // 加载并保存单词数据
  const loadAndSaveWords = async () => {
    // 牛津树没有单词数据，跳过
    if (bookType.value === 'oxford') {
      return
    }
    
    const bookData = {
      id: route.query.id,
      title: book.value.title,
      type: bookType.value,
      level: route.query.level
    }
    
    // 如果已经记录过则跳过
    if (bookStore.hasLearnedWords(bookData.id)) {
      return
    }
    
    // 从腾讯云加载单词
    const wordsData = await wordService.findWordsByTitle(bookData.title, bookData.type)
    
    if (wordsData && wordsData.words && wordsData.words.length > 0) {
      bookStore.addLearnedWords(bookData, wordsData.words)
      console.log(`已保存绘本 "${bookData.title}" 的 ${wordsData.words.length} 个单词`)
    }
  }
  
  // 调用加载单词
  loadAndSaveWords()
  
  // 记录学习时长
  bookStore.recordStudyTime(studyDuration)
  
  // 添加到学习历史
  bookStore.addStudyHistory({
    title: book.value.title,
    type: bookType.value,
    level: route.query.level
  }, studyDuration)
}

const closeReward = () => {
  showReward.value = false
}

const closeNextBookModal = () => {
  showNextBookModal.value = false
}

const closeSearchModal = () => {
  showSearchModal.value = false
  searchQuery.value = ''
  searchResults.value = []
  selectedBook.value = null
}

const closeRewardCelebration = () => {
  showRewardCelebration.value = false
  unlockedReward.value = null
}

// 搜索绘本
const searchBooks = () => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) {
    searchResults.value = []
    selectedBook.value = null
    return
  }
  
  searchResults.value = allBooks.value.filter(book => {
    const title = book.title.toLowerCase()
    const cleanTitle = title.replace(/^\d+[_\s]*/, '')
    const cleanQuery = query.replace(/^\d+[_\s]*/, '')
    
    if (searchMode.value === 'exact') {
      return title === query || cleanTitle === cleanQuery
    } else {
      return title.includes(query) ||
             cleanTitle.includes(cleanQuery) ||
             (book.tags && book.tags.some(tag => tag.toLowerCase().includes(query)))
    }
  }).slice(0, 10) // 最多显示10个结果
  
  // 自动选择第一个结果
  if (searchResults.value.length > 0) {
    selectedBook.value = searchResults.value[0]
  } else {
    selectedBook.value = null
  }
}

// 选择绘本
const goToBook = (book) => {
  console.log('选择绘本:', book.title, 'ID:', book.id)
  selectedBook.value = book
}

// 跳转到选中的绘本
const goToSelectedBook = () => {
  if (selectedBook.value) {
    const book = selectedBook.value
    console.log('跳转绘本:', {
      title: book.title,
      id: book.id,
      idType: typeof book.id,
      level: book.level
    })
    
    const type = bookType.value || 'raz'
    
    // 确保使用正确的ID
    const bookId = book.id !== undefined && book.id !== null 
      ? book.id.toString() 
      : book.title
    
    console.log('跳转参数:', { type, level: book.level, id: bookId, title: book.title })
    
    // 保存到store
    bookStore.setCurrentBook(book)
    
    router.push({
      name: 'bookDetail',
      query: {
        type: type,
        level: book.level,
        id: bookId,
        title: book.title
      }
    }).then(() => {
      showSearchModal.value = false
      searchQuery.value = ''
      searchResults.value = []
      selectedBook.value = null
    }).catch(err => {
      console.error('跳转失败:', err)
      showSearchModal.value = false
    })
  } else {
    console.warn('没有选中的绘本')
  }
}

const safeEncode = (str) => {
  return encodeURIComponent(str)
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\*/g, '%2A')
    .replace(/~/g, '%7E')
    .replace(/,/g, '%2C')
    .replace(/:/g, '%3A')
    .replace(/;/g, '%3B')
    .replace(/#/g, '%23')
}

const loadBookData = () => {
  try {
    // 直接从 route.query 读取最新的参数
    const currentQuery = route.query
    const currentType = currentQuery.type || 'raz'
    const currentLevel = currentQuery.level
    const currentId = currentQuery.id
    const currentTitle = currentQuery.title
    
    console.log('Loading book data:', { type: currentType, level: currentLevel, id: currentId, title: currentTitle })
    
    let targetBook = null
    const storeBook = bookStore.getCurrentBook()
    
    if (storeBook && storeBook.level === currentLevel) {
      targetBook = storeBook
    } else {
      const books = allBooks.value
      targetBook = books.find(b => b.id.toString() === currentId?.toString())
      if (!targetBook) {
        targetBook = books.find(b => b.title === currentId?.toString())
      }
      if (!targetBook) {
        targetBook = books.find(b => b.title.includes(currentId?.toString()))
      }
    }
    
    if (targetBook) {
      let pdfUrl = ''
      let videos = []
      let audioUrl = ''
      
      if (bookType.value === 'raz') {
        const fileName = targetBook.name
        const levelFolder = (targetBook.level || currentLevel || '').toLowerCase()
        // 逗号不编码，保持原样
        const safeFileName = fileName.replace(/,/g, ',')
        // 使用本地路径，部署时上传myBooks目录到服务器根目录
        pdfUrl = `/myBooks/raz/${levelFolder}/pdf/${safeFileName}.pdf`
        videos = [{ name: `${targetBook.title} - 原版视频`, url: `/myBooks/raz/${levelFolder}/video/${safeFileName}.mp4` }]
        audioUrl = `/myBooks/raz/${levelFolder}/audio/${safeFileName}.mp3`
      } else if (bookType.value === 'oxford') {
        // 使用本地路径，部署时上传牛津树资源到服务器
        pdfUrl = targetBook.pdf ? `/${targetBook.pdf.relativePath}` : ''
        videos = []
        if (targetBook.videos && targetBook.videos.earTraining) {
          targetBook.videos.earTraining.forEach((video, index) => {
            videos.push({ name: `${targetBook.title} - 磨耳朵视频${index > 0 ? ` (${index + 1})` : ''}`, url: `/${video.relativePath}` })
          })
        }
        if (targetBook.videos && targetBook.videos.bilingual) {
          targetBook.videos.bilingual.forEach((video, index) => {
            videos.push({ name: `${targetBook.title} - 双语讲解${index > 0 ? ` (${index + 1})` : ''}`, url: `/${video.relativePath}` })
          })
        }
        if (targetBook.audios && targetBook.audios.earTraining && targetBook.audios.earTraining.length > 0) {
          audioUrl = `/${targetBook.audios.earTraining[0].relativePath}`
        } else if (targetBook.audios && targetBook.audios.bilingual && targetBook.audios.bilingual.length > 0) {
          audioUrl = `/${targetBook.audios.bilingual[0].relativePath}`
        }
      }
      
      book.value = {
        id: targetBook.id,
        title: targetBook.title,
        completed: targetBook.completed,
        resources: [
          { type: 'pdf', name: 'PDF 绘本', icon: '📄' },
          { type: 'video', name: '视频学习', icon: '🎬' },
          { type: 'audio', name: '音频朗读', icon: '🎧' }
        ],
        pdfUrl,
        videos,
        audioUrl,
        originalFileName: targetBook.title
      }
      console.log('Successfully loaded book:', book.value.title)
      
      // 保存为上次阅读的绘本
      bookStore.setLastReadBook({
        id: targetBook.id,
        title: targetBook.title,
        level: targetBook.level,
        type: bookType.value
      })
    } else {
      console.error('Book not found:', { type: bookType.value, level: currentLevel, id: currentId })
      book.value = {
        id: null,
        title: '书籍未找到',
        completed: false,
        resources: [],
        pdfUrl: '',
        videos: [],
        audioUrl: '',
        originalFileName: `Level ${currentLevel}, ID ${currentId}`
      }
    }
  } catch (error) {
    console.error('加载书籍数据失败:', error)
    book.value = {
      id: null,
      title: '加载失败',
      completed: false,
      resources: [],
      pdfUrl: '',
      videos: [],
      audioUrl: '',
      originalFileName: `Error: ${error.message}`
    }
  }
}

onMounted(() => {
  loadBookData()
  startStudySession()
})

// 监听路由变化，当query参数改变时重新加载数据
watch(() => route.query, (newQuery, oldQuery) => {
  if (newQuery.id !== oldQuery?.id || newQuery.level !== oldQuery?.level) {
    console.log('Route query changed, reloading book data:', newQuery)
    loadBookData()
    startStudySession()
  }
}, { deep: true })

// 搜索模式改变时重新搜索
watch(searchMode, () => {
  if (searchQuery.value.trim()) {
    searchBooks()
  }
})
</script>

<style scoped>
@keyframes bounce-in {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}
.animate-bounce-in {
  animation: bounce-in 0.3s ease-out;
}
</style>
