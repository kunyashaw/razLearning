// 牛津树绘本数据服务 - 使用真实文件路径

import { useBookStore } from '../stores/bookStore.js'

let bookStore = null

export const initOxfordBookStore = (store) => {
  bookStore = store
}

// 导入基础数据（包含真实文件路径）
import oxfordData from '../../oxford_books.json';
// 导入分类数据（包含标签）
import classifiedData from '../../classified_oxford_books.json';

// 构建结构化的绘本数据
const oxfordBooks = {
  oxford: {
    L1: [],
    L2: []
  }
};

// 处理数据 - 合并基础数据和分类数据
oxfordData.forEach((book) => {
  if (book.type === 'oxford' && book.level && (book.level === 'L1' || book.level === 'L2')) {
    // 从分类数据中找到对应的标签
    const classifiedBook = classifiedData.find(b => b.id === book.id);
    
    const processedBook = {
      id: book.id,
      title: book.name,
      name: book.name,
      level: book.level,
      type: book.type,
      completed: false,
      resources: book.resources || ['pdf'],
      // 使用数据结构中存储的真实路径
      pdf: book.pdf || null,
      videos: book.videos || { bilingual: [], earTraining: [] },
      audios: book.audios || { bilingual: [], earTraining: [] },
      tags: classifiedBook?.tags || ['其他']
    };
    
    if (oxfordBooks.oxford[book.level]) {
      oxfordBooks.oxford[book.level].push(processedBook);
    }
  }
});

// 按序号排序
Object.keys(oxfordBooks.oxford).forEach(level => {
  oxfordBooks.oxford[level].sort((a, b) => {
    const numA = parseInt(a.id.split('-')[1]) || 0;
    const numB = parseInt(b.id.split('-')[1]) || 0;
    return numA - numB;
  });
});

// 获取所有级别的所有绘本
const getAllBooks = (type) => {
  let result = [];
  for (const [level, levelBooks] of Object.entries(oxfordBooks[type])) {
    levelBooks.forEach(book => {
      let completed = false
      if (bookStore) {
        completed = bookStore.isBookCompleted(book.id, type, level)
      }
      result.push({ ...book, level, completed });
    });
  }
  return result;
};

// 获取所有唯一的标签
const getAllTags = (type) => {
  const tagSet = new Set();
  const books = getAllBooks(type);
  books.forEach(book => {
    if (book.tags) {
      book.tags.forEach(tag => tagSet.add(tag));
    }
  });
  return Array.from(tagSet).sort();
};

// 获取标签在所有绘本中的数量
const getTagCount = (type, tag) => {
  const books = getAllBooks(type);
  return books.filter(book => book.tags && book.tags.includes(tag)).length;
};

// 获取指定级别和标签的绘本
const getFilteredBooks = (type, level, tags = []) => {
  let result = [];

  if (level) {
    result = oxfordBooks[type][level] || [];
    result = result.map(book => {
      let completed = false
      if (bookStore) {
        completed = bookStore.isBookCompleted(book.id, type, level)
      }
      return { ...book, level, completed }
    })
  } else {
    result = getAllBooks(type)
  }

  if (tags.length > 0) {
    result = result.filter(book =>
      book.tags && tags.every(tag => book.tags.includes(tag))
    )
  }

  return result
}

// 获取学习进度
const getProgress = (type) => {
  const progress = {}

  for (const [level, levelBooks] of Object.entries(oxfordBooks[type])) {
    const total = levelBooks.length
    let completed = 0
    if (bookStore) {
      completed = levelBooks.filter(book =>
        bookStore.isBookCompleted(book.id, type, level)
      ).length
    }
    progress[level] = {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }

  return progress
}

// 获取指定级别的绘本数量
const getLevelCount = (type, level) => {
  if (oxfordBooks[type] && oxfordBooks[type][level]) {
    return oxfordBooks[type][level].length;
  }
  return 0;
};

// 获取指定绘本的详细信息
const getBookById = (type, level, id) => {
  if (oxfordBooks[type] && oxfordBooks[type][level]) {
    return oxfordBooks[type][level].find(book => book.id === id);
  }
  return null;
};

export default {
  oxfordBooks,
  getAllBooks,
  getAllTags,
  getTagCount,
  getFilteredBooks,
  getProgress,
  getLevelCount,
  getBookById,
  initOxfordBookStore
};
