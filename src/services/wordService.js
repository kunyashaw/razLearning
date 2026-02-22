// 单词数据服务 - 加载每个级别的单词JSON

// 使用本地路径，部署时上传myBooks目录到服务器根目录
const getBaseUrl = () => ''

// RAZ级别列表
const RAZ_LEVELS = ['aa', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

// 牛津树级别列表
const OXFORD_LEVELS = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12']

// 缓存已加载的单词数据
const wordCache = new Map()

// 加载单个级别的单词JSON
async function loadLevelWords(level, type = 'raz') {
  const cacheKey = `${type}-${level}`
  if (wordCache.has(cacheKey)) {
    return wordCache.get(cacheKey)
  }

  try {
    const levelDir = type === 'raz' ? level.toLowerCase() : level
    const url = `/myBooks/${type}/${levelDir}/${levelDir}.json`
    
    console.log('加载单词URL:', url)
    const response = await fetch(url)
    if (!response.ok) {
      console.warn(`加载单词文件失败: ${url}`)
      return []
    }
    
    const data = await response.json()
    
    // 转换为统一的格式 { title: '绘本名称', words: ['word1', 'word2', ...] }
    const wordsData = Array.isArray(data) ? data.map(item => ({
      title: item.title,
      words: item.content || []
    })) : []
    
    wordCache.set(cacheKey, wordsData)
    return wordsData
  } catch (error) {
    console.warn(`加载单词文件出错 (${type}/${level}):`, error)
    return []
  }
}

// 加载多个级别的单词数据
async function loadMultipleLevels(levels, type = 'raz') {
  const allWords = []
  await Promise.all(
    levels.map(async (level) => {
      const levelWords = await loadLevelWords(level, type)
      allWords.push(...levelWords.map(item => ({
        ...item,
        level,
        type
      })))
    })
  )
  return allWords
}

// 根据书名查找绘本对应的单词
async function findWordsByTitle(title, type = 'raz') {
  // 尝试加载所有级别的单词数据
  const levels = type === 'raz' ? RAZ_LEVELS : OXFORD_LEVELS
  
  for (const level of levels) {
    const levelWords = await loadLevelWords(level, type)
    const found = levelWords.find(item => 
      item.title.toLowerCase().includes(title.toLowerCase()) ||
      title.toLowerCase().includes(item.title.toLowerCase())
    )
    if (found) {
      return { ...found, level }
    }
  }
  return null
}

// 获取某个级别的所有绘本单词
async function getWordsByLevel(level, type = 'raz') {
  return await loadLevelWords(level, type)
}

export default {
  loadLevelWords,
  loadMultipleLevels,
  findWordsByTitle,
  getWordsByLevel,
  RAZ_LEVELS,
  OXFORD_LEVELS
}
