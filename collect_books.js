import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 收集绘本名称的函数
function collectBooks(directory) {
  const books = [];
  
  function traverse(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      const relativePath = path.relative(directory, fullPath);
      
      if (file.isDirectory()) {
        traverse(fullPath);
      } else if (file.name.endsWith('.pdf')) {
        // 提取绘本名称，去除后缀和可能的密码信息
        let bookName = file.name.replace('.pdf', '');
        bookName = bookName.replace('_Password_Removed', '');
        bookName = bookName.replace('_Password', '');
        bookName = bookName.replace('Passwor', '');
        // 统一格式：将"数字 - 标题"转换为"数字_标题"
        bookName = bookName.replace(/^(\d+)\s*-\s*/, '$1_');
        // 去除多余的空格
        bookName = bookName.replace(/\s+/g, ' ').trim();
        bookName = bookName.trim();
        
        // 确定绘本类型和级别
        let type = 'raz';
        let level = '';
        
        if (relativePath.toLowerCase().includes('oxford')) {
          type = 'oxford';
          if (relativePath.includes('L1')) level = 'L1';
          else if (relativePath.includes('L2')) level = 'L2';
        } else if (relativePath.includes('raz')) {
          // 转换为小写并使用正则表达式匹配，不依赖于路径分隔符
          const lowerPath = relativePath.toLowerCase();
          if (lowerPath.includes('raz' + path.sep + 'aa' + path.sep)) level = 'AA';
          else if (lowerPath.includes('raz' + path.sep + 'a' + path.sep)) level = 'A';
          else if (lowerPath.includes('raz' + path.sep + 'b' + path.sep)) level = 'B';
          else if (lowerPath.includes('raz' + path.sep + 'c' + path.sep)) level = 'C';
          else if (lowerPath.includes('raz' + path.sep + 'd' + path.sep)) level = 'D';
        }
        
        books.push({
          name: bookName,
          type: type,
          level: level,
          path: fullPath,
          relativePath: relativePath
        });
      }
    }
  }
  
  traverse(directory);
  return books;
}

// 收集绘本
const resourcesDir = path.join(__dirname, 'myBooks');
const books = collectBooks(resourcesDir);

// 保存到文件
fs.writeFileSync(
  path.join(__dirname, 'books.json'),
  JSON.stringify(books, null, 2),
  'utf8'
);

console.log(`收集到 ${books.length} 本绘本`);
console.log('绘本数据已保存到 books.json 文件');

// 按类型和级别分组
const groupedBooks = {
  raz: {},
  oxford: {}
};

books.forEach(book => {
  if (!groupedBooks[book.type][book.level]) {
    groupedBooks[book.type][book.level] = [];
  }
  groupedBooks[book.type][book.level].push(book.name);
});

console.log('\n按类型和级别分组:');
console.log(JSON.stringify(groupedBooks, null, 2));
