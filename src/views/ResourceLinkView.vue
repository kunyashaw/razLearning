<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">资源链接地址</h1>
    <div class="space-y-4">
      <div class="bg-white bg-gray-800 rounded-lg p-4">
        <h2 class="text-lg font-semibold mb-2">路由参数</h2>
        <pre class="text-sm text-gray-600 text-gray-400">{{ routeQuery }}</pre>
      </div>
      <div class="bg-white bg-gray-800 rounded-lg p-4">
        <h2 class="text-lg font-semibold mb-2">资源链接</h2>
        <div class="space-y-4">
          <div>
            <span class="text-sm font-medium text-gray-700 text-gray-300">PDF链接:</span>
            <div class="flex items-center gap-2 mt-1">
              <pre class="text-sm text-gray-600 text-gray-400 flex-1">{{ book.pdfUrl }}</pre>
              <a 
                :href="book.pdfUrl" 
                target="_blank" 
                rel="noopener noreferrer"
                class="px-3 py-1 text-xs bg-blue-100 bg-blue-900 text-blue-600 text-blue-400 rounded hover:bg-blue-200 hover:bg-blue-800 transition-colors whitespace-nowrap"
              >
                访问
              </a>
            </div>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-700 text-gray-300">视频链接:</span>
            <div v-for="(video, index) in book.videos" :key="index" class="flex items-center gap-2 mt-1">
              <pre class="text-sm text-gray-600 text-gray-400 flex-1">{{ video.url }}</pre>
              <a 
                :href="video.url" 
                target="_blank" 
                rel="noopener noreferrer"
                class="px-3 py-1 text-xs bg-blue-100 bg-blue-900 text-blue-600 text-blue-400 rounded hover:bg-blue-200 hover:bg-blue-800 transition-colors whitespace-nowrap"
              >
                访问
              </a>
            </div>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-700 text-gray-300">音频链接:</span>
            <div class="flex items-center gap-2 mt-1">
              <pre class="text-sm text-gray-600 text-gray-400 flex-1">{{ book.audioUrl }}</pre>
              <a 
                :href="book.audioUrl" 
                target="_blank" 
                rel="noopener noreferrer"
                class="px-3 py-1 text-xs bg-blue-100 bg-blue-900 text-blue-600 text-blue-400 rounded hover:bg-blue-200 hover:bg-blue-800 transition-colors whitespace-nowrap"
              >
                访问
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white bg-gray-800 rounded-lg p-4">
        <h2 class="text-lg font-semibold mb-2">当前URL</h2>
        <pre class="text-sm text-gray-600 text-gray-400">{{ currentUrl }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import bookService from '../services/bookService.js'
import { useBookStore } from '../stores/bookStore.js'

const route = useRoute()
const router = useRouter()
const { type, level, id, title } = route.query
const bookStore = useBookStore()

const routeQuery = computed(() => {
  return JSON.stringify(route.query, null, 2)
})

const currentUrl = computed(() => {
  return window.location.href
})

// 确保type有默认值
const bookType = computed(() => {
  return type || 'raz'
})

const book = ref({
  title: '加载中...',
  completed: false,
  resources: [],
  pdfUrl: '',
  videos: [],
  audioUrl: '',
  originalFileName: ''
})

// 加载书籍数据
const loadBookData = () => {
  try {
    // 安全的URL编码函数，确保所有特殊字符都被正确编码
    const safeEncode = (str) => {
      return encodeURIComponent(str).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/!/g, '%21').replace(/'/g, '%27').replace(/\*/g, '%2A').replace(/~/g, '%7E');
    };
    
    console.log('Loading book data:', {
      type: bookType.value,
      level,
      id,
      title
    })
    
    let targetBook = null;
    
    // 查找方式0: 从store中获取（优先）
    const storeBook = bookStore.getCurrentBook();
    console.log('Book from store:', storeBook);
    
    if (storeBook && storeBook.level === level) {
      targetBook = storeBook;
      console.log('Using book from store');
    } else {
      // 获取所有书籍
      const allBooks = bookService.getAllBooks(bookType.value)
      console.log('Total books:', allBooks.length)
      
      // 查找指定级别的书籍
      const levelBooks = allBooks.filter(b => b.level === level)
      console.log('Level books:', levelBooks.length)
      console.log('Level books sample:', levelBooks.slice(0, 3).map(b => ({ id: b.id, title: b.title })))
      
      // 查找方式1: 按ID精确匹配
      targetBook = levelBooks.find(b => b.id.toString() === id.toString())
      console.log('Target book by ID:', targetBook)
      
      // 查找方式2: 按标题包含ID匹配
      if (!targetBook) {
        targetBook = levelBooks.find(b => b.title.includes(id.toString()))
        console.log('Target book by title includes ID:', targetBook)
      }
      
      // 查找方式3: 在所有书籍中按ID匹配
      if (!targetBook) {
        targetBook = allBooks.find(b => b.id.toString() === id.toString())
        console.log('Target book by ID in all books:', targetBook)
      }
      
      // 查找方式4: 在所有书籍中按标题匹配
      if (!targetBook) {
        targetBook = allBooks.find(b => b.title === id.toString())
        console.log('Target book by exact title:', targetBook)
      }
      
      // 查找方式5: 在所有书籍中按标题包含匹配
      if (!targetBook) {
        targetBook = allBooks.find(b => b.title.includes(id.toString()))
        console.log('Target book by title includes in all books:', targetBook)
      }
    }
    
    if (targetBook) {
        // 根据类型生成不同的资源路径
        let pdfUrl = ''
        let videos = []
        let audioUrl = ''
        
        if (bookType.value === 'raz') {
          // RAZ 资源路径
          // 使用name字段（包含number_title格式）而不是title字段
          const fileName = targetBook.name;
          const safeFileName = safeEncode(fileName);
          
          // 新的目录结构：/myBooks/raz/{level}/{type}/{number_title}.{ext}（不要加入id）
          pdfUrl = `/myBooks/raz/${level.toLowerCase()}/pdf/${safeFileName}.pdf`;
          
          videos = [
            { name: `${targetBook.title} - 原版视频`, url: `/myBooks/raz/${level.toLowerCase()}/video/${safeFileName}.mp4` }
          ];
          
          audioUrl = `/myBooks/raz/${level.toLowerCase()}/audio/${safeFileName}.mp3`;
        } else if (bookType.value === 'oxford') {
          // 牛津树资源路径 - 直接使用数据结构中存储的真实路径
          // PDF路径
          pdfUrl = targetBook.pdf ? `/${targetBook.pdf.relativePath}` : '';
          
          // 视频路径 - 直接使用数据结构中存储的所有匹配视频
          videos = [];
          
          // 添加磨耳朵视频
          if (targetBook.videos && targetBook.videos.earTraining) {
            targetBook.videos.earTraining.forEach((video, index) => {
              videos.push({
                name: `${targetBook.title} - 磨耳朵视频${index > 0 ? ` (${index + 1})` : ''}`,
                url: `/${video.relativePath}`
              });
            });
          }
          
          // 添加双语讲解视频
          if (targetBook.videos && targetBook.videos.bilingual) {
            targetBook.videos.bilingual.forEach((video, index) => {
              videos.push({
                name: `${targetBook.title} - 双语讲解${index > 0 ? ` (${index + 1})` : ''}`,
                url: `/${video.relativePath}`
              });
            });
          }
          
          // 音频路径 - 默认使用第一个磨耳朵音频（或双语音频）
          if (targetBook.audios && targetBook.audios.earTraining && targetBook.audios.earTraining.length > 0) {
            audioUrl = `/${targetBook.audios.earTraining[0].relativePath}`;
          } else if (targetBook.audios && targetBook.audios.bilingual && targetBook.audios.bilingual.length > 0) {
            audioUrl = `/${targetBook.audios.bilingual[0].relativePath}`;
          } else {
            audioUrl = '';
          }
        }
      
      book.value = {
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
      };
      console.log('Successfully loaded book:', book.value.title);
    } else {
      console.error('Book not found:', { type: bookType.value, level, id });
      book.value = {
        title: '书籍未找到',
        completed: false,
        resources: [],
        pdfUrl: '',
        videos: [],
        audioUrl: '',
        originalFileName: `Level ${level}, ID ${id}`
      };
    }
  } catch (error) {
    console.error('加载书籍数据失败:', error)
    book.value = {
      title: '加载失败',
      completed: false,
      resources: [],
      pdfUrl: '',
      videos: [],
      audioUrl: '',
      originalFileName: `Error: ${error.message}`
    };
  }
}

onMounted(() => {
  loadBookData()
})
</script>
