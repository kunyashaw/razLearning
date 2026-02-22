import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 标准化字符串（用于匹配，只保留字母数字）
 */
function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * 从PDF文件名提取信息
 * 格式: 01_The Toy's Party.pdf -> { serial: '01', name: "The Toy's Party" }
 */
function parsePdfName(filename) {
  const match = filename.match(/^(\d+)_(.+)\.pdf$/i);
  if (!match) return null;
  return {
    serial: match[1],
    name: match[2].trim()
  };
}

/**
 * 匹配音视频文件
 * 规则: 音视频文件名必须包含PDF的书名（忽略空格和特殊字符）
 */
function matchMediaFiles(pdfName, mediaFiles) {
  const normalizedPdfName = normalize(pdfName);
  const matches = [];
  
  for (const file of mediaFiles) {
    // 移除扩展名和序号前缀(如 01_)
    const fileWithoutExt = file.replace(/\.[^.]+$/, '');
    const fileNameMatch = fileWithoutExt.match(/^\d+_(.+)$/);
    const fileBaseName = fileNameMatch ? fileNameMatch[1] : fileWithoutExt;
    
    // 标准化文件名用于匹配
    const normalizedFileName = normalize(fileBaseName);
    
    // 检查是否匹配（PDF书名是否出现在文件名中）
    if (normalizedFileName.includes(normalizedPdfName) || 
        normalizedPdfName.includes(normalizedFileName)) {
      matches.push(file);
    }
  }
  
  return matches;
}

/**
 * 分类音视频：双语讲解 vs 磨耳朵
 */
function classifyMedia(fileName) {
  // 双语讲解特征
  if (fileName.includes('双语讲解') || fileName.includes('讲解')) {
    return 'bilingual';
  }
  // 磨耳朵（没有讲解标识）
  return 'earTraining';
}

/**
 * 重新组织Oxford数据 - 精确匹配实际文件
 */
function reorganizeOxfordData() {
  const oxfordDir = path.join(__dirname, 'myBooks', 'oxford');
  const books = [];
  
  // 获取所有级别目录
  const levelDirs = fs.readdirSync(oxfordDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name.match(/^L\d+$/))
    .map(dirent => dirent.name)
    .sort();
  
  console.log(`发现级别目录: ${levelDirs.join(', ')}\n`);
  
  for (const level of levelDirs) {
    const levelPath = path.join(oxfordDir, level);
    const pdfDir = path.join(levelPath, 'pdf');
    const audioDir = path.join(levelPath, 'audio');
    const videoDir = path.join(levelPath, 'video');
    
    if (!fs.existsSync(pdfDir)) {
      console.log(`跳过 ${level}: PDF目录不存在`);
      continue;
    }
    
    // 读取该级别所有PDF
    const pdfFiles = fs.readdirSync(pdfDir)
      .filter(file => file.endsWith('.pdf'))
      .sort();
    
    // 读取该级别所有音视频
    const audioFiles = fs.existsSync(audioDir) 
      ? fs.readdirSync(audioDir).filter(f => f.endsWith('.mp3'))
      : [];
    const videoFiles = fs.existsSync(videoDir)
      ? fs.readdirSync(videoDir).filter(f => f.endsWith('.mp4'))
      : [];
    
    console.log(`\n处理 ${level}:`);
    console.log(`  PDF: ${pdfFiles.length} 个`);
    console.log(`  音频: ${audioFiles.length} 个`);
    console.log(`  视频: ${videoFiles.length} 个\n`);
    
    for (const pdfFile of pdfFiles) {
      const pdfInfo = parsePdfName(pdfFile);
      if (!pdfInfo) {
        console.log(`  ⚠️ 无法解析PDF: ${pdfFile}`);
        continue;
      }
      
      const { serial, name } = pdfInfo;
      const bookId = `${level}-${serial}`;
      
      // 匹配音视频
      const matchedAudios = matchMediaFiles(name, audioFiles);
      const matchedVideos = matchMediaFiles(name, videoFiles);
      
      // 构建资源对象
      const book = {
        id: bookId,
        name: name,
        type: 'oxford',
        level: level,
        serialNumber: parseInt(serial),
        pdf: {
          filename: pdfFile,
          path: path.join(pdfDir, pdfFile),
          relativePath: path.join('oxford', level, 'pdf', pdfFile).replace(/\\/g, '/')
        },
        audios: {
          bilingual: [],
          earTraining: []
        },
        videos: {
          bilingual: [],
          earTraining: []
        },
        resources: ['pdf']
      };
      
      // 处理音频
      matchedAudios.forEach(audioFile => {
        const type = classifyMedia(audioFile);
        book.audios[type].push({
          filename: audioFile,
          path: path.join(audioDir, audioFile),
          relativePath: path.join('oxford', level, 'audio', audioFile).replace(/\\/g, '/')
        });
      });
      
      // 处理视频
      matchedVideos.forEach(videoFile => {
        const type = classifyMedia(videoFile);
        book.videos[type].push({
          filename: videoFile,
          path: path.join(videoDir, videoFile),
          relativePath: path.join('oxford', level, 'video', videoFile).replace(/\\/g, '/')
        });
      });
      
      // 更新资源列表
      if (book.audios.bilingual.length > 0 || book.audios.earTraining.length > 0) {
        book.resources.push('audio');
      }
      if (book.videos.bilingual.length > 0 || book.videos.earTraining.length > 0) {
        book.resources.push('video');
      }
      
      // 统计
      const audioCount = book.audios.bilingual.length + book.audios.earTraining.length;
      const videoCount = book.videos.bilingual.length + book.videos.earTraining.length;
      
      console.log(`  ✓ ${bookId} - ${name}`);
      console.log(`    音频: ${audioCount} 个 (${book.audios.bilingual.length}双语/${book.audios.earTraining.length}磨耳)`);
      console.log(`    视频: ${videoCount} 个 (${book.videos.bilingual.length}双语/${book.videos.earTraining.length}磨耳)`);
      
      books.push(book);
    }
  }
  
  // 保存数据
  const outputPath = path.join(__dirname, 'oxford_books.json');
  fs.writeFileSync(outputPath, JSON.stringify(books, null, 2), 'utf8');
  
  console.log(`\n✅ 完成！共整理 ${books.length} 本书`);
  console.log(`📁 数据已保存到: ${outputPath}`);
  
  // 统计摘要
  const stats = {
    L1: { count: 0, audio: 0, video: 0 },
    L2: { count: 0, audio: 0, video: 0 }
  };
  
  books.forEach(book => {
    if (stats[book.level]) {
      stats[book.level].count++;
      stats[book.level].audio += book.audios.bilingual.length + book.audios.earTraining.length;
      stats[book.level].video += book.videos.bilingual.length + book.videos.earTraining.length;
    }
  });
  
  console.log('\n📊 统计摘要:');
  for (const [level, data] of Object.entries(stats)) {
    console.log(`   ${level}: ${data.count} 本, ${data.audio} 音频, ${data.video} 视频`);
  }
  
  return books;
}

// 执行
reorganizeOxfordData();
