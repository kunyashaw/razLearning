<template>
  <div class="pdf-viewer-container">
    <!-- Toast 提示 -->
    <Teleport to="body">
      <div v-if="showToast" class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg"
        :class="{
          'bg-blue-500 text-white': toastType === 'info',
          'bg-green-500 text-white': toastType === 'success',
          'bg-red-500 text-white': toastType === 'error'
        }"
      >
        {{ toastMessage }}
      </div>
    </Teleport>
    
    <!-- 加载弹窗 -->
    <Teleport to="body">
      <div v-if="loading && !useIframe" class="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
        <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
          <div class="text-5xl mb-4 animate-bounce">📖</div>
          <p class="text-xl font-bold text-gray-800 mb-4">正在加载 PDF</p>
          
          <!-- 进度条 -->
          <div class="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              class="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300" 
              :style="{ width: loadingProgress + '%' }"
            ></div>
          </div>
          
          <!-- 百分比 -->
          <div class="text-2xl font-bold mb-2" :style="{ color: themeAccent }">{{ loadingProgress }}%</div>
          
          <!-- 详细信息 -->
          <div class="text-sm text-gray-500 space-y-1">
            <p>已加载: {{ formatBytes(loadedBytes) }} / {{ formatBytes(totalBytes) }}</p>
            <p>耗时: {{ elapsedTime }}秒</p>
          </div>
          
          <p v-if="loadingProgress === 0 && elapsedTime > 2" class="text-xs text-orange-500 mt-3">
            正在连接服务器...
          </p>
        </div>
      </div>
    </Teleport>
    <!-- PDF 音频播放器 -->
    <div v-if="audioUrl && !useIframe" class="audio-player-in-pdf mb-4 p-3 bg-white rounded-lg shadow">
      <!-- 桌面端：横向布局 -->
      <div class="hidden sm:flex items-center gap-3">
        <button 
          @click="seekAudio(-5)"
          class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 active:bg-gray-300 transition-colors"
          :style="{ color: themeAccent }"
        >
          <span class="text-xs">⏪</span>
        </button>
        
        <button 
          @click="toggleAudio"
          class="w-12 h-12 flex items-center justify-center rounded-full shadow-lg active:scale-95 transition-transform"
          :style="{ background: `linear-gradient(135deg, ${themeAccent}, ${adjustColor(themeAccent, -20)})` }"
        >
          <span class="text-2xl text-white">{{ isPlaying ? '⏸' : '▶️' }}</span>
        </button>
        
        <button 
          @click="seekAudio(5)"
          class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 active:bg-gray-300 transition-colors"
          :style="{ color: themeAccent }"
        >
          <span class="text-xs">⏩</span>
        </button>
        
        <div class="flex-1 ml-2">
          <input 
            type="range" 
            :value="audioCurrentTime" 
            :max="audioDuration || 100"
            @input="setAudioTime($event.target.value)"
            class="w-full h-2 rounded-lg appearance-none cursor-pointer"
            :style="{ background: `linear-gradient(to right, ${themeAccent} 0%, ${themeAccent} ${(audioCurrentTime / (audioDuration || 1)) * 100}%, #e5e7eb ${(audioCurrentTime / (audioDuration || 1)) * 100}%, #e5e7eb 100%)` }"
          >
          <div class="flex justify-between text-xs text-gray-400 mt-1">
            <span>{{ formatTime(audioCurrentTime) }}</span>
            <span>{{ formatTime(audioDuration) }}</span>
          </div>
        </div>
      </div>
      
      <!-- 移动端：纵向布局 -->
      <div class="sm:hidden flex flex-col items-center gap-3">
        <div class="flex items-center gap-3">
          <button 
            @click="seekAudio(-5)"
            class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 active:bg-gray-300 transition-colors"
            :style="{ color: themeAccent }"
          >
            <span class="text-xs">⏪</span>
          </button>
          
          <button 
            @click="toggleAudio"
            class="w-14 h-14 flex items-center justify-center rounded-full shadow-lg active:scale-95 transition-transform"
            :style="{ background: `linear-gradient(135deg, ${themeAccent}, ${adjustColor(themeAccent, -20)})` }"
          >
            <span class="text-3xl text-white">{{ isPlaying ? '⏸' : '▶️' }}</span>
          </button>
          
          <button 
            @click="seekAudio(5)"
            class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 active:bg-gray-300 transition-colors"
            :style="{ color: themeAccent }"
          >
            <span class="text-xs">⏩</span>
          </button>
        </div>
        
        <div class="w-full">
          <input 
            type="range" 
            :value="audioCurrentTime" 
            :max="audioDuration || 100"
            @input="setAudioTime($event.target.value)"
            class="w-full h-2 rounded-lg appearance-none cursor-pointer"
            :style="{ background: `linear-gradient(to right, ${themeAccent} 0%, ${themeAccent} ${(audioCurrentTime / (audioDuration || 1)) * 100}%, #e5e7eb ${(audioCurrentTime / (audioDuration || 1)) * 100}%, #e5e7eb 100%)` }"
          >
          <div class="flex justify-between text-xs text-gray-400 mt-1">
            <span>{{ formatTime(audioCurrentTime) }}</span>
            <span>{{ formatTime(audioDuration) }}</span>
          </div>
        </div>
      </div>
      
      <audio 
        ref="audioPlayer"
        :src="audioUrl"
        @timeupdate="updateAudioProgress"
        @loadedmetadata="onAudioLoaded"
        @ended="onAudioEnded"
        preload="metadata"
      ></audio>
      
      <!-- 绘本内容 -->
      <div v-if="bookContent" class="mt-3 p-3 bg-blue-50 rounded-lg">
        <p class="text-sm text-gray-700 leading-relaxed">{{ bookContent }}</p>
      </div>
      
      <!-- 从PDF提取的单词 - 当前页 -->
      <div v-if="extractedWordsByPage.length > 0" class="mt-3 p-3 bg-green-50 rounded-lg">
        <p class="text-xs text-gray-500 mb-2">第{{ currentPage }}页 ({{ currentPageWords.length }}行)</p>
        <div class="space-y-2">
          <div v-for="(line, lineIndex) in currentPageWords" :key="lineIndex" class="flex items-center gap-2">
            <button 
              @click="speakLine(line)"
              class="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <span class="text-xs">🔊</span>
            </button>
            <button 
              @click="startRecording(line)"
              class="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white"
            >
              <span class="text-xs">🎤</span>
            </button>
            <div class="flex flex-wrap gap-1">
              <span 
                v-for="(word, wordIndex) in line" 
                :key="wordIndex"
                class="px-2 py-1 bg-white rounded text-xs text-gray-700"
              >
                {{ word }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 录音弹窗 -->
      <Teleport to="body">
        <div v-if="isRecording" class="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div class="bg-white rounded-2xl p-6 text-center">
            <div class="text-4xl mb-4 animate-pulse">🎤</div>
            <p class="text-lg font-bold mb-4">正在录音...</p>
            <button 
              @click="stopRecording"
              class="px-6 py-2 bg-red-500 text-white rounded-full"
            >
              停止录音
            </button>
          </div>
        </div>
      </Teleport>
      
      <!-- 录音结果弹窗 -->
      <Teleport to="body">
        <div v-if="recordingResult !== null" class="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div class="bg-white rounded-2xl p-6 text-center max-w-sm">
            <div class="text-6xl mb-4">{{ getResultEmoji() }}</div>
            <p class="text-2xl font-bold mb-2">{{ getResultText() }}</p>
            <p class="text-sm text-gray-500 mb-2">你说的是: "{{ recordingResult }}"</p>
            <p v-if="isNotGoodMatch()" class="text-sm text-orange-500 mb-4">标准发音: "{{ recordingLine?.join(' ') }}"</p>
            <button 
              @click="closeRecordingResult"
              class="px-6 py-2 bg-blue-500 text-white rounded-full"
            >
              确定
            </button>
          </div>
        </div>
      </Teleport>
      
      <!-- 调试用 -->
      <div v-if="!bookContent && extractedWordsByPage.length === 0 && !loading" class="mt-3 p-3 bg-gray-100 rounded-lg text-xs text-gray-400">
        暂无绘本内容
      </div>
    </div>
    
    <!-- PDF 工具栏 - 简化版 -->
    <div v-if="!error" class="flex flex-wrap items-center gap-2 mb-3 px-1">
      <!-- 总页数 -->
      <span class="text-sm text-gray-600">
        共 {{ loading ? '?' : totalPages }} 页
      </span>
      
      <!-- 缩放 -->
      <button 
        @click="zoomOut"
        :disabled="loading || scale <= 0.25"
        class="w-7 h-7 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-base"
      >
        −
      </button>
      <button 
        @click="zoomIn"
        :disabled="loading || scale >= 3"
        class="w-7 h-7 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-base"
      >
        +
      </button>
      
      <!-- 自动播放 -->
      <button 
        @click="toggleAutoPlay"
        v-if="!useIframe"
        :disabled="loading || totalPages <= 1"
        class="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all"
        :class="autoPlay ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'"
      >
        <span>{{ autoPlay ? '⏹' : '▶' }}</span>
        <span>自动</span>
      </button>
      
      <!-- 播放间隔 -->
      <select 
        v-if="autoPlay"
        :value="autoPlayInterval"
        @change="setAutoPlayInterval($event.target.value)"
        class="w-12 h-7 text-xs rounded border bg-white"
      >
        <option value="1">1s</option>
        <option value="2">2s</option>
        <option value="3">3s</option>
        <option value="5">5s</option>
        <option value="10">10s</option>
      </select>
    </div>

    <!-- Canvas 渲染模式 -->
    <div v-if="!useIframe && !error" class="relative">
      <div 
        ref="containerRef"
        class="pdf-canvas-container bg-gray-50 rounded-lg overflow-hidden flex justify-center relative"
        :style="{ height: isMobile ? 'calc(100vh - 280px)' : '600px' }"
      >
        <!-- 左侧点击区域 -->
        <div 
          v-if="currentPage > 1"
          @click="prevPage"
          class="absolute left-0 top-0 bottom-0 w-1/4 z-10 cursor-pointer active:bg-black/5 transition-colors flex items-center justify-center"
        >
          <div class="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl transition-opacity"
             :style="{ color: themeAccent }"
          >
            ‹
          </div>
        </div>
        
        <canvas 
          ref="canvasRef"
          class="shadow-lg"
          :style="{ 
            maxWidth: '100%', 
            height: 'auto',
            transform: isMobile ? `scale(${scale})` : 'none',
            transformOrigin: 'top center'
          }"
        ></canvas>
        
        <!-- 右侧点击区域 -->
        <div 
          v-if="currentPage < totalPages"
          @click="nextPage"
          class="absolute right-0 top-0 bottom-0 w-1/4 z-10 cursor-pointer active:bg-black/5 transition-colors flex items-center justify-center"
        >
          <div class="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl transition-opacity"
             :style="{ color: themeAccent }"
          >
            ›
          </div>
        </div>
      </div>
    </div>

    <!-- 错误提示 - 放在页面底部 -->
    <div v-if="error && !useIframe" class="mt-4 text-center py-4 px-4 bg-red-50 rounded-lg border border-red-200">
      <div class="text-2xl mb-2">😅</div>
      <p class="text-red-500 mb-2 font-medium">PDF 加载失败</p>
      <p class="text-gray-600 text-sm mb-3">{{ errorMessage }}</p>
      
      <div class="flex flex-col gap-2 max-w-xs mx-auto">
        <button 
          @click="retryLoad"
          class="px-4 py-2 rounded-lg text-white text-sm font-medium"
          :style="{ background: themeAccent }"
        >
          🔄 重新加载
        </button>
        
        <button 
          v-if="isMobile"
          @click="switchToIframe"
          class="px-4 py-2 rounded-lg text-white bg-blue-500 text-sm"
        >
          📱 使用浏览器查看器
        </button>
        
        <a 
          :href="pdfUrl" 
          target="_blank"
          class="px-4 py-2 rounded-lg text-white bg-green-500 text-sm"
        >
          📄 在新窗口打开
        </a>
      </div>
    </div>
    
    <!-- iFrame 模式（移动端备用） -->
    <div v-else-if="useIframe" class="pdf-iframe-container">
      <iframe
        :src="pdfUrl"
        class="w-full border-0 rounded-lg"
        :style="{ height: isMobile ? '80vh' : '600px' }"
        type="application/pdf"
      ></iframe>
    </div>
    
    <!-- 切换到iframe模式按钮 -->
    <div v-if="!useIframe" class="mt-4 text-center">
      <button 
        @click="switchToIframe"
        class="text-xs text-gray-400 hover:text-gray-600 underline"
      >
        切换到iframe模式
      </button>
    </div>
    <div v-else class="mt-4 text-center">
      <button 
        @click="switchToCanvas"
        class="text-xs text-gray-400 hover:text-gray-600 underline"
      >
        切换到Canvas模式
      </button>
    </div>
    
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { speak as iFlytekSpeak, stop as stopAudio } from '../services/iFlytekTTS'
import { cachePDF, getCachedPDF } from '../services/pdfCache'

const props = defineProps({
  pdfUrl: {
    type: String,
    required: true
  },
  themeAccent: {
    type: String,
    default: '#f472b6'
  },
  audioUrl: {
    type: String,
    default: ''
  },
  bookContent: {
    type: String,
    default: ''
  },
  bookTitle: {
    type: String,
    default: ''
  }
})

const containerRef = ref(null)
const canvasRef = ref(null)
const audioPlayer = ref(null)
const loading = ref(true)
const loadingProgress = ref(0)
const loadingSpeed = ref('0 KB/s')
const loadedBytes = ref(0)
const totalBytes = ref(0)
const startTime = ref(0)
const elapsedTime = computed(() => {
  if (!startTime.value) return 0
  return ((Date.now() - startTime.value) / 1000).toFixed(1)
})
const error = ref(false)
const errorMessage = ref('')
const detailedError = ref('')
const currentPage = ref(1)
const totalPages = ref(0)
const scale = ref(1.0)
const isPlaying = ref(false)
const audioCurrentTime = ref(0)
const audioDuration = ref(0)
const isMobile = ref(false)
const useIframe = ref(false)
const networkStatus = ref('未知')
const deviceType = ref('未知')
const autoPlay = ref(false)
const autoPlayInterval = ref(3)
const autoPlayLineIndex = ref(0)
const extractedWordsByPage = ref([])
const currentPageWords = computed(() => {
  const pageData = extractedWordsByPage.value.find(p => p.page === currentPage.value)
  return pageData ? pageData.lines : []
})

const toastMessage = ref('')
const toastType = ref('info') // info, success, error
const showToast = ref(false)

const displayToast = (message, type = 'info', duration = 3000) => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, duration)
}

const isRecording = ref(false)
const recordingLine = ref(null)
const recordingResult = ref(null)
let mediaRecorder = null
let audioChunks = []
let recognitionStream = null
let autoPlayTimer = null
let pdfDoc = null
let pdfjsLib = null
let loadingTimer = null

// 计算PDF文件名
const pdfFileName = computed(() => {
  if (!props.pdfUrl) return ''
  const parts = props.pdfUrl.split('/')
  return parts[parts.length - 1] || props.pdfUrl
})

// 计算完整PDF URL（包含域名）
const fullPdfUrl = computed(() => {
  if (!props.pdfUrl) return ''
  if (props.pdfUrl.startsWith('http')) {
    return props.pdfUrl
  }
  return window.location.origin + props.pdfUrl
})

// 复制路径到剪贴板
const copyPath = async () => {
  try {
    await navigator.clipboard.writeText(fullPdfUrl.value)
    alert('路径已复制到剪贴板！')
  } catch (err) {
    // 降级方案
    const textarea = document.createElement('textarea')
    textarea.value = fullPdfUrl.value
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    alert('路径已复制！')
  }
}

// 动态导入 PDF.js（避免SSR问题）
const initPDFJS = async () => {
  if (pdfjsLib) return pdfjsLib
  
  try {
    const pdfjs = await import('pdfjs-dist')
    pdfjsLib = pdfjs
    
    // 设置 worker（优先使用.js后缀，极空间等NAS设备兼容性更好）
    const workerPaths = [
      '/pdf.worker.js',
      './pdf.worker.js',
      'pdf.worker.js',
      '/pdf.worker.min.mjs',
      './pdf.worker.min.mjs',
      'pdf.worker.min.mjs'
    ]
    
    for (const path of workerPaths) {
      try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = path
        console.log('PDF.js worker路径:', path)
        break
      } catch (e) {
        continue
      }
    }
    
    return pdfjsLib
  } catch (err) {
    console.error('PDF.js加载失败:', err)
    throw err
  }
}

// 格式化字节数
const formatBytes = (bytes) => {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const adjustColor = (hex, percent) => {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.min(255, Math.max(0, (num >> 16) + amt))
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt))
  const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt))
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}

const renderPage = async () => {
  if (!pdfDoc || !canvasRef.value) return
  
  try {
    const page = await pdfDoc.getPage(currentPage.value)
    const canvas = canvasRef.value
    const context = canvas.getContext('2d')
    
    // 移动端优化：降低分辨率
    const viewport = page.getViewport({ 
      scale: isMobile.value ? scale.value * 0.8 : scale.value 
    })
    
    canvas.height = viewport.height
    canvas.width = viewport.width
    
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise
  } catch (err) {
    console.error('渲染失败:', err)
  }
}

// 从PDF中按页提取单词
const extractWordsFromPDF = async () => {
  if (!pdfDoc) {
    return
  }
  
  try {
    const wordsByPage = []
    const numPages = pdfDoc.numPages
    const wordPattern = /\b[a-zA-Z]+\b/g
    
    const wordsToFilter = new Set([
      props.themeAccent?.toLowerCase() || '',
      ...(props.bookTitle?.toLowerCase().match(wordPattern) || []),
      'the', 'end'
    ])
    
    const cleanTitle = props.bookTitle?.toLowerCase().replace(/^\d+_/, '')
    if (cleanTitle) {
      cleanTitle.split(/[\s_]+/).forEach(word => {
        if (word.length > 2) {
          wordsToFilter.add(word)
        }
      })
    }
    
    console.log('===== PDF单词提取调试 =====')
    console.log('1. themeAccent:', props.themeAccent)
    console.log('2. bookTitle:', props.bookTitle)
    console.log('3. 过滤词列表:', [...wordsToFilter])
    console.log('===========================')
    
    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDoc.getPage(i)
      const textContent = await page.getTextContent()
      
      // 第1页：提取书名
      if (i === 1) {
        const cleanTitle = props.bookTitle?.toLowerCase().replace(/^\d+_/, '') || ''
        const titleWords = cleanTitle.split(/[\s_]+/).filter(w => w.length > 0)
        if (titleWords.length > 0) {
          wordsByPage.push({
            page: 1,
            lines: [titleWords]
          })
          console.log(`第1页书名:`, titleWords)
        }
        continue
      }
      
      console.log(`\n--- 第 ${i} 页 ---`)
      console.log('原始文本项:', textContent.items.map(item => ({
        str: item.str,
        y: item.transform?.[5]
      })))
      
      // 最后一页显示 the end（优先其他规则）
      if (i === numPages) {
        wordsByPage.push({
          page: i,
          lines: [['the', 'end']]
        })
        console.log(`第 ${i} 页设置为 the end`)
        continue
      }
      
      // 检查是否包含 written 或 readinga
      const allText = textContent.items.map(item => item.str).join(' ').toLowerCase()
      if (allText.includes('written') || allText.includes('readinga')) {
        console.log(`跳过第 ${i} 页（包含written或readinga）`)
        continue
      }
      
      // 找到页码的y坐标
      const pageNumPattern = /^\d+$/
      const pageNumItems = textContent.items.filter(item => pageNumPattern.test(item.str?.trim()))
      let pageNumY = null
      if (pageNumItems.length > 0) {
        pageNumY = pageNumItems[0].transform?.[5]
        console.log('页码y坐标:', pageNumY)
      }
      
      // 按y坐标分组（每行）
      const linesMap = new Map()
      
      for (const item of textContent.items) {
        const y = item.transform?.[5]
        // 跳过页码所在的行
        if (pageNumY !== null && Math.abs(y - pageNumY) <= 5) {
          continue
        }
        
        // 按y坐标四舍五入到整数来分组（处理PDF渲染时的微小差异）
        const yKey = Math.round(y)
        
        if (!linesMap.has(yKey)) {
          linesMap.set(yKey, [])
        }
        linesMap.get(yKey).push(item)
      }
      
      // 按y坐标从大到小排序（PDF坐标系y从上往下，所以大的y是上面的行）
      const sortedYKeys = [...linesMap.keys()].sort((a, b) => b - a)
      
      const lines = []
      for (const yKey of sortedYKeys) {
        const items = linesMap.get(yKey)
        // 按x坐标排序（从左到右）
        items.sort((a, b) => (a.transform?.[4] || 0) - (b.transform?.[4] || 0))
        
        const lineText = items.map(item => item.str).join(' ')
        const words = lineText.match(wordPattern) || []
          .map(w => w.toLowerCase())
          .filter(w => !wordsToFilter.has(w))
        
        if (words.length > 0) {
          lines.push(words)
        }
      }
      
      console.log('按行提取的单词:', lines)
      
      wordsByPage.push({
        page: i,
        lines: lines
      })
    }
    
    console.log('\n===== 最终结果 =====')
    console.log('按页按行提取单词:', wordsByPage)
    extractedWordsByPage.value = wordsByPage
  } catch (err) {
    console.error('提取单词失败:', err)
  }
}

const speakLine = async (line) => {
  const text = line.join(' ')
  console.log('iFlytek TTS speaking:', text)
  displayToast('正在合成语音...', 'info')
  try {
    await iFlytekSpeak(text)
    displayToast('语音播放中: ' + text, 'success')
  } catch (e) {
    displayToast('语音播放失败: ' + e.message, 'error')
  }
}

const startRecording = async (line) => {
  try {
    displayToast('开始录音...', 'info')
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        sampleRate: 16000,
        channelCount: 1,
        echoCancellation: true
      } 
    })
    
    const audioContext = new AudioContext({ sampleRate: 16000 })
    const source = audioContext.createMediaStreamSource(stream)
    const processor = audioContext.createScriptProcessor(4096, 1, 1)
    
    const pcmChunks = []
    processor.onaudioprocess = (e) => {
      const data = e.inputBuffer.getChannelData(0)
      const int16Array = new Int16Array(data.length)
      for (let i = 0; i < data.length; i++) {
        int16Array[i] = Math.max(-1, Math.min(1, data[i])) * 0x7FFF
      }
      pcmChunks.push(int16Array)
    }
    
    source.connect(processor)
    processor.connect(audioContext.destination)
    
    mediaRecorder = { 
      stop: () => {
        processor.disconnect()
        source.disconnect()
        stream.getTracks().forEach(t => t.stop())
        audioContext.close()
        
        const totalLength = pcmChunks.reduce((acc, arr) => acc + arr.length, 0)
        const combined = new Int16Array(totalLength)
        let offset = 0
        for (const chunk of pcmChunks) {
          combined.set(chunk, offset)
          offset += chunk.length
        }
        
        const pcmBlob = new Blob([combined], { type: 'audio/pcm' })
        processRecording(pcmBlob, line)
      }
    }
    
    recordingLine.value = line
    recordingResult.value = null
    isRecording.value = true
    
    console.log('Recording started (PCM 16kHz)')
  } catch (e) {
    console.error('Recording error:', e)
    isRecording.value = false
  }
}

const stopRecording = () => {
  if (mediaRecorder && isRecording.value) {
    isRecording.value = false
    mediaRecorder.stop()
  }
}

const processRecording = async (audioBlob, line) => {
  try {
    const token = await getBaiduToken()
    const arrayBuffer = await audioBlob.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    let binary = ''
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i])
    }
    const base64 = btoa(binary)
    
    const url = `${API_PREFIX}/baidu-asr`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: token,
        speech: base64,
        len: arrayBuffer.byteLength,
        format: 'pcm',
        rate: 16000,
        channel: 1,
        cuid: import.meta.env.VITE_BAIDU_APP_ID || 'your_app_id',
        dev_pid: 1737
      })
    })
    
    const result = await response.json()
    console.log('Baidu ASR result:', result)
    
    const recognizedText = result.result?.[0] || ''
    recordingResult.value = recognizedText
    
    const targetText = line.join(' ').toLowerCase()
    const similarity = calculateSimilarity(recognizedText.toLowerCase(), targetText)
    
    console.log('Similarity:', similarity, 'recognized:', recognizedText, 'target:', targetText)
  } catch (e) {
    console.error('Process recording error:', e)
    recordingResult.value = '识别失败'
  }
}

const calculateSimilarity = (str1, str2) => {
  const words1 = str1.split(/\s+/).filter(w => w)
  const words2 = str2.split(/\s+/).filter(w => w)
  let match = 0
  for (const w1 of words1) {
    if (words2.some(w2 => w2.includes(w1) || w1.includes(w2))) {
      match++
    }
  }
  return words2.length > 0 ? match / words2.length : 0
}

let baiduToken = null
let baiduTokenExpire = 0

// 开发环境用Vite代理(/baidu-token)，生产环境用Nginx代理(/api/baidu-token)
const API_PREFIX = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_PREFIX || '')

const getBaiduToken = async () => {
  if (baiduToken && Date.now() < baiduTokenExpire) {
    return baiduToken
  }
  const appKey = import.meta.env.VITE_BAIDU_APP_KEY || ''
  const appSecret = import.meta.env.VITE_BAIDU_APP_SECRET || ''
  const url = `${API_PREFIX}/baidu-token?grant_type=client_credentials&client_id=${appKey}&client_secret=${appSecret}`
  const response = await fetch(url, { method: 'POST' })
  const data = await response.json()
  baiduToken = data.access_token
  baiduTokenExpire = Date.now() + (data.expires_in - 300) * 1000
  return baiduToken
}

const getResultEmoji = () => {
  if (!recordingLine.value) return '💪'
  const sim = calculateSimilarity(recordingResult.value.toLowerCase(), recordingLine.value.join(' ').toLowerCase())
  return sim >= 0.95 ? '👏' : '💪'
}

const getResultText = () => {
  if (!recordingLine.value) return '再接再厉!'
  const sim = calculateSimilarity(recordingResult.value.toLowerCase(), recordingLine.value.join(' ').toLowerCase())
  return sim >= 0.95 ? 'Wonderful!' : '再接再厉!'
}

const isNotGoodMatch = () => {
  if (!recordingLine.value) return false
  const sim = calculateSimilarity(recordingResult.value.toLowerCase(), recordingLine.value.join(' ').toLowerCase())
  return sim < 0.95
}

const closeRecordingResult = () => {
  recordingResult.value = null
  recordingLine.value = null
}

const loadPDF = async () => {
  if (!props.pdfUrl) return
  
  loading.value = true
  loadingProgress.value = 0
  loadingSpeed.value = '0 KB/s'
  loadedBytes.value = 0
  error.value = false
  errorMessage.value = ''
  detailedError.value = ''
  startTime.value = Date.now()
  
  // 更新网络状态
  networkStatus.value = navigator.onLine ? '在线' : '离线'
  
  console.log('[PDF Debug] 开始加载PDF:', props.pdfUrl)
  console.log('[PDF Debug] 设备信息:', navigator.userAgent)
  console.log('[PDF Debug] 网络状态:', networkStatus.value)
  console.log('[PDF Debug] 开始时间:', new Date().toISOString())
  
  // 启动定时器更新elapsedTime
  if (loadingTimer) clearInterval(loadingTimer)
  loadingTimer = setInterval(() => {
    // 强制更新计算属性
    if (loading.value) {
      console.log(`[PDF Debug] 加载中... 进度: ${loadingProgress.value}%, 已加载: ${formatBytes(loadedBytes.value)}, 耗时: ${elapsedTime.value}s`)
    }
  }, 1000)
  
  try {
    // 动态加载 PDF.js
    const PDFJS = await initPDFJS()
    
    // 先尝试获取文件大小（HEAD请求）
    try {
      console.log('[PDF Debug] 尝试HEAD请求获取文件大小...')
      const headResponse = await fetch(props.pdfUrl, { method: 'HEAD', cache: 'no-cache' })
      const contentLength = headResponse.headers.get('content-length')
      if (contentLength) {
        totalBytes.value = parseInt(contentLength)
        console.log('[PDF Debug] 文件大小:', formatBytes(totalBytes.value))
      } else {
        console.log('[PDF Debug] HEAD请求未返回content-length')
      }
    } catch (e) {
      console.log('[PDF Debug] HEAD请求失败:', e.message)
    }
    
    // 尝试从缓存加载PDF
    let pdfData = await getCachedPDF(props.pdfUrl)
    
    if (!pdfData) {
      console.log('[PDF Debug] 从网络加载PDF...')
      // 从网络加载
      const response = await fetch(props.pdfUrl, { cache: 'no-cache' })
      if (!response.ok) throw new Error('network')
      pdfData = await response.arrayBuffer()
      
      // 缓存PDF数据
      await cachePDF(props.pdfUrl, Array.from(new Uint8Array(pdfData)))
      console.log('[PDF Debug] PDF已缓存')
    } else {
      console.log('[PDF Debug] 从缓存加载PDF...')
    }
    
    // 加载PDF（移动端使用更宽松的参数）
    const loadingTask = PDFJS.getDocument({
      data: pdfData,
      withCredentials: false,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.624/cmaps/',
      cMapPacked: true,
      // 移动端优化
      disableAutoFetch: isMobile.value,
      disableStream: isMobile.value
    })
    
    // 进度回调（增强版）
    let lastProgressTime = Date.now()
    let lastLoaded = 0
    
    loadingTask.onProgress = (progress) => {
      const currentTime = Date.now()
      const timeDiff = (currentTime - lastProgressTime) / 1000 // 秒
      
      if (progress.total > 0) {
        loadingProgress.value = Math.round((progress.loaded / progress.total) * 100)
        totalBytes.value = progress.total
      }
      
      loadedBytes.value = progress.loaded
      
      // 计算下载速度
      if (timeDiff > 0 && progress.loaded > lastLoaded) {
        const bytesDiff = progress.loaded - lastLoaded
        const speed = bytesDiff / timeDiff
        loadingSpeed.value = formatBytes(speed) + '/s'
        lastProgressTime = currentTime
        lastLoaded = progress.loaded
      }
    }
    
    // 设置超时（45秒）
    const timeoutId = setTimeout(() => {
      if (loading.value) {
        console.error('[PDF Debug] 加载超时！')
        console.error('[PDF Debug] 已加载:', formatBytes(loadedBytes.value))
        console.error('[PDF Debug] 总大小:', formatBytes(totalBytes.value))
        console.error('[PDF Debug] 耗时:', elapsedTime.value, '秒')
        
        error.value = true
        errorMessage.value = `加载超时 (${elapsedTime.value}秒)`
        
        if (loadedBytes.value === 0) {
          detailedError.value = '无法连接到PDF文件服务器\n可能原因：\n1. 文件不存在\n2. 服务器未响应\n3. 网络连接问题'
        } else if (loadedBytes.value < totalBytes.value) {
          detailedError.value = `下载中断\n已下载: ${formatBytes(loadedBytes.value)} / ${formatBytes(totalBytes.value)}\n平均速度: ${(loadedBytes.value / parseFloat(elapsedTime.value) / 1024).toFixed(2)} KB/s`
        } else {
          detailedError.value = `PDF解析超时\n文件已下载但无法解析\n可能文件损坏或格式不支持`
        }
        
        loading.value = false
        clearInterval(loadingTimer)
      }
    }, 45000)
    
    pdfDoc = await loadingTask.promise
    clearTimeout(timeoutId)
    clearInterval(loadingTimer)
    
    console.log('[PDF Debug] 加载成功！耗时:', elapsedTime.value, '秒')
    console.log('[PDF Debug] 总页数:', pdfDoc.numPages)
    
    totalPages.value = pdfDoc.numPages
    currentPage.value = 1
    
    await renderPage()
    
    // 提取PDF中的单词
    await extractWordsFromPDF()
    
    loading.value = false
    
  } catch (err) {
    clearInterval(loadingTimer)
    console.error('[PDF Debug] PDF加载失败:', err)
    
    loading.value = false
    error.value = true
    
    // 构建详细错误信息
    const errorInfo = {
      name: err.name || 'Unknown',
      message: err.message || 'No message',
      stack: err.stack || '',
      elapsed: elapsedTime.value,
      loaded: formatBytes(loadedBytes.value),
      total: formatBytes(totalBytes.value),
      network: networkStatus.value,
      url: props.pdfUrl
    }
    
    detailedError.value = JSON.stringify(errorInfo, null, 2)
    
    // 设置用户友好的错误消息
    if (err.message?.includes('worker')) {
      errorMessage.value = 'PDF引擎加载失败'
    } else if (err.message?.includes('network') || err.message?.includes('fetch')) {
      if (loadedBytes.value === 0) {
        errorMessage.value = '无法连接到PDF文件 (404/网络错误)'
      } else {
        errorMessage.value = '网络中断，下载未完成'
      }
    } else if (err.message?.includes('Invalid PDF')) {
      errorMessage.value = 'PDF文件损坏或格式不正确'
    } else if (err.message?.includes('Missing PDF')) {
      errorMessage.value = 'PDF文件不存在 (404)'
    } else if (err.message?.includes('timeout')) {
      errorMessage.value = '加载超时，文件可能太大或网络太慢'
    } else {
      errorMessage.value = `加载失败: ${err.message?.substring(0, 100) || '未知错误'}`
    }
  }
}

const switchToIframe = () => {
  useIframe.value = true
  error.value = false
}

const switchToCanvas = () => {
  useIframe.value = false
  loadPDF()
}

const retryLoad = () => {
  pdfDoc = null
  loadingProgress.value = 0
  loadedBytes.value = 0
  loadPDF()
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    renderPage()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    renderPage()
  } else {
    // 到达最后一页，停止自动播放
    toggleAutoPlay()
  }
}

const toggleAutoPlay = () => {
  autoPlay.value = !autoPlay.value
  if (autoPlay.value) {
    if (currentPage.value >= totalPages.value) {
      currentPage.value = 3
      renderPage()
    }
    autoPlayLineIndex.value = 0
    playNextLine()
  } else {
    stopAudio()
    if (autoPlayTimer) {
      clearTimeout(autoPlayTimer)
      autoPlayTimer = null
    }
  }
}

const playNextLine = async () => {
  if (!autoPlay.value) return
  
  const pageData = extractedWordsByPage.value.find(p => p.page === currentPage.value)
  if (!pageData || !pageData.lines || pageData.lines.length === 0) {
    if (currentPage.value < totalPages.value) {
      nextPage()
      autoPlayLineIndex.value = 0
      autoPlayTimer = setTimeout(playNextLine, 500)
    } else {
      toggleAutoPlay()
    }
    return
  }
  
  if (autoPlayLineIndex.value >= pageData.lines.length) {
    if (currentPage.value < totalPages.value) {
      nextPage()
      autoPlayLineIndex.value = 0
      autoPlayTimer = setTimeout(playNextLine, 500)
    } else {
      toggleAutoPlay()
    }
    return
  }
  
  const line = pageData.lines[autoPlayLineIndex.value]
  await iFlytekSpeak(line.join(' '))
  
  autoPlayLineIndex.value++
  autoPlayTimer = setTimeout(playNextLine, autoPlayInterval.value * 1000)
}

const setAutoPlayInterval = (interval) => {
  autoPlayInterval.value = parseInt(interval) || 3
  if (autoPlay.value) {
    if (autoPlayTimer) {
      clearTimeout(autoPlayTimer)
    }
    autoPlayTimer = setTimeout(playNextLine, autoPlayInterval.value * 1000)
  }
}

const zoomIn = () => {
  scale.value = Math.min(scale.value + 0.25, isMobile.value ? 3.0 : 2.0)
  renderPage()
}

const zoomOut = () => {
  scale.value = Math.max(scale.value - 0.25, 0.4)
  renderPage()
}

// 音频控制
const toggleAudio = () => {
  if (!audioPlayer.value) return
  
  if (isPlaying.value) {
    audioPlayer.value.pause()
    isPlaying.value = false
  } else {
    audioPlayer.value.play().then(() => {
      isPlaying.value = true
    }).catch(() => {
      alert('音频播放失败')
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
}

const setAudioTime = (value) => {
  if (audioPlayer.value) {
    audioPlayer.value.currentTime = parseFloat(value)
  }
}

const seekAudio = (seconds) => {
  if (audioPlayer.value) {
    const newTime = Math.max(0, Math.min(
      audioPlayer.value.currentTime + seconds, 
      audioDuration.value
    ))
    audioPlayer.value.currentTime = newTime
  }
}

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

onMounted(() => {
  // 预热语音合成并加载声音列表
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices()
    const dummy = new SpeechSynthesisUtterance('')
    window.speechSynthesis.speak(dummy)
    window.speechSynthesis.cancel()
    console.log('TTS voices loaded:', window.speechSynthesis.getVoices().map(v => v.name))
  }
  
  // 检测移动端
  const userAgent = navigator.userAgent.toLowerCase()
  isMobile.value = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/.test(userAgent)
  
  // 设置设备类型
  if (/ipad/.test(userAgent)) deviceType.value = 'iPad'
  else if (/iphone/.test(userAgent)) deviceType.value = 'iPhone'
  else if (/android/.test(userAgent)) deviceType.value = 'Android'
  else deviceType.value = 'Desktop'
  
  // 检测是否在极空间等NAS环境（通过URL或UserAgent特征）
  const hostname = window.location.hostname.toLowerCase()
  const isNAS = hostname.includes('zconnect') || 
                hostname.includes('nas') || 
                hostname.includes('synology') ||
                hostname.includes('qnap') ||
                /192\.168\./.test(hostname) ||
                /10\./.test(hostname)
  
  console.log('[PDF Debug] 设备类型:', deviceType.value)
  console.log('[PDF Debug] 主机名:', hostname)
  console.log('[PDF Debug] 是否NAS:', isNAS)
  
  // 添加触摸缩放事件（移动端）
  if (isMobile.value && containerRef.value) {
    let initialDistance = 0
    let initialScale = 1
    
    containerRef.value.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        initialDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
        initialScale = scale.value
      }
    }, { passive: true })
    
    containerRef.value.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        const currentDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
        const newScale = initialScale * (currentDistance / initialDistance)
        scale.value = Math.max(0.4, Math.min(3.0, newScale))
        renderPage()
      }
    }, { passive: true })
  }
  
  // 默认使用 Canvas 模式渲染 PDF
  loadPDF()
})

onUnmounted(() => {
  if (loadingTimer) clearInterval(loadingTimer)
  if (pdfDoc) {
    pdfDoc.destroy()
  }
  stopAudio()
})

watch(() => props.pdfUrl, () => {
  pdfDoc = null
  loadPDF()
})
</script>

<style scoped>
.pdf-viewer-container {
  width: 100%;
}

.pdf-canvas-container {
  position: relative;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.pdf-canvas-container canvas {
  max-width: 100%;
  height: auto;
}

.pdf-iframe-container iframe {
  width: 100%;
  border: none;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .pdf-toolbar {
    position: sticky;
    top: 0;
    z-index: 10;
  }
  
  .pdf-canvas-container {
    touch-action: pan-y pinch-zoom;
  }
}

/* 触摸优化 */
@media (pointer: coarse) {
  button {
    min-height: 44px;
    min-width: 44px;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
