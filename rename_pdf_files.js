import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 主目录路径
const baseDir = path.join(__dirname, 'myBooks', 'raz'); // 现在直接指向raz目录，因为PDF文件现在位于各级别子目录中

// 遍历目录函数
function traverseDirectory(dir) {
  console.log(`正在处理目录: ${dir}`);
  
  // 读取目录内容
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      // 如果是目录，递归处理
      traverseDirectory(filePath);
    } else if (stats.isFile() && path.extname(file).toLowerCase() === '.pdf') {
      // 如果是PDF文件，重命名
      renamePdfFile(dir, file);
    }
  });
}

// 重命名PDF文件函数
function renamePdfFile(dir, oldFileName) {
  try {
    // 提取编号和名称
    let number = '';
    let name = '';
    let hasNumber = false;
    
    // 尝试匹配各种格式的文件名
    
    // 格式1: 数字开头，后面跟各种分隔符和名称
    let match = oldFileName.match(/^(\d+)[\.-_\s]*(.*?)(_Password_Removed|_Password|\.)?\.pdf$/i);
    
    if (match) {
      number = match[1];
      name = match[2];
      hasNumber = true;
    } else {
      // 格式2: 没有数字编号，直接提取名称
      match = oldFileName.match(/^(.*?)(_Password_Removed|_Password|\.)?\.pdf$/i);
      if (match) {
        name = match[1];
        hasNumber = false;
      } else {
        console.log(`无法匹配文件名格式: ${oldFileName}`);
        return;
      }
    }
    
    // 清理名称：去除特殊字符，替换空格为下划线
    name = name
      .replace(/[^a-zA-Z0-9\s]/g, '') // 只保留字母、数字和空格
      .replace(/\s+/g, '_') // 将空格替换为下划线
      .replace(/_+/g, '_') // 去除连续的下划线
      .trim() // 去除首尾空格
      .toLowerCase(); // 转换为小写
    
    // 如果名称为空，尝试从原始文件名中提取
    if (!name) {
      // 尝试直接使用原始文件名（去除扩展名和密码后缀）
      name = oldFileName
        .replace(/(_Password_Removed|_Password|\.)?\.pdf$/i, '')
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .replace(/_+/g, '_')
        .trim()
        .toLowerCase();
    }
    
    // 确保名称不为空
    if (!name) {
      console.log(`文件名称为空: ${oldFileName}`);
      return;
    }
    
    // 生成新文件名
    let newFileName;
    if (hasNumber) {
      // 有编号的文件：编号_名称.pdf
      newFileName = `${number.padStart(2, '0')}_${name}.pdf`;
    } else {
      // 没有编号的文件：名称.pdf
      newFileName = `${name}.pdf`;
    }
    
    const oldFilePath = path.join(dir, oldFileName);
    const newFilePath = path.join(dir, newFileName);
    
    // 检查新文件名是否已存在
    if (fs.existsSync(newFilePath) && oldFilePath !== newFilePath) {
      // 如果新文件名已存在，添加一个随机数
      const randomSuffix = Math.floor(Math.random() * 1000);
      newFileName = hasNumber 
        ? `${number.padStart(2, '0')}_${name}_${randomSuffix}.pdf`
        : `${name}_${randomSuffix}.pdf`;
    }
    
    // 重命名文件
    fs.renameSync(oldFilePath, newFilePath);
    console.log(`重命名: ${oldFileName} -> ${newFileName}`);
    
  } catch (error) {
    console.error(`重命名文件时出错: ${oldFileName}`, error);
  }
}

// 开始执行
console.log('开始重命名RAZ PDF文件...');
traverseDirectory(baseDir);
console.log('重命名完成！');

