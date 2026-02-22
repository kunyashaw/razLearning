const DB_NAME = 'RAZ_PDF_CACHE'
const DB_VERSION = 1
const CACHE_DAYS = 15

let db = null

const openDB = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db)
      return
    }
    
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => reject(request.error)
    
    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }
    
    request.onupgradeneeded = (event) => {
      const database = event.target.result
      
      if (!database.objectStoreNames.contains('pdfs')) {
        const store = database.createObjectStore('pdfs', { keyPath: 'url' })
        store.createIndex('timestamp', 'timestamp', { unique: false })
      }
    }
  })
}

export const cachePDF = async (url, data) => {
  try {
    const database = await openDB()
    const timestamp = Date.now()
    const expiresAt = timestamp + (CACHE_DAYS * 24 * 60 * 60 * 1000)
    
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['pdfs'], 'readwrite')
      const store = transaction.objectStore('pdfs')
      
      const request = store.put({
        url,
        data,
        timestamp,
        expiresAt
      })
      
      request.onsuccess = () => resolve(true)
      request.onerror = () => reject(request.error)
    })
  } catch (e) {
    console.error('Cache PDF error:', e)
    return false
  }
}

export const getCachedPDF = async (url) => {
  try {
    const database = await openDB()
    
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['pdfs'], 'readonly')
      const store = transaction.objectStore('pdfs')
      const request = store.get(url)
      
      request.onsuccess = () => {
        const result = request.result
        if (!result) {
          resolve(null)
          return
        }
        
        if (Date.now() > result.expiresAt) {
          store.delete(url)
          resolve(null)
        } else {
          resolve(result.data)
        }
      }
      
      request.onerror = () => reject(request.error)
    })
  } catch (e) {
    console.error('Get cached PDF error:', e)
    return null
  }
}

export const getAllCachedPDFs = async () => {
  try {
    const database = await openDB()
    
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['pdfs'], 'readonly')
      const store = transaction.objectStore('pdfs')
      const request = store.getAll()
      
      request.onsuccess = () => {
        const results = request.result || []
        const now = Date.now()
        
        const valid = results
          .filter(item => now <= item.expiresAt)
          .map(item => ({
            url: item.url,
            cachedAt: item.timestamp,
            expiresAt: item.expiresAt,
            size: item.data?.length || 0
          }))
          .sort((a, b) => b.cachedAt - a.cachedAt)
        
        resolve(valid)
      }
      
      request.onerror = () => reject(request.error)
    })
  } catch (e) {
    console.error('Get all cached PDFs error:', e)
    return []
  }
}

export const clearExpiredCache = async () => {
  try {
    const database = await openDB()
    const all = await getAllCachedPDFs()
    const now = Date.now()
    
    const transaction = database.transaction(['pdfs'], 'readwrite')
    const store = transaction.objectStore('pdfs')
    
    for (const item of all) {
      if (item.expiresAt < now) {
        store.delete(item.url)
      }
    }
    
    return true
  } catch (e) {
    console.error('Clear expired cache error:', e)
    return false
  }
}

export const clearAllCache = async () => {
  try {
    const database = await openDB()
    
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['pdfs'], 'readwrite')
      const store = transaction.objectStore('pdfs')
      const request = store.clear()
      
      request.onsuccess = () => resolve(true)
      request.onerror = () => reject(request.error)
    })
  } catch (e) {
    console.error('Clear all cache error:', e)
    return false
  }
}

export const getCacheStats = async () => {
  try {
    const all = await getAllCachedPDFs()
    const now = Date.now()
    
    const valid = all.filter(item => item.expiresAt > now)
    const totalSize = valid.reduce((acc, item) => acc + item.size, 0)
    
    return {
      count: valid.length,
      totalSize,
      cacheDays: CACHE_DAYS
    }
  } catch (e) {
    console.error('Get cache stats error:', e)
    return { count: 0, totalSize: 0, cacheDays: CACHE_DAYS }
  }
}
