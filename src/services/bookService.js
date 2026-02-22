// 绘本数据服务

import { useBookStore } from '../stores/bookStore.js'

let bookStore = null

export const initBookStore = (store) => {
  bookStore = store
}

// 直接导入分类数据
import classifiedBooks from '../../classified_books.json';

// 处理导入失败的情况
let booksData = classifiedBooks;
if (!booksData || !Array.isArray(booksData)) {
  console.error('导入分类数据失败');
  booksData = [];
}

// 构建结构化的绘本数据 - 动态初始化
const mockBooks = {
  raz: {},
  oxford: {}
};

// 填充真实数据
booksData.forEach((book, index) => {
  // 处理空的 level 和错误的 type
  let type = book.type;
  let level = book.level;
  
  // 如果 level 为空，根据书名判断
  if (!level) {
    // 牛津树的书名格式：L1-xxx, L2-xxx
    if (book.name.match(/^L\d+-/i)) {
      type = 'oxford';
      level = book.name.match(/^(L\d+)-/i)?.[1] || 'L1';
    } else {
      // RAZ的书如果没有级别，跳过
      return;
    }
  }
  
  if (mockBooks[type]) {
    // 动态创建级别数组
    if (!mockBooks[type][level]) {
      mockBooks[type][level] = [];
    }
    
    mockBooks[type][level].push({
      id: index + 1,
      title: book.name,
      name: book.name, // 保留原始name属性
      completed: false, // 默认未完成
      resources: ['pdf'], // 默认只有PDF
      tags: book.tags || ['其他']
    });
  }
});

// 计算所有级别的所有绘本
const getAllBooks = (type) => {
  let result = [];
  for (const [level, levelBooks] of Object.entries(mockBooks[type])) {
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

// 计算所有唯一的标签
const getAllTags = (type) => {
  const tagSet = new Set();
  const books = getAllBooks(type);
  books.forEach(book => {
    book.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
};

// 获取标签在所有绘本中的数量
const getTagCount = (type, tag) => {
  const books = getAllBooks(type);
  return books.filter(book => book.tags.includes(tag)).length;
};

// 获取指定级别和标签的绘本
const getFilteredBooks = (type, level, tags = []) => {
  let result = [];

  if (level) {
    result = mockBooks[type][level] || [];
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
      tags.every(tag => book.tags.includes(tag))
    )
  }

  return result
}

// 获取学习进度
const getProgress = (type) => {
  const progress = {}

  for (const [level, levelBooks] of Object.entries(mockBooks[type])) {
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

export default {
  mockBooks,
  getAllBooks,
  getAllTags,
  getTagCount,
  getFilteredBooks,
  getProgress,
  initBookStore
};
