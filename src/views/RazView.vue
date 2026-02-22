<template>
  <div class="space-y-6">
    <h2 
      class="text-2xl font-bold text-gray-800 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
      @click="showRazInfo = true"
    >
      <span>📖</span>
      <span>RAZ分级阅读</span>
    </h2>

    <!-- RAZ级别介绍弹窗 -->
    <div v-if="showRazInfo" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="showRazInfo = false">
      <div class="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span>📖</span>
              <span>RAZ分级阅读介绍</span>
            </h3>
            <button @click="showRazInfo = false" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>
          <div class="space-y-3 text-sm">
            <div class="p-3 rounded-xl bg-pink-50">
              <strong class="text-pink-600">AA级：</strong>
              <span class="text-gray-600">启蒙入门，每页1-3个单词，零基础必学</span>
            </div>
            <div class="p-3 rounded-xl bg-pink-50">
              <strong class="text-pink-600">A级：</strong>
              <span class="text-gray-600">入门阶段，每页2-5个单词，开始简单句式</span>
            </div>
            <div class="p-3 rounded-xl bg-pink-50">
              <strong class="text-pink-600">B-C级：</strong>
              <span class="text-gray-600">简单句子，每页5-10个单词，基础阅读入门</span>
            </div>
            <div class="p-3 rounded-xl bg-pink-50">
              <strong class="text-pink-600">D-F级：</strong>
              <span class="text-gray-600">简短段落，每页10-20个单词，可以独立阅读</span>
            </div>
            <div class="p-3 rounded-xl bg-pink-50">
              <strong class="text-pink-600">G-I级：</strong>
              <span class="text-gray-600">中等难度，每页20-40个单词，接近初章书</span>
            </div>
            <div class="p-3 rounded-xl bg-pink-50">
              <strong class="text-pink-600">J-M级：</strong>
              <span class="text-gray-600">桥梁书阶段，每本约40-60页，开始阅读章节书</span>
            </div>
            <div class="p-3 rounded-xl bg-pink-50">
              <strong class="text-pink-600">N-P级：</strong>
              <span class="text-gray-600">初级章节书，每本约50-80页，词汇量约1500-2000</span>
            </div>
            <div class="p-3 rounded-xl bg-pink-50">
              <strong class="text-pink-600">Q-Z级：</strong>
              <span class="text-gray-600">中高级章节书，词汇量3000+，接近原版读物</span>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t">
            <p class="text-xs text-gray-500 text-center">建议从AA级开始，逐级学习</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 搜索框 -->
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4">
      <div class="relative">
        <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索绘本名称..."
          class="w-full pl-12 pr-24 py-3 rounded-xl bg-gray-100 border-2 border-transparent focus:border-[var(--theme-accent)] outline-none transition-all text-gray-800"
          :style="{ '--theme-accent': themeAccent }"
        />
        <button 
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-20 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        <!-- 搜索模式切换 -->
        <button
          @click="toggleSearchMode"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs px-2 py-1 rounded-full transition-colors"
          :class="searchMode === 'fuzzy' ? 'bg-[var(--theme-accent)] text-white' : 'bg-gray-200 text-gray-600'"
          :style="{ '--theme-accent': themeAccent }"
          :title="searchMode === 'fuzzy' ? '当前：模糊搜索' : '当前：精准搜索'"
        >
          {{ searchMode === 'fuzzy' ? '模糊' : '精准' }}
        </button>
      </div>
      <p class="text-xs text-gray-400 mt-2">
        {{ searchMode === 'fuzzy' ? '模糊搜索：输入部分文字即可匹配' : '精准搜索：需要完整匹配绘本名称' }}
      </p>
    </div>
    
    <!-- 上次阅读提醒 -->
    <div v-if="lastReadBook" class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 flex items-center gap-4">
      <div class="text-3xl">📖</div>
      <div class="flex-1">
        <p class="text-xs text-gray-500">上次读到</p>
        <p class="text-sm font-medium text-gray-800 truncate">{{ lastReadBook.title }}</p>
        <p class="text-xs text-gray-400">{{ formatLastReadTime(lastReadBook.lastReadAt) }}</p>
      </div>
      <div class="flex gap-2">
        <button 
          @click="continueReading"
          class="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          :style="{ background: `${themeAccent}20`, color: themeAccent }"
        >
          继续读
        </button>
        <button 
          @click="readNextBook"
          class="px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors"
          :style="{ background: themeAccent }"
        >
          下一本
        </button>
      </div>
    </div>
    
    <!-- 级别选择 -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-700 flex items-center gap-2">
        <span>🎯</span>
        <span>选择级别</span>
      </h3>
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="level in sortedLevels" 
          :key="level.name"
          @click="selectLevel(level.name)"
          class="px-4 py-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 flex items-center gap-1"
          :style="selectedLevel === level.name ? { background: `linear-gradient(135deg, ${themeAccent}, ${adjustColor(themeAccent, -20)})`, color: 'white' } : { background: 'rgba(255,255,255,0.8)' }"
        >
          <span class="text-sm font-bold">{{ level.name }}</span>
          <span class="text-xs opacity-80">({{ level.total }})</span>
        </button>
        <!-- 所有级别按钮 -->
        <button 
          @click="selectLevel('all')"
          class="px-4 py-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 flex items-center gap-1"
          :style="selectedLevel === 'all' ? { background: `linear-gradient(135deg, ${themeAccent}, ${adjustColor(themeAccent, -20)})`, color: 'white' } : { background: 'rgba(255,255,255,0.8)' }"
        >
          <span class="text-sm font-bold">所有</span>
          <span class="text-xs opacity-80">({{ totalBooksCount }})</span>
        </button>
      </div>
    </div>
    
    <!-- 标签筛选 - 可折叠 -->
    <div class="space-y-2">
      <div class="flex justify-between items-center cursor-pointer" @click="showTags = !showTags">
        <h3 class="text-base font-semibold text-gray-700 flex items-center gap-2">
          <span>🏷️</span>
          <span>按标签筛选</span>
          <span v-if="activeTags.length > 0" class="text-xs px-2 py-0.5 rounded-full text-white" :style="{ background: themeAccent }">{{ activeTags.length }}</span>
        </h3>
        <div class="flex items-center gap-2">
          <button 
            v-if="activeTags.length > 0"
            @click.stop="clearTags"
            class="text-xs hover:underline flex items-center gap-1"
            :style="{ color: themeAccent }"
          >
            <span>🗑️</span>
            <span>清除</span>
          </button>
          <span class="text-gray-400">{{ showTags ? '▲' : '▼' }}</span>
        </div>
      </div>
      <div v-show="showTags" class="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
        <button 
          v-for="tag in allTags" 
          :key="tag"
          @click="selectTag(tag)"
          class="px-2 py-1 text-xs rounded-full transition-all duration-300 transform hover:scale-105"
          :style="activeTags.includes(tag) ? { background: `linear-gradient(135deg, ${themeAccent}, ${adjustColor(themeAccent, -20)})`, color: 'white' } : { background: 'rgba(255,255,255,0.8)' }"
        >
          {{ tag }}
        </button>
      </div>
    </div>
    
    <!-- 绘本列表 -->
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <span>📚</span>
          <span>{{ searchQuery ? '搜索 "' + searchQuery + '" 的结果' : activeTags.length > 0 ? '包含标签「' + activeTags[0] + '」的绘本' : selectedLevel === 'all' ? '所有绘本' : selectedLevel + '级绘本' }}</span>
          <span class="text-sm font-normal text-gray-500">({{ filteredBooks.length }}本)</span>
        </h3>
      </div>
      
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div 
            v-for="book in paginatedBooks" 
            :key="book.id"
            @click="navigateToBook(book)"
            class="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer relative"
          >
            <div v-if="book.completed" class="absolute top-2 right-2 z-10 text-white rounded-full p-1 text-sm" :style="{ background: themeAccent }">
              ✓
            </div>
            
            <!-- Loading 遮罩 -->
            <div v-if="isNavigating" class="absolute inset-0 bg-white/70 z-20 flex items-center justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2" :style="{ borderColor: themeAccent }"></div>
            </div>
            
            <!-- 优化后的封面 -->
          <div class="h-40 flex items-center justify-center relative overflow-hidden" :style="{ background: `linear-gradient(135deg, ${themeAccent}15, ${adjustColor(themeAccent, -40)}25)` }">
            <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
            <div class="text-center z-10 p-2 w-full">
              <template v-if="getBookIcon(book.title)">
                <span class="text-5xl transform group-hover:scale-110 transition-transform duration-300 block mb-2">
                  {{ getBookIcon(book.title) }}
                </span>
                <span class="text-xs text-gray-600 bg-white/80 px-2 py-0.5 rounded-full">{{ book.level }}</span>
              </template>
              <template v-else>
                <span class="text-lg font-bold text-gray-700 line-clamp-2">{{ cleanTitle(book.title) }}</span>
              </template>
            </div>
          </div>
          
          <div class="p-3">
            <h4 class="text-sm font-medium text-gray-800 line-clamp-2 mb-2 transition-colors">
              {{ book.title }}
            </h4>
            <div class="flex flex-wrap gap-1 mb-2">
              <span 
                v-for="tag in book.tags.slice(0, 2)" 
                :key="tag" 
                class="text-xs px-2 py-0.5 rounded-full"
                :style="{ background: `${themeAccent}30`, color: themeAccent }"
              >
                {{ tag }}
              </span>
            </div>
              <div class="flex justify-between items-center">
              <div class="flex gap-1">
                <span v-if="book.resources?.includes('video')" class="text-sm">🎬</span>
                <span v-if="book.resources?.includes('audio')" class="text-sm">🎵</span>
                <span v-if="book.resources?.includes('pdf')" class="text-sm">📄</span>
              </div>
              <!-- 开发者模式：显示资源链接按钮 -->
              <div v-if="isDevMode" class="flex gap-1">
                <button 
                  @click.stop="navigateToResourceLink(book)"
                  class="text-xs px-2 py-1 rounded bg-blue-100 text-blue-600 hover:bg-blue-200"
                  title="查看资源链接"
                >
                  🔗
                </button>
                <a 
                  v-if="book.pdf" 
                  :href="book.pdf" 
                  target="_blank"
                  class="text-xs px-2 py-1 rounded bg-green-100 text-green-600 hover:bg-green-200"
                  title="PDF链接"
                  @click.stop
                >
                  📄
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 分页 -->
      <div v-if="totalPages > 1" class="flex flex-col items-center gap-3 mt-6">
        <div class="flex items-center gap-2 flex-wrap justify-center">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
            :style="{ background: 'rgba(255,255,255,0.8)', opacity: currentPage === 1 ? 0.5 : 1 }"
          >
            <span class="text-lg">◀</span>
          </button>
          
          <div class="flex gap-1">
            <button
              v-for="page in displayedPages"
              :key="page"
              @click="currentPage = page"
              class="w-8 h-8 rounded-full transition-all duration-300 flex items-center justify-center"
              :style="currentPage === page ? { background: `linear-gradient(135deg, ${themeAccent}, ${adjustColor(themeAccent, -20)})`, color: 'white' } : { background: 'rgba(255,255,255,0.8)' }"
            >
              {{ page }}
            </button>
          </div>
          
          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
            :style="{ background: 'rgba(255,255,255,0.8)', opacity: currentPage === totalPages ? 0.5 : 1 }"
          >
            <span class="text-lg">▶</span>
          </button>
        </div>
        
        <div class="flex items-center gap-4 text-sm text-gray-500">
          <span>{{ currentPage }} / {{ totalPages }} 页</span>
          <div class="flex items-center gap-2">
            <span>每页</span>
            <select 
              v-model="itemsPerPage" 
              class="p-1 border rounded bg-white text-sm"
              :style="{ borderColor: themeAccent }"
            >
              <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
            </select>
            <span>本</span>
          </div>
          <div class="flex items-center gap-1">
            <span>跳转</span>
            <input
              type="number"
              v-model.number="jumpPage"
              @keyup.enter="jumpToPage"
              min="1"
              :max="totalPages"
              class="w-16 p-1 border rounded text-center text-sm"
              :style="{ borderColor: themeAccent }"
              placeholder="页码"
            >
            <span>页</span>
            <button
              @click="jumpToPage"
              class="px-3 py-1 rounded transition-colors text-white text-sm"
              :style="{ background: themeAccent }"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import bookService from '../services/bookService.js'
import { useBookStore } from '../stores/bookStore.js'
import { useThemeStore } from '../stores/themeStore.js'
import { getBookIcon, cleanTitle } from '../utils/bookIcons.js'

const router = useRouter()
const bookStore = useBookStore()
const themeStore = useThemeStore()

// 开发者模式（点击版本号10次开启）
const isDevMode = ref(localStorage.getItem('devMode') === 'true')

const updateDevMode = () => {
  isDevMode.value = localStorage.getItem('devMode') === 'true'
}

window.addEventListener('storage', updateDevMode)
window.addEventListener('devModeChanged', updateDevMode)

onMounted(() => {
  updateDevMode()
})

// 点击加载状态
const isNavigating = ref(false)

const themeAccent = computed(() => themeStore.themeData.accent || '#f472b6')

const adjustColor = (hex, percent) => {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.min(255, Math.max(0, (num >> 16) + amt))
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt))
  const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt))
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}

const levels = ref([])
const selectedLevel = ref('AA')
const activeTags = ref([])
const searchQuery = ref('')
const searchMode = ref('fuzzy') // 'fuzzy' 模糊搜索, 'exact' 精准搜索
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showTags = ref(false)
const showRazInfo = ref(false)
const jumpPage = ref('')

const pageSizeOptions = [5, 10, 20, 50]

const jumpToPage = () => {
  const page = parseInt(jumpPage.value)
  if (page && page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    jumpPage.value = ''
  }
}

// 上次阅读的绘本
const lastReadBook = computed(() => {
  return bookStore.getLastReadBook('raz')
})

// 格式化上次阅读时间
const formatLastReadTime = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

// 继续阅读上次读的书
const continueReading = () => {
  if (lastReadBook.value) {
    const books = bookService.getAllBooks('raz')
    const book = books.find(b => b.id === lastReadBook.value.id || b.title === lastReadBook.value.title)
    if (book) {
      navigateToBook(book)
    } else {
      // Fallback to direct navigation
      navigateToBook({
        id: lastReadBook.value.id,
        title: lastReadBook.value.title,
        level: lastReadBook.value.level
      })
    }
  }
}

// 读下一本
const readNextBook = () => {
  if (lastReadBook.value) {
    const books = bookService.getAllBooks('raz')
    const currentBook = books.find(b => b.title === lastReadBook.value?.title || b.id === lastReadBook.value?.id)
    if (currentBook) {
      const currentIndex = books.findIndex(b => b.id === currentBook.id)
      if (currentIndex < books.length - 1) {
        const nextBook = books[currentIndex + 1]
        navigateToBook(nextBook)
      }
    }
  }
}

// 排序后的级别列表（AA排在最前）
const sortedLevels = computed(() => {
  return [...levels.value].sort((a, b) => {
    // AA 始终排在最前面
    if (a.name === 'AA') return -1
    if (b.name === 'AA') return 1
    // 其他按字母顺序
    return a.name.localeCompare(b.name)
  })
})

// 总绘本数量
const totalBooksCount = computed(() => {
  return levels.value.reduce((sum, level) => sum + level.total, 0)
})

onMounted(() => {
  const razBooks = bookService.getAllBooks('raz')
  const levelStats = {}
  
  razBooks.forEach(book => {
    if (!levelStats[book.level]) {
      levelStats[book.level] = { total: 0, completed: 0 }
    }
    levelStats[book.level].total++
    if (book.completed) {
      levelStats[book.level].completed++
    }
  })
  
  levels.value = Object.entries(levelStats).map(([name, stats]) => ({
    name,
    total: stats.total,
    completed: stats.completed
  }))
  
  // 恢复保存的级别，如果没有则默认选择AA
  const savedLevel = localStorage.getItem('razSelectedLevel')
  if (savedLevel && levelStats[savedLevel]) {
    selectedLevel.value = savedLevel
  } else if (levelStats['AA']) {
    selectedLevel.value = 'AA'
  } else {
    selectedLevel.value = 'all'
  }
})

const allBooks = computed(() => {
  return bookService.getAllBooks('raz')
})

const allTags = computed(() => {
  let allTagsList
  if (selectedLevel.value === 'all') {
    // "所有"级别时，从所有绘本获取标签
    allTagsList = bookService.getAllTags('raz')
  } else {
    // 从当前级别获取标签
    allTagsList = bookService.getFilteredBooks('raz', selectedLevel.value).flatMap(book => book.tags || [])
  }
  // 去重
  const uniqueTags = [...new Set(allTagsList)]
  return uniqueTags.filter(tag => getTagCount(tag) >= 2)
})

const toggleSearchMode = () => {
  searchMode.value = searchMode.value === 'fuzzy' ? 'exact' : 'fuzzy'
}

const filteredBooks = computed(() => {
  // 搜索时在所有绘本中搜索，忽略级别和标签筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    
    if (searchMode.value === 'exact') {
      // 精准搜索：完整匹配或开头匹配
      return allBooks.value.filter(book => {
        const title = book.title.toLowerCase()
        // 移除序号前缀（如 "01_"）后匹配
        const cleanTitle = title.replace(/^\d+[_\s]*/, '')
        const cleanQuery = query.replace(/^\d+[_\s]*/, '')
        
        return title === query || 
               cleanTitle === cleanQuery ||
               title.startsWith(query) ||
               cleanTitle.startsWith(cleanQuery)
      })
    } else {
      // 模糊搜索：包含匹配
      return allBooks.value.filter(book => {
        const title = book.title.toLowerCase()
        const cleanTitle = title.replace(/^\d+[_\s]*/, '')
        
        return title.includes(query) ||
               cleanTitle.includes(query) ||
               (book.tags && book.tags.some(tag => tag.toLowerCase().includes(query)))
      })
    }
  }
  
  let result = allBooks.value
  
  // 如果不是选择"所有"，则按级别筛选
  if (selectedLevel.value !== 'all') {
    result = bookService.getFilteredBooks('raz', selectedLevel.value)
  }
  
  if (activeTags.value.length > 0) {
    result = result.filter(book => book.tags && book.tags.includes(activeTags.value[0]))
  }
  
  return result
})

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredBooks.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredBooks.value.length / itemsPerPage.value) || 1
})

const displayedPages = computed(() => {
  const pages = []
  const maxDisplay = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxDisplay / 2))
  let end = Math.min(totalPages.value, start + maxDisplay - 1)
  
  if (end - start < maxDisplay - 1) {
    start = Math.max(1, end - maxDisplay + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

watch([selectedLevel, activeTags, searchQuery], () => {
  currentPage.value = 1
})

const getTagCount = (tag) => {
  let books
  if (selectedLevel.value === 'all') {
    books = allBooks.value
  } else {
    books = bookService.getFilteredBooks('raz', selectedLevel.value)
  }
  return books.filter(book => book.tags && book.tags.includes(tag)).length
}

const selectLevel = (level) => {
  selectedLevel.value = level
  localStorage.setItem('razSelectedLevel', level)
  activeTags.value = []
  searchQuery.value = ''
}

const selectTag = (tag) => {
  activeTags.value = [tag]
}

const clearTags = () => {
  activeTags.value = []
}

const navigateToBook = (book) => {
  if (isNavigating.value) return
  isNavigating.value = true
  bookStore.setCurrentBook(book)
  router.push({
    path: '/book-detail',
    query: {
      type: 'raz',
      level: book.level,
      id: book.id.toString(),
      title: book.title
    }
  })
  setTimeout(() => {
    isNavigating.value = false
  }, 1000)
}

const navigateToResourceLink = (book) => {
  bookStore.setCurrentBook(book)
  router.push({
    path: '/resource-link',
    query: {
      type: 'raz',
      level: book.level,
      id: book.id.toString(),
      title: book.title
    }
  })
}
</script>
