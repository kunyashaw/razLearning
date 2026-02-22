/**
 * 根据书名返回对应的emoji图标
 * 让孩子一眼就能看懂绘本主题
 */
export function getBookEmoji(title) {
  const lowerTitle = title.toLowerCase();
  
  // 动物类
  if (lowerTitle.includes('dog') || lowerTitle.includes('puppy') || lowerTitle.includes('floppy')) {
    return '🐕';
  }
  if (lowerTitle.includes('cat') || lowerTitle.includes('kitten') || lowerTitle.includes('kitty')) {
    return '🐱';
  }
  if (lowerTitle.includes('bird')) {
    return '🐦';
  }
  if (lowerTitle.includes('fish')) {
    return '🐟';
  }
  if (lowerTitle.includes('rabbit') || lowerTitle.includes('bunny')) {
    return '🐰';
  }
  if (lowerTitle.includes('bear')) {
    return '🐻';
  }
  if (lowerTitle.includes('elephant')) {
    return '🐘';
  }
  if (lowerTitle.includes('lion')) {
    return '🦁';
  }
  if (lowerTitle.includes('monkey')) {
    return '🐵';
  }
  if (lowerTitle.includes('frog')) {
    return '🐸';
  }
  if (lowerTitle.includes('duck')) {
    return '🦆';
  }
  if (lowerTitle.includes('chicken') || lowerTitle.includes('hen')) {
    return '🐔';
  }
  if (lowerTitle.includes('pig')) {
    return '🐷';
  }
  if (lowerTitle.includes('cow')) {
    return '🐮';
  }
  if (lowerTitle.includes('horse')) {
    return '🐴';
  }
  if (lowerTitle.includes('sheep')) {
    return '🐑';
  }
  if (lowerTitle.includes('mouse') || lowerTitle.includes('rat')) {
    return '🐭';
  }
  if (lowerTitle.includes('dragon')) {
    return '🐲';
  }
  if (lowerTitle.includes('dinosaur')) {
    return '🦕';
  }
  if (lowerTitle.includes('butterfly')) {
    return '🦋';
  }
  if (lowerTitle.includes('bee')) {
    return '🐝';
  }
  if (lowerTitle.includes('spider')) {
    return '🕷️';
  }
  if (lowerTitle.includes('snake')) {
    return '🐍';
  }
  if (lowerTitle.includes('turtle')) {
    return '🐢';
  }
  
  // 食物类
  if (lowerTitle.includes('apple')) {
    return '🍎';
  }
  if (lowerTitle.includes('banana')) {
    return '🍌';
  }
  if (lowerTitle.includes('orange')) {
    return '🍊';
  }
  if (lowerTitle.includes('grape')) {
    return '🍇';
  }
  if (lowerTitle.includes('watermelon')) {
    return '🍉';
  }
  if (lowerTitle.includes('strawberry')) {
    return '🍓';
  }
  if (lowerTitle.includes('cherry')) {
    return '🍒';
  }
  if (lowerTitle.includes('peach')) {
    return '🍑';
  }
  if (lowerTitle.includes('pear')) {
    return '🍐';
  }
  if (lowerTitle.includes('lemon')) {
    return '🍋';
  }
  if (lowerTitle.includes('pineapple')) {
    return '🍍';
  }
  if (lowerTitle.includes('carrot')) {
    return '🥕';
  }
  if (lowerTitle.includes('broccoli')) {
    return '🥦';
  }
  if (lowerTitle.includes('corn')) {
    return '🌽';
  }
  if (lowerTitle.includes('pizza')) {
    return '🍕';
  }
  if (lowerTitle.includes('burger') || lowerTitle.includes('hamburger')) {
    return '🍔';
  }
  if (lowerTitle.includes('hot dog')) {
    return '🌭';
  }
  if (lowerTitle.includes('sandwich')) {
    return '🥪';
  }
  if (lowerTitle.includes('taco')) {
    return '🌮';
  }
  if (lowerTitle.includes('sushi')) {
    return '🍣';
  }
  if (lowerTitle.includes('ice cream')) {
    return '🍦';
  }
  if (lowerTitle.includes('cake')) {
    return '🎂';
  }
  if (lowerTitle.includes('cookie')) {
    return '🍪';
  }
  if (lowerTitle.includes('chocolate')) {
    return '🍫';
  }
  if (lowerTitle.includes('candy')) {
    return '🍬';
  }
  if (lowerTitle.includes('popcorn')) {
    return '🍿';
  }
  if (lowerTitle.includes('egg')) {
    return '🥚';
  }
  if (lowerTitle.includes('bread')) {
    return '🍞';
  }
  if (lowerTitle.includes('cheese')) {
    return '🧀';
  }
  if (lowerTitle.includes('milk')) {
    return '🥛';
  }
  if (lowerTitle.includes('juice')) {
    return '🧃';
  }
  if (lowerTitle.includes('water')) {
    return '💧';
  }
  
  // 交通工具
  if (lowerTitle.includes('car')) {
    return '🚗';
  }
  if (lowerTitle.includes('bus')) {
    return '🚌';
  }
  if (lowerTitle.includes('train')) {
    return '🚂';
  }
  if (lowerTitle.includes('plane') || lowerTitle.includes('airplane') || lowerTitle.includes('aeroplane')) {
    return '✈️';
  }
  if (lowerTitle.includes('boat') || lowerTitle.includes('ship')) {
    return '🚢';
  }
  if (lowerTitle.includes('bike') || lowerTitle.includes('bicycle')) {
    return '🚲';
  }
  if (lowerTitle.includes('truck')) {
    return '🚚';
  }
  if (lowerTitle.includes('helicopter')) {
    return '🚁';
  }
  if (lowerTitle.includes('rocket')) {
    return '🚀';
  }
  if (lowerTitle.includes('fire truck')) {
    return '🚒';
  }
  if (lowerTitle.includes('police')) {
    return '🚓';
  }
  if (lowerTitle.includes('ambulance')) {
    return '🚑';
  }
  if (lowerTitle.includes('taxi')) {
    return '🚕';
  }
  
  // 天气
  if (lowerTitle.includes('sun') || lowerTitle.includes('sunny')) {
    return '☀️';
  }
  if (lowerTitle.includes('rain') || lowerTitle.includes('rainy')) {
    return '🌧️';
  }
  if (lowerTitle.includes('snow') || lowerTitle.includes('snowy')) {
    return '❄️';
  }
  if (lowerTitle.includes('cloud')) {
    return '☁️';
  }
  if (lowerTitle.includes('wind') || lowerTitle.includes('windy')) {
    return '💨';
  }
  if (lowerTitle.includes('storm') || lowerTitle.includes('thunder')) {
    return '⛈️';
  }
  if (lowerTitle.includes('rainbow')) {
    return '🌈';
  }
  if (lowerTitle.includes('fog') || lowerTitle.includes('foggy')) {
    return '🌫️';
  }
  
  // 自然
  if (lowerTitle.includes('tree')) {
    return '🌳';
  }
  if (lowerTitle.includes('flower')) {
    return '🌸';
  }
  if (lowerTitle.includes('rose')) {
    return '🌹';
  }
  if (lowerTitle.includes('sunflower')) {
    return '🌻';
  }
  if (lowerTitle.includes('leaf')) {
    return '🍃';
  }
  if (lowerTitle.includes('mountain')) {
    return '⛰️';
  }
  if (lowerTitle.includes('beach') || lowerTitle.includes('sand')) {
    return '🏖️';
  }
  if (lowerTitle.includes('ocean') || lowerTitle.includes('sea')) {
    return '🌊';
  }
  if (lowerTitle.includes('forest')) {
    return '🌲';
  }
  if (lowerTitle.includes('desert')) {
    return '🏜️';
  }
  if (lowerTitle.includes('volcano')) {
    return '🌋';
  }
  if (lowerTitle.includes('moon')) {
    return '🌙';
  }
  if (lowerTitle.includes('star')) {
    return '⭐';
  }
  
  // 家庭/人物
  if (lowerTitle.includes('mom') || lowerTitle.includes('mum') || lowerTitle.includes('mother')) {
    return '👩';
  }
  if (lowerTitle.includes('dad') || lowerTitle.includes('father')) {
    return '👨';
  }
  if (lowerTitle.includes('baby')) {
    return '👶';
  }
  if (lowerTitle.includes('family')) {
    return '👨‍👩‍👧‍👦';
  }
  if (lowerTitle.includes('friend')) {
    return '👫';
  }
  if (lowerTitle.includes('teacher')) {
    return '👩‍🏫';
  }
  if (lowerTitle.includes('doctor')) {
    return '👨‍⚕️';
  }
  if (lowerTitle.includes('police')) {
    return '👮';
  }
  if (lowerTitle.includes('firefighter')) {
    return '👨‍🚒';
  }
  if (lowerTitle.includes('cook') || lowerTitle.includes('chef')) {
    return '👨‍🍳';
  }
  if (lowerTitle.includes('artist')) {
    return '👨‍🎨';
  }
  if (lowerTitle.includes('musician')) {
    return '👨‍🎤';
  }
  if (lowerTitle.includes('farmer')) {
    return '👨‍🌾';
  }
  if (lowerTitle.includes('worker')) {
    return '👷';
  }
  if (lowerTitle.includes('scientist')) {
    return '👨‍🔬';
  }
  if (lowerTitle.includes('astronaut')) {
    return '👨‍🚀';
  }
  
  // 学校/学习
  if (lowerTitle.includes('school')) {
    return '🏫';
  }
  if (lowerTitle.includes('book')) {
    return '📚';
  }
  if (lowerTitle.includes('pencil')) {
    return '✏️';
  }
  if (lowerTitle.includes('pen')) {
    return '🖊️';
  }
  if (lowerTitle.includes('crayon')) {
    return '🖍️';
  }
  if (lowerTitle.includes('paint') || lowerTitle.includes('draw')) {
    return '🎨';
  }
  if (lowerTitle.includes('scissors')) {
    return '✂️';
  }
  if (lowerTitle.includes('ruler')) {
    return '📏';
  }
  if (lowerTitle.includes('backpack') || lowerTitle.includes('bag')) {
    return '🎒';
  }
  if (lowerTitle.includes('computer')) {
    return '💻';
  }
  if (lowerTitle.includes('clock')) {
    return '⏰';
  }
  if (lowerTitle.includes('calendar')) {
    return '📅';
  }
  
  // 运动
  if (lowerTitle.includes('ball')) {
    return '⚽';
  }
  if (lowerTitle.includes('basketball')) {
    return '🏀';
  }
  if (lowerTitle.includes('football') || lowerTitle.includes('soccer')) {
    return '⚽';
  }
  if (lowerTitle.includes('baseball')) {
    return '⚾';
  }
  if (lowerTitle.includes('tennis')) {
    return '🎾';
  }
  if (lowerTitle.includes('golf')) {
    return '⛳';
  }
  if (lowerTitle.includes('swim')) {
    return '🏊';
  }
  if (lowerTitle.includes('run')) {
    return '🏃';
  }
  if (lowerTitle.includes('dance')) {
    return '💃';
  }
  if (lowerTitle.includes('gym') || lowerTitle.includes('exercise')) {
    return '🏋️';
  }
  if (lowerTitle.includes('game')) {
    return '🎮';
  }
  if (lowerTitle.includes('toy')) {
    return '🧸';
  }
  if (lowerTitle.includes('kite')) {
    return '🪁';
  }
  if (lowerTitle.includes('slide')) {
    return '🛝';
  }
  if (lowerTitle.includes('swing')) {
    return '🎪';
  }
  
  // 音乐
  if (lowerTitle.includes('music')) {
    return '🎵';
  }
  if (lowerTitle.includes('song') || lowerTitle.includes('sing')) {
    return '🎤';
  }
  if (lowerTitle.includes('guitar')) {
    return '🎸';
  }
  if (lowerTitle.includes('piano')) {
    return '🎹';
  }
  if (lowerTitle.includes('drum')) {
    return '🥁';
  }
  if (lowerTitle.includes('trumpet')) {
    return '🎺';
  }
  if (lowerTitle.includes('violin')) {
    return '🎻';
  }
  if (lowerTitle.includes('flute')) {
    return '🪈';
  }
  if (lowerTitle.includes('band')) {
    return '🎷';
  }
  
  // 身体部位
  if (lowerTitle.includes('head')) {
    return '🗣️';
  }
  if (lowerTitle.includes('eye')) {
    return '👁️';
  }
  if (lowerTitle.includes('ear')) {
    return '👂';
  }
  if (lowerTitle.includes('nose')) {
    return '👃';
  }
  if (lowerTitle.includes('mouth')) {
    return '👄';
  }
  if (lowerTitle.includes('hand')) {
    return '✋';
  }
  if (lowerTitle.includes('foot') || lowerTitle.includes('feet')) {
    return '🦶';
  }
  if (lowerTitle.includes('hair')) {
    return '💇';
  }
  if (lowerTitle.includes('tooth') || lowerTitle.includes('teeth')) {
    return '🦷';
  }
  if (lowerTitle.includes('face')) {
    return '😊';
  }
  
  // 衣服
  if (lowerTitle.includes('shirt')) {
    return '👕';
  }
  if (lowerTitle.includes('pants') || lowerTitle.includes('trousers')) {
    return '👖';
  }
  if (lowerTitle.includes('dress')) {
    return '👗';
  }
  if (lowerTitle.includes('shoe')) {
    return '👟';
  }
  if (lowerTitle.includes('hat') || lowerTitle.includes('cap')) {
    return '🧢';
  }
  if (lowerTitle.includes('coat') || lowerTitle.includes('jacket')) {
    return '🧥';
  }
  if (lowerTitle.includes('sock')) {
    return '🧦';
  }
  if (lowerTitle.includes('glove')) {
    return '🧤';
  }
  if (lowerTitle.includes('scarf')) {
    return '🧣';
  }
  if (lowerTitle.includes('glasses')) {
    return '👓';
  }
  if (lowerTitle.includes('watch')) {
    return '⌚';
  }
  if (lowerTitle.includes('jewelry') || lowerTitle.includes('necklace')) {
    return '💎';
  }
  
  // 房子/建筑
  if (lowerTitle.includes('house') || lowerTitle.includes('home')) {
    return '🏠';
  }
  if (lowerTitle.includes('school')) {
    return '🏫';
  }
  if (lowerTitle.includes('hospital')) {
    return '🏥';
  }
  if (lowerTitle.includes('store') || lowerTitle.includes('shop')) {
    return '🏪';
  }
  if (lowerTitle.includes('restaurant')) {
    return '🍽️';
  }
  if (lowerTitle.includes('library')) {
    return '📖';
  }
  if (lowerTitle.includes('park')) {
    return '🏞️';
  }
  if (lowerTitle.includes('zoo')) {
    return '🦁';
  }
  if (lowerTitle.includes('farm')) {
    return '🚜';
  }
  if (lowerTitle.includes('castle')) {
    return '🏰';
  }
  if (lowerTitle.includes('tower')) {
    return '🗼';
  }
  
  // 情绪
  if (lowerTitle.includes('happy')) {
    return '😊';
  }
  if (lowerTitle.includes('sad')) {
    return '😢';
  }
  if (lowerTitle.includes('angry')) {
    return '😠';
  }
  if (lowerTitle.includes('scared') || lowerTitle.includes('afraid')) {
    return '😨';
  }
  if (lowerTitle.includes('surprise')) {
    return '😲';
  }
  if (lowerTitle.includes('tired') || lowerTitle.includes('sleepy')) {
    return '😴';
  }
  if (lowerTitle.includes('sick')) {
    return '🤒';
  }
  if (lowerTitle.includes('mess') || lowerTitle.includes('dirty')) {
    return '😵';
  }
  if (lowerTitle.includes('naughty')) {
    return '😈';
  }
  
  // 数字
  if (lowerTitle.includes('one') || lowerTitle.includes('1')) {
    return '1️⃣';
  }
  if (lowerTitle.includes('two') || lowerTitle.includes('2')) {
    return '2️⃣';
  }
  if (lowerTitle.includes('three') || lowerTitle.includes('3')) {
    return '3️⃣';
  }
  if (lowerTitle.includes('count')) {
    return '🔢';
  }
  
  // 颜色
  if (lowerTitle.includes('red')) {
    return '🔴';
  }
  if (lowerTitle.includes('blue')) {
    return '🔵';
  }
  if (lowerTitle.includes('green')) {
    return '🟢';
  }
  if (lowerTitle.includes('yellow')) {
    return '🟡';
  }
  if (lowerTitle.includes('color')) {
    return '🎨';
  }
  
  // 形状
  if (lowerTitle.includes('circle')) {
    return '⭕';
  }
  if (lowerTitle.includes('square')) {
    return '⬜';
  }
  if (lowerTitle.includes('triangle')) {
    return '🔺';
  }
  if (lowerTitle.includes('heart')) {
    return '❤️';
  }
  if (lowerTitle.includes('star')) {
    return '⭐';
  }
  if (lowerTitle.includes('shape')) {
    return '🔷';
  }
  
  // 时间
  if (lowerTitle.includes('morning')) {
    return '🌅';
  }
  if (lowerTitle.includes('night')) {
    return '🌙';
  }
  if (lowerTitle.includes('day')) {
    return '📅';
  }
  if (lowerTitle.includes('time')) {
    return '⏰';
  }
  if (lowerTitle.includes('birthday')) {
    return '🎂';
  }
  if (lowerTitle.includes('christmas')) {
    return '🎄';
  }
  if (lowerTitle.includes('halloween')) {
    return '🎃';
  }
  if (lowerTitle.includes('easter')) {
    return '🥚';
  }
  
  // 地方
  if (lowerTitle.includes('bathroom')) {
    return '🛁';
  }
  if (lowerTitle.includes('kitchen')) {
    return '🍳';
  }
  if (lowerTitle.includes('bedroom')) {
    return '🛏️';
  }
  if (lowerTitle.includes('garden')) {
    return '🌻';
  }
  if (lowerTitle.includes('street')) {
    return '🛣️';
  }
  if (lowerTitle.includes('city')) {
    return '🌆';
  }
  
  // 默认返回书本emoji
  return '📖';
}
