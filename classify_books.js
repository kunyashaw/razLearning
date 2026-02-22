import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取绘本数据
const books = JSON.parse(fs.readFileSync(path.join(__dirname, 'books.json'), 'utf8'));

// 预定义的标签类别
const predefinedTags = [
  '颜色', '数字', '动物', '家庭', '学校', '自然', '食物', '交通工具',
  '天气', '季节', '节日', '情绪', '动作', '身体', '形状', '时间',
  '地点', '职业', '运动', '音乐', '科学', '历史', '艺术', '社交'
];

// 使用大模型为绘本生成标签的函数
async function generateTagsWithLLM(bookName) {
  try {
    // 构建请求数据
    const requestData = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `你是一个儿童绘本分类专家，请根据绘本名称为其分配最相关的标签。标签必须从以下列表中选择：${predefinedTags.join('、')}。每个绘本最多分配3个标签，按照相关性从高到低排列。如果没有相关标签，请返回['其他']。只返回标签数组，不要包含其他文字。`
        },
        {
          role: "user",
          content: `请为绘本《${bookName}》分配标签。`
        }
      ],
      max_tokens: 100,
      temperature: 0.3
    };

    // 发送请求到大模型API
    // 注意：这里使用了一个模拟的API路径，实际使用时需要替换为真实的API地址
    // 由于是模拟环境，我们使用关键词匹配作为备选方案
    // const response = await fetch('https://api.openai.com/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    //   },
    //   body: JSON.stringify(requestData)
    // });
    
    // const data = await response.json();
    // const tags = JSON.parse(data.choices[0].message.content.trim());
    // return tags;

    // 模拟大模型分类结果（实际项目中应替换为真实API调用）
    return generateTagsFallback(bookName);
  } catch (error) {
    console.error(`分类绘本 ${bookName} 时出错:`, error);
    // 出错时使用备选方案
    return generateTagsFallback(bookName);
  }
}

// 备选方案：基于关键词匹配生成标签
function generateTagsFallback(bookName) {
  const tags = [];
  const lowerName = bookName.toLowerCase();
  
  // 基于关键词匹配生成标签
  if (lowerName.includes('color') || lowerName.includes('red') || lowerName.includes('blue') || lowerName.includes('green') || lowerName.includes('yellow') || lowerName.includes('purple') || lowerName.includes('orange') || lowerName.includes('black') || lowerName.includes('white')) {
    tags.push('颜色');
  }
  
  if (lowerName.includes('number') || lowerName.includes('one') || lowerName.includes('two') || lowerName.includes('three') || lowerName.includes('four') || lowerName.includes('five') || lowerName.includes('six') || lowerName.includes('seven') || lowerName.includes('eight') || lowerName.includes('nine') || lowerName.includes('ten') || lowerName.includes('count')) {
    tags.push('数字');
  }
  
  if (lowerName.includes('animal') || lowerName.includes('dog') || lowerName.includes('cat') || lowerName.includes('bird') || lowerName.includes('fish') || lowerName.includes('rabbit') || lowerName.includes('puppy') || lowerName.includes('kitten') || lowerName.includes('turtle') || lowerName.includes('frog') || lowerName.includes('snake') || lowerName.includes('lion') || lowerName.includes('tiger') || lowerName.includes('elephant') || lowerName.includes('monkey')) {
    tags.push('动物');
  }
  
  if (lowerName.includes('family') || lowerName.includes('mom') || lowerName.includes('dad') || lowerName.includes('brother') || lowerName.includes('sister') || lowerName.includes('grandpa') || lowerName.includes('grandma') || lowerName.includes('parent') || lowerName.includes('child')) {
    tags.push('家庭');
  }
  
  if (lowerName.includes('school') || lowerName.includes('teacher') || lowerName.includes('class') || lowerName.includes('student') || lowerName.includes('classroom') || lowerName.includes('book') || lowerName.includes('pencil') || lowerName.includes('desk') || lowerName.includes('homework')) {
    tags.push('学校');
  }
  
  if (lowerName.includes('nature') || lowerName.includes('tree') || lowerName.includes('flower') || lowerName.includes('plant') || lowerName.includes('forest') || lowerName.includes('mountain') || lowerName.includes('river') || lowerName.includes('lake') || lowerName.includes('ocean') || lowerName.includes('beach') || lowerName.includes('sky') || lowerName.includes('cloud')) {
    tags.push('自然');
  }
  
  if (lowerName.includes('food') || lowerName.includes('fruit') || lowerName.includes('vegetable') || lowerName.includes('cake') || lowerName.includes('cookie') || lowerName.includes('pizza') || lowerName.includes('ice cream') || lowerName.includes('bread') || lowerName.includes('milk') || lowerName.includes('juice') || lowerName.includes('water')) {
    tags.push('食物');
  }
  
  if (lowerName.includes('car') || lowerName.includes('bus') || lowerName.includes('train') || lowerName.includes('plane') || lowerName.includes('boat') || lowerName.includes('bicycle') || lowerName.includes('truck') || lowerName.includes('ship') || lowerName.includes('subway')) {
    tags.push('交通工具');
  }
  
  if (lowerName.includes('weather') || lowerName.includes('sun') || lowerName.includes('rain') || lowerName.includes('snow') || lowerName.includes('wind') || lowerName.includes('cloudy') || lowerName.includes('storm') || lowerName.includes('fog')) {
    tags.push('天气');
  }
  
  if (lowerName.includes('season') || lowerName.includes('spring') || lowerName.includes('summer') || lowerName.includes('fall') || lowerName.includes('autumn') || lowerName.includes('winter')) {
    tags.push('季节');
  }
  
  if (lowerName.includes('holiday') || lowerName.includes('christmas') || lowerName.includes('halloween') || lowerName.includes('easter') || lowerName.includes('thanksgiving') || lowerName.includes('birthday')) {
    tags.push('节日');
  }
  
  if (lowerName.includes('happy') || lowerName.includes('sad') || lowerName.includes('angry') || lowerName.includes('scared') || lowerName.includes('excited') || lowerName.includes('bored') || lowerName.includes('tired') || lowerName.includes('hungry') || lowerName.includes('thirsty')) {
    tags.push('情绪');
  }
  
  if (lowerName.includes('run') || lowerName.includes('jump') || lowerName.includes('walk') || lowerName.includes('swim') || lowerName.includes('fly') || lowerName.includes('play') || lowerName.includes('dance') || lowerName.includes('sing') || lowerName.includes('draw') || lowerName.includes('write') || lowerName.includes('read')) {
    tags.push('动作');
  }
  
  if (lowerName.includes('body') || lowerName.includes('head') || lowerName.includes('eye') || lowerName.includes('ear') || lowerName.includes('nose') || lowerName.includes('mouth') || lowerName.includes('hand') || lowerName.includes('foot') || lowerName.includes('arm') || lowerName.includes('leg') || lowerName.includes('hair') || lowerName.includes('face')) {
    tags.push('身体');
  }
  
  if (lowerName.includes('shape') || lowerName.includes('circle') || lowerName.includes('square') || lowerName.includes('triangle') || lowerName.includes('rectangle') || lowerName.includes('oval') || lowerName.includes('star') || lowerName.includes('heart')) {
    tags.push('形状');
  }
  
  if (lowerName.includes('time') || lowerName.includes('clock') || lowerName.includes('hour') || lowerName.includes('minute') || lowerName.includes('second') || lowerName.includes('morning') || lowerName.includes('afternoon') || lowerName.includes('evening') || lowerName.includes('night')) {
    tags.push('时间');
  }
  
  if (lowerName.includes('home') || lowerName.includes('house') || lowerName.includes('school') || lowerName.includes('park') || lowerName.includes('zoo') || lowerName.includes('store') || lowerName.includes('market') || lowerName.includes('library') || lowerName.includes('museum') || lowerName.includes('hospital') || lowerName.includes('restaurant')) {
    tags.push('地点');
  }
  
  if (lowerName.includes('teacher') || lowerName.includes('doctor') || lowerName.includes('nurse') || lowerName.includes('firefighter') || lowerName.includes('police') || lowerName.includes('chef') || lowerName.includes('farmer') || lowerName.includes('pilot') || lowerName.includes('driver') || lowerName.includes('artist') || lowerName.includes('musician')) {
    tags.push('职业');
  }
  
  if (lowerName.includes('play') || lowerName.includes('game') || lowerName.includes('sport') || lowerName.includes('football') || lowerName.includes('basketball') || lowerName.includes('soccer') || lowerName.includes('baseball') || lowerName.includes('tennis') || lowerName.includes('swim') || lowerName.includes('run') || lowerName.includes('jump')) {
    tags.push('运动');
  }
  
  if (lowerName.includes('music') || lowerName.includes('song') || lowerName.includes('sing') || lowerName.includes('dance') || lowerName.includes('piano') || lowerName.includes('guitar') || lowerName.includes('drum') || lowerName.includes('flute') || lowerName.includes('band')) {
    tags.push('音乐');
  }
  
  if (lowerName.includes('science') || lowerName.includes('experiment') || lowerName.includes('discovery') || lowerName.includes('invention') || lowerName.includes('planet') || lowerName.includes('star') || lowerName.includes('moon') || lowerName.includes('sun') || lowerName.includes('earth') || lowerName.includes('plant') || lowerName.includes('animal') || lowerName.includes('human') || lowerName.includes('body') || lowerName.includes('health')) {
    tags.push('科学');
  }
  
  if (lowerName.includes('history') || lowerName.includes('past') || lowerName.includes('ancient') || lowerName.includes('old') || lowerName.includes('new') || lowerName.includes('before') || lowerName.includes('after')) {
    tags.push('历史');
  }
  
  if (lowerName.includes('art') || lowerName.includes('draw') || lowerName.includes('paint') || lowerName.includes('sculpt') || lowerName.includes('create') || lowerName.includes('craft') || lowerName.includes('color') || lowerName.includes('design')) {
    tags.push('艺术');
  }
  
  if (lowerName.includes('friend') || lowerName.includes('friendship') || lowerName.includes('share') || lowerName.includes('help') || lowerName.includes('care') || lowerName.includes('love') || lowerName.includes('kind') || lowerName.includes('nice') || lowerName.includes('mean') || lowerName.includes('bully') || lowerName.includes('team') || lowerName.includes('group')) {
    tags.push('社交');
  }
  
  if (lowerName.includes('weather') || lowerName.includes('rain') || lowerName.includes('snow') || lowerName.includes('sun') || lowerName.includes('wind') || lowerName.includes('cloud')) {
    tags.push('天气');
  }
  
  if (lowerName.includes('spring') || lowerName.includes('summer') || lowerName.includes('fall') || lowerName.includes('autumn') || lowerName.includes('winter')) {
    tags.push('季节');
  }
  
  if (lowerName.includes('christmas') || lowerName.includes('halloween') || lowerName.includes('easter') || lowerName.includes('thanksgiving') || lowerName.includes('valentine') || lowerName.includes('birthday')) {
    tags.push('节日');
  }
  
  // 如果没有匹配的标签，添加一个默认标签
  if (tags.length === 0) {
    tags.push('其他');
  }
  
  // 最多返回3个标签
  return tags.slice(0, 3);
}

// 为所有绘本生成标签的异步函数
async function classifyAllBooks() {
  console.log('开始使用大模型对绘本进行分类...');
  
  const classifiedBooks = [];
  
  for (const book of books) {
    console.log(`正在分类绘本: ${book.name}`);
    const tags = await generateTagsWithLLM(book.name);
    classifiedBooks.push({
      ...book,
      tags: tags
    });
  }
  
  // 保存分类结果
  fs.writeFileSync(
    path.join(__dirname, 'classified_books.json'),
    JSON.stringify(classifiedBooks, null, 2),
    'utf8'
  );
  
  console.log(`成功为 ${classifiedBooks.length} 本绘本生成标签`);
  console.log('分类结果已保存到 classified_books.json 文件');
  
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
  
  // 按类型和级别分组统计
  const groupedStats = {
    raz: {},
    oxford: {}
  };
  
  classifiedBooks.forEach(book => {
    if (!groupedStats[book.type][book.level]) {
      groupedStats[book.type][book.level] = {
        count: 0,
        tags: {}
      };
    }
    
    groupedStats[book.type][book.level].count++;
    
    book.tags.forEach(tag => {
      if (!groupedStats[book.type][book.level].tags[tag]) {
        groupedStats[book.type][book.level].tags[tag] = 0;
      }
      groupedStats[book.type][book.level].tags[tag]++;
    });
  });
  
  console.log('\n按类型和级别分组统计:');
  console.log(JSON.stringify(groupedStats, null, 2));
}

// 执行分类
classifyAllBooks().catch(error => {
  console.error('分类过程中出错:', error);
});
