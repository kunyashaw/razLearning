// 书籍状态管理 - 真实学习进度
import { defineStore } from 'pinia';

export const useBookStore = defineStore('book', {
  state: () => ({
    currentBook: null,
    // 真实学习数据
    completedBooks: JSON.parse(localStorage.getItem('completedBooks') || '[]'),
    studyHistory: JSON.parse(localStorage.getItem('studyHistory') || '[]'),
    totalStudyTime: parseInt(localStorage.getItem('totalStudyTime') || '0'),
    dailyStats: JSON.parse(localStorage.getItem('dailyStats') || '{}'),
    // 上次阅读记录（按类型存储）
    lastReadBooks: JSON.parse(localStorage.getItem('lastReadBooks') || '{}'),
    // 已掌握单词记录
    learnedWords: JSON.parse(localStorage.getItem('learnedWords') || '[]'),
  }),
  
  getters: {
    // 获取完成的绘本数量
    completedCount: (state) => state.completedBooks.length,
    
    // 获取今日学习时长（分钟）
    todayStudyTime: (state) => {
      const today = new Date().toDateString()
      return state.dailyStats[today]?.studyTime || 0
    },
    
    // 获取连续学习天数
    streakDays: (state) => {
      let streak = 0
      const today = new Date()
      for (let i = 0; i < 365; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toDateString()
        if (state.dailyStats[dateStr]?.studyTime > 0) {
          streak++
        } else if (i > 0) {
          break
        }
      }
      return streak
    },
    
    // 获取本周学习次数
    weeklyStudyCount: (state) => {
      const today = new Date()
      let count = 0
      for (let i = 0; i < 7; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toDateString()
        if (state.dailyStats[dateStr]?.studyCount > 0) {
          count++
        }
      }
      return count
    },
    
    // 按类型统计完成数量
    completedByType: (state) => {
      const stats = { raz: 0, oxford: 0 }
      state.completedBooks.forEach(book => {
        if (book.type === 'raz') stats.raz++
        else if (book.type === 'oxford') stats.oxford++
      })
      return stats
    },
    
    // 按级别统计完成数量
    completedByLevel: (state) => {
      const stats = {}
      state.completedBooks.forEach(book => {
        const key = `${book.type}-${book.level}`
        stats[key] = (stats[key] || 0) + 1
      })
      return stats
    },
    
    // 获取已掌握单词总数
    learnedWordsCount: (state) => {
      return state.learnedWords.reduce((total, item) => total + (item.words?.length || 0), 0)
    },
    
    // 获取已学习绘本的单词详情（按学习时间倒序）
    learnedWordsByBook: (state) => {
      const bookMap = {}
      state.learnedWords.forEach(item => {
        if (!bookMap[item.bookId]) {
          bookMap[item.bookId] = {
            bookId: item.bookId,
            title: item.title,
            type: item.type,
            level: item.level,
            wordCount: item.words?.length || 0,
            words: item.words || [],
            learnedAt: item.learnedAt
          }
        }
      })
      return Object.values(bookMap).sort((a, b) => new Date(b.learnedAt) - new Date(a.learnedAt))
    }
  },
  
  actions: {
    setCurrentBook(book) {
      this.currentBook = book;
    },
    
    getCurrentBook() {
      return this.currentBook;
    },
    
    clearCurrentBook() {
      this.currentBook = null;
    },
    
    // 保存上次阅读的绘本（按类型）
    setLastReadBook(book) {
      if (book && book.type) {
        this.lastReadBooks[book.type] = {
          id: book.id,
          title: book.title,
          level: book.level,
          lastReadAt: new Date().toISOString()
        }
        localStorage.setItem('lastReadBooks', JSON.stringify(this.lastReadBooks))
      }
    },
    
    // 获取上次阅读的绘本（按类型）
    getLastReadBook(type) {
      return this.lastReadBooks[type] || null
    },
    
    // 标记绘本为已完成
    markBookCompleted(book) {
      const exists = this.completedBooks.find(b => 
        b.id === book.id && b.type === book.type && b.level === book.level
      )
      if (!exists) {
        this.completedBooks.push({
          id: book.id,
          title: book.title,
          type: book.type,
          level: book.level,
          completedAt: new Date().toISOString()
        })
        this.saveData()
      }
    },
    
    // 记录学习时长
    recordStudyTime(minutes) {
      const today = new Date().toDateString()
      if (!this.dailyStats[today]) {
        this.dailyStats[today] = { studyTime: 0, studyCount: 0 }
      }
      this.dailyStats[today].studyTime += minutes
      this.totalStudyTime += minutes
      this.saveData()
    },
    
    // 记录学习次数
    recordStudySession() {
      const today = new Date().toDateString()
      if (!this.dailyStats[today]) {
        this.dailyStats[today] = { studyTime: 0, studyCount: 0 }
      }
      this.dailyStats[today].studyCount++
      this.saveData()
    },
    
    // 添加学习历史
    addStudyHistory(book, duration) {
      const newRecord = {
        title: book.title,
        type: book.type,
        level: book.level,
        duration: duration,
        timestamp: new Date().toISOString()
      }
      
      // 检查是否已存在相同绘本的学习记录
      const existingIndex = this.studyHistory.findIndex(
        item => item.title === book.title && item.type === book.type
      )
      
      if (existingIndex !== -1) {
        // 更新已有记录的时间戳
        this.studyHistory[existingIndex].timestamp = newRecord.timestamp
        this.studyHistory[existingIndex].duration = duration
      } else {
        // 添加新记录
        this.studyHistory.unshift(newRecord)
      }
      
      // 只保留最近10条记录
      if (this.studyHistory.length > 10) {
        this.studyHistory = this.studyHistory.slice(0, 10)
      }
      this.saveData()
    },
    
    // 添加已掌握的单词
    addLearnedWords(book, words) {
      // 检查是否已添加过这个绘本的单词
      const existingIndex = this.learnedWords.findIndex(item => item.bookId === book.id)
      
      if (existingIndex === -1) {
        this.learnedWords.push({
          bookId: book.id,
          title: book.title,
          type: book.type,
          level: book.level,
          words: words,
          learnedAt: new Date().toISOString()
        })
        this.saveData()
      }
    },
    
    // 检查绘本单词是否已记录
    hasLearnedWords(bookId) {
      return this.learnedWords.some(item => item.bookId === bookId)
    },
    
    // 获取某个绘本的单词
    getBookWords(bookId) {
      const item = this.learnedWords.find(item => item.bookId === bookId)
      return item ? item.words : []
    },
    
    // 清除所有单词数据
    clearLearnedWords() {
      this.learnedWords = []
      this.saveData()
    },
    
    // 检查绘本是否已完成
    isBookCompleted(bookId, type, level) {
      return this.completedBooks.some(b => 
        b.id === bookId && b.type === type && b.level === level
      )
    },
    
    // 保存数据到本地存储
    saveData() {
      localStorage.setItem('completedBooks', JSON.stringify(this.completedBooks))
      localStorage.setItem('studyHistory', JSON.stringify(this.studyHistory))
      localStorage.setItem('totalStudyTime', this.totalStudyTime.toString())
      localStorage.setItem('dailyStats', JSON.stringify(this.dailyStats))
      localStorage.setItem('learnedWords', JSON.stringify(this.learnedWords))
    },
    
    // 清除所有数据
    clearAllData() {
      this.completedBooks = []
      this.studyHistory = []
      this.totalStudyTime = 0
      this.dailyStats = {}
      this.lastReadBooks = {}
      this.learnedWords = []
      localStorage.removeItem('completedBooks')
      localStorage.removeItem('studyHistory')
      localStorage.removeItem('totalStudyTime')
      localStorage.removeItem('dailyStats')
      localStorage.removeItem('lastReadBooks')
      localStorage.removeItem('learnedWords')
    }
  }
});
