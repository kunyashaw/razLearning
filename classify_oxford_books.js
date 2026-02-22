import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取牛津树绘本数据
const oxfordBooks = JSON.parse(fs.readFileSync(path.join(__dirname, 'oxford_books.json'), 'utf8'));

// 预定义的标签类别
const predefinedTags = [
  '颜色', '数字', '动物', '家庭', '学校', '自然', '食物', '交通工具',
  '天气', '季节', '节日', '情绪', '动作', '身体', '形状', '时间',
  '地点', '职业', '运动', '音乐', '科学', '历史', '艺术', '社交'
];

// 清理书名，去除多余的前缀和后缀
function cleanBookName(bookName) {
  // 去除前缀，如 L1-1【正课】 或 L2-1【磨耳朵】
  let cleanedName = bookName.replace(/^L\d+-?\d+【\w+】/, '');
  // 去除前缀，如 1【正课】 或 2【磨耳朵】
  cleanedName = cleanedName.replace(/^\d+【\w+】/, '');
  // 去除后缀，如 -双语讲解 或 -mp4
  cleanedName = cleanedName.replace(/\s*-?双语讲解/, '');
  cleanedName = cleanedName.replace(/\s*-?mp4/, '');
  // 去除多余的空格
  cleanedName = cleanedName.trim();
  return cleanedName;
}

// 基于关键词匹配生成标签
function generateTagsFallback(bookName) {
  const tags = [];
  const cleanedName = cleanBookName(bookName);
  const lowerName = cleanedName.toLowerCase();
  
  // 基于关键词匹配生成标签
  if (lowerName.includes('color') || lowerName.includes('red') || lowerName.includes('blue') || lowerName.includes('green') || lowerName.includes('yellow') || lowerName.includes('purple') || lowerName.includes('orange') || lowerName.includes('black') || lowerName.includes('white')) {
    tags.push('颜色');
  }
  
  if (lowerName.includes('number') || lowerName.includes('one') || lowerName.includes('two') || lowerName.includes('three') || lowerName.includes('four') || lowerName.includes('five') || lowerName.includes('six') || lowerName.includes('seven') || lowerName.includes('eight') || lowerName.includes('nine') || lowerName.includes('ten') || lowerName.includes('count')) {
    tags.push('数字');
  }
  
  if (lowerName.includes('animal') || lowerName.includes('dog') || lowerName.includes('cat') || lowerName.includes('bird') || lowerName.includes('fish') || lowerName.includes('rabbit') || lowerName.includes('puppy') || lowerName.includes('kitten') || lowerName.includes('floppy') || lowerName.includes('dragon')) {
    tags.push('动物');
  }
  
  if (lowerName.includes('family') || lowerName.includes('mom') || lowerName.includes('dad') || lowerName.includes('brother') || lowerName.includes('sister') || lowerName.includes('grandpa') || lowerName.includes('grandma') || lowerName.includes('mum') || lowerName.includes('kipper') || lowerName.includes('biff')) {
    tags.push('家庭');
  }
  
  if (lowerName.includes('school') || lowerName.includes('teacher') || lowerName.includes('class') || lowerName.includes('student') || lowerName.includes('classroom') || lowerName.includes('book') || lowerName.includes('birthday')) {
    tags.push('学校');
  }
  
  if (lowerName.includes('nature') || lowerName.includes('tree') || lowerName.includes('flower') || lowerName.includes('plant') || lowerName.includes('forest') || lowerName.includes('mountain') || lowerName.includes('river') || lowerName.includes('lake') || lowerName.includes('ocean') || lowerName.includes('beach') || lowerName.includes('weather') || lowerName.includes('fog') || lowerName.includes('sand')) {
    tags.push('自然');
  }
  
  if (lowerName.includes('food') || lowerName.includes('fruit') || lowerName.includes('vegetable') || lowerName.includes('cake') || lowerName.includes('cookie') || lowerName.includes('pizza') || lowerName.includes('ice cream') || lowerName.includes('bread') || lowerName.includes('milk') || lowerName.includes('juice') || lowerName.includes('water')) {
    tags.push('食物');
  }
  
  if (lowerName.includes('car') || lowerName.includes('bus') || lowerName.includes('train') || lowerName.includes('plane') || lowerName.includes('boat') || lowerName.includes('bicycle') || lowerName.includes('truck') || lowerName.includes('ship') || lowerName.includes('subway') || lowerName.includes('go-kart') || lowerName.includes('aeroplane')) {
    tags.push('交通工具');
  }
  
  if (lowerName.includes('weather') || lowerName.includes('sun') || lowerName.includes('rain') || lowerName.includes('snow') || lowerName.includes('wind') || lowerName.includes('cloudy') || lowerName.includes('fog')) {
    tags.push('天气');
  }
  
  if (lowerName.includes('season') || lowerName.includes('spring') || lowerName.includes('summer') || lowerName.includes('fall') || lowerName.includes('autumn') || lowerName.includes('winter')) {
    tags.push('季节');
  }
  
  if (lowerName.includes('holiday') || lowerName.includes('christmas') || lowerName.includes('halloween') || lowerName.includes('easter') || lowerName.includes('thanksgiving') || lowerName.includes('birthday')) {
    tags.push('节日');
  }
  
  if (lowerName.includes('happy') || lowerName.includes('sad') || lowerName.includes('angry') || lowerName.includes('scared') || lowerName.includes('excited') || lowerName.includes('bored') || lowerName.includes('tired') || lowerName.includes('hungry') || lowerName.includes('thirsty') || lowerName.includes('making faces') || lowerName.includes('naughty') || lowerName.includes('poor')) {
    tags.push('情绪');
  }
  
  if (lowerName.includes('run') || lowerName.includes('jump') || lowerName.includes('walk') || lowerName.includes('swim') || lowerName.includes('fly') || lowerName.includes('play') || lowerName.includes('dance') || lowerName.includes('sing') || lowerName.includes('draw') || lowerName.includes('write') || lowerName.includes('read') || lowerName.includes('chase') || lowerName.includes('fight') || lowerName.includes('go away') || lowerName.includes('put it back') || lowerName.includes('water fight') || lowerName.includes('bath') || lowerName.includes('balloon')) {
    tags.push('动作');
  }
  
  if (lowerName.includes('body') || lowerName.includes('head') || lowerName.includes('eye') || lowerName.includes('ear') || lowerName.includes('nose') || lowerName.includes('mouth') || lowerName.includes('hand') || lowerName.includes('foot') || lowerName.includes('arm') || lowerName.includes('leg') || lowerName.includes('hair') || lowerName.includes('face') || lowerName.includes('tooth')) {
    tags.push('身体');
  }
  
  if (lowerName.includes('shape') || lowerName.includes('circle') || lowerName.includes('square') || lowerName.includes('triangle') || lowerName.includes('rectangle') || lowerName.includes('oval') || lowerName.includes('star') || lowerName.includes('heart') || lowerName.includes('spots')) {
    tags.push('形状');
  }
  
  if (lowerName.includes('time') || lowerName.includes('clock') || lowerName.includes('hour') || lowerName.includes('minute') || lowerName.includes('second') || lowerName.includes('morning') || lowerName.includes('afternoon') || lowerName.includes('evening') || lowerName.includes('night') || lowerName.includes('in a bit')) {
    tags.push('时间');
  }
  
  if (lowerName.includes('home') || lowerName.includes('house') || lowerName.includes('school') || lowerName.includes('park') || lowerName.includes('zoo') || lowerName.includes('store') || lowerName.includes('market') || lowerName.includes('library') || lowerName.includes('museum') || lowerName.includes('hospital') || lowerName.includes('restaurant') || lowerName.includes('journey') || lowerName.includes('shopping') || lowerName.includes('beach')) {
    tags.push('地点');
  }
  
  if (lowerName.includes('teacher') || lowerName.includes('doctor') || lowerName.includes('nurse') || lowerName.includes('firefighter') || lowerName.includes('police') || lowerName.includes('chef') || lowerName.includes('farmer') || lowerName.includes('pilot') || lowerName.includes('driver') || lowerName.includes('artist') || lowerName.includes('musician') || lowerName.includes('babysitter')) {
    tags.push('职业');
  }
  
  if (lowerName.includes('play') || lowerName.includes('game') || lowerName.includes('sport') || lowerName.includes('football') || lowerName.includes('basketball') || lowerName.includes('soccer') || lowerName.includes('baseball') || lowerName.includes('tennis') || lowerName.includes('swim') || lowerName.includes('run') || lowerName.includes('jump') || lowerName.includes('goal') || lowerName.includes('go-kart')) {
    tags.push('运动');
  }
  
  if (lowerName.includes('music') || lowerName.includes('song') || lowerName.includes('sing') || lowerName.includes('dance') || lowerName.includes('piano') || lowerName.includes('guitar') || lowerName.includes('drum') || lowerName.includes('flute') || lowerName.includes('band')) {
    tags.push('音乐');
  }
  
  if (lowerName.includes('science') || lowerName.includes('experiment') || lowerName.includes('discovery') || lowerName.includes('invention') || lowerName.includes('planet') || lowerName.includes('star') || lowerName.includes('moon') || lowerName.includes('sun') || lowerName.includes('earth') || lowerName.includes('plant') || lowerName.includes('animal') || lowerName.includes('human') || lowerName.includes('body') || lowerName.includes('health') || lowerName.includes('foggy') || lowerName.includes('creepy-crawly')) {
    tags.push('科学');
  }
  
  if (lowerName.includes('history') || lowerName.includes('past') || lowerName.includes('ancient') || lowerName.includes('old') || lowerName.includes('new') || lowerName.includes('before') || lowerName.includes('after')) {
    tags.push('历史');
  }
  
  if (lowerName.includes('art') || lowerName.includes('draw') || lowerName.includes('paint') || lowerName.includes('sculpt') || lowerName.includes('create') || lowerName.includes('craft') || lowerName.includes('color') || lowerName.includes('design') || lowerName.includes('toy') || lowerName.includes('party')) {
    tags.push('艺术');
  }
  
  if (lowerName.includes('friend') || lowerName.includes('friendship') || lowerName.includes('share') || lowerName.includes('help') || lowerName.includes('care') || lowerName.includes('love') || lowerName.includes('kind') || lowerName.includes('nice') || lowerName.includes('mean') || lowerName.includes('bully') || lowerName.includes('team') || lowerName.includes('group') || lowerName.includes('party') || lowerName.includes('what a mess') || lowerName.includes('who did that') || lowerName.includes('top dog')) {
    tags.push('社交');
  }
  
  // 如果没有匹配的标签，添加一个默认标签
  if (tags.length === 0) {
    tags.push('其他');
  }
  
  // 最多返回3个标签
  return tags.slice(0, 3);
}

// 为所有绘本生成标签
async function classifyAllBooks() {
  console.log('开始对牛津树绘本进行分类...');
  
  const classifiedBooks = [];
  
  for (const book of oxfordBooks) {
    console.log(`正在分类绘本: ${book.name}`);
    const tags = generateTagsFallback(book.name);
    classifiedBooks.push({
      ...book,
      tags: tags,
      cleanedName: cleanBookName(book.name) // 添加清理后的书名
    });
  }
  
  // 保存分类结果
  fs.writeFileSync(
    path.join(__dirname, 'classified_oxford_books.json'),
    JSON.stringify(classifiedBooks, null, 2),
    'utf8'
  );
  
  console.log(`成功为 ${classifiedBooks.length} 本牛津树绘本生成标签`);
  console.log('分类结果已保存到 classified_oxford_books.json 文件');
  
  // 统计标签使用情况
  const tagCount = {};
  classifiedBooks.forEach(book => {
    book.tags.forEach(tag => {
      if (!tagCount[tag]) {
        tagCount[tag] = 0;
      }
      tagCount[tag]++;
    });
  });
  
  console.log('\n标签使用情况:');
  console.log(JSON.stringify(tagCount, null, 2));
  
  // 按级别分组统计
  const groupedStats = {
    oxford: {
      L1: {
        count: 0,
        tags: {}
      },
      L2: {
        count: 0,
        tags: {}
      }
    }
  };
  
  classifiedBooks.forEach(book => {
    if (groupedStats[book.type][book.level]) {
      groupedStats[book.type][book.level].count++;
      
      book.tags.forEach(tag => {
        if (!groupedStats[book.type][book.level].tags[tag]) {
          groupedStats[book.type][book.level].tags[tag] = 0;
        }
        groupedStats[book.type][book.level].tags[tag]++;
      });
    }
  });
  
  console.log('\n按级别分组统计:');
  console.log(JSON.stringify(groupedStats, null, 2));
}

// 执行分类
classifyAllBooks().catch(error => {
  console.error('分类过程中出错:', error);
});
