/**
 * 根据书名返回对应的图标名称
 * 优先返回图标名称，如果不匹配则返回null
 */
export function getBookIcon(title) {
  const lowerTitle = title.toLowerCase();
  
  // 动物类
  const animals = {
    'dog': '🐕', 'puppy': '🐕', 'floppy': '🐕',
    'cat': '🐱', 'kitten': '🐱', 'kitty': '🐱',
    'bird': '🐦', 'chicken': '🐔', 'hen': '🐔',
    'fish': '🐟', 'rabbit': '🐰', 'bunny': '🐰',
    'bear': '🐻', 'pig': '🐷', 'cow': '🐮',
    'horse': '🐴', 'sheep': '🐑', 'duck': '🦆',
    'frog': '🐸', 'monkey': '🐵', 'elephant': '🐘',
    'lion': '🦁', 'mouse': '🐭', 'dragon': '🐉',
    'dinosaur': '🦕', 'butterfly': '🦋', 'bee': '🐝',
    'spider': '🕷️', 'snake': '🐍', 'turtle': '🐢',
    'bug': '🐛', 'crawly': '🐛', 'creepy': '🐛',
    'worm': '🪱', 'ant': '🐜', 'ladybug': '🐞',
    'giraffe': '🦒', 'zebra': '🦓', 'hippo': '🦛',
    'rhino': '🦏', 'penguin': '🐧', 'owl': '🦉',
    'parrot': '🦜', 'squirrel': '🐿️', 'deer': '🦌',
    'rabbit': '🐰', 'hare': '🐇',
  };
  
  for (const [key, icon] of Object.entries(animals)) {
    if (lowerTitle.includes(key)) return icon;
  }
  
  // 食物类
  const foods = {
    'apple': '🍎', 'banana': '🍌', 'orange': '🍊',
    'grape': '🍇', 'watermelon': '🍉', 'strawberry': '🍓',
    'cherry': '🍒', 'peach': '🍑', 'pear': '🍐',
    'lemon': '🍋', 'pineapple': '🍍', 'mango': '🥭',
    'kiwi': '🥝', 'coco': '🥥', 'melon': '🍈',
    'vegetable': '🥬', 'carrot': '🥕', 'broccoli': '🥦',
    'corn': '🌽', 'tomato': '🍅', 'potato': '🥔',
    'eggplant': '🍆', 'cucumber': '🥒', 'pepper': '🫑',
    'onion': '🧅', 'garlic': '🧄', 'mushroom': '🍄',
    'pizza': '🍕', 'burger': '🍔', 'hot dog': '🌭',
    'sandwich': '🥪', 'taco': '🌮', 'burrito': '🌯',
    'sushi': '🍣', 'ramen': '🍜', 'noodle': '🍜',
    'rice': '🍚', 'porridge': '🥣', 'dumpling': '🥟',
    'baozi': '🥟', 'tangyuan': '🥣',
    'cake': '🎂', 'cookie': '🍪', 'chocolate': '🍫',
    'candy': '🍬', 'ice cream': '🍦', 'donut': '🍩',
    'muffin': '🧁', 'pie': '🥧', 'pancake': '🥞',
    'waffle': '🧇', 'bread': '🍞', 'cheese': '🧀',
    'milk': '🥛', 'juice': '🧃', 'coffee': '☕',
    'tea': '🍵', 'water': '💧', 'soda': '🥤',
    'beer': '🍺', 'wine': '🍷', 'egg': '🥚',
    'meat': '🥩', 'chicken': '🍗', 'steak': '🥩',
    'pork': '🥓', 'bacon': '🥓', 'sausage': '🌭',
    'fish': '🐟', 'shrimp': '🦐', 'crab': '🦀',
    'lobster': '🦞', 'oyster': '🦪', 'squid': '🦑',
    'octopus': '🐙', 'prawn': '🦐',
  };
  
  for (const [key, icon] of Object.entries(foods)) {
    if (lowerTitle.includes(key)) return icon;
  }
  
  // 交通工具
  const vehicles = {
    'car': '🚗', 'bus': '🚌', 'train': '🚂',
    'plane': '✈️', 'airplane': '✈️', 'aeroplane': '✈️',
    'boat': '🚢', 'ship': '🚢', 'ferry': '⛴️',
    'bike': '🚲', 'bicycle': '🚲', 'motorbike': '🏍️',
    'truck': '🚚', 'van': '🚐', 'taxi': '🚕',
    'ambulance': '🚑', 'police': '🚓', 'fire': '🚒',
    'helicopter': '🚁', 'rocket': '🚀', 'subway': '🚇',
    'metro': '🚇', 'tram': '🚊', 'trolley': '🚎',
    'ship': '🛥️', 'yacht': '🛥️', 'sailboat': '⛵',
    'canoe': '🛶', 'kayak': '🛶', 'rowboat': '🛶',
  };
  
  for (const [key, icon] of Object.entries(vehicles)) {
    if (lowerTitle.includes(key)) return icon;
  }
  
  // 自然天气
  const nature = {
    'sun': '☀️', 'sunny': '☀️', 'moon': '🌙',
    'star': '⭐', 'rain': '🌧️', 'rainy': '🌧️',
    'snow': '❄️', 'snowy': '❄️', 'cloud': '☁️',
    'wind': '💨', 'windy': '💨', 'storm': '⛈️',
    'thunder': '⛈️', 'lightning': '⚡', 'rainbow': '🌈',
    'fog': '🌫️', 'foggy': '🌫️', 'mist': '🌫️',
    'tree': '🌳', 'flower': '🌸', 'grass': '🌿',
    'leaf': '🍃', 'leaves': '🍃', 'garden': '🌻',
    'forest': '🌲', 'mountain': '⛰️', 'hill': '🏔️',
    'beach': '🏖️', 'sand': '🏖️', 'ocean': '🌊',
    'sea': '🌊', 'river': '🏞️', 'lake': '🏞️',
    'waterfall': '💧', 'island': '🏝️', 'farm': '🚜',
    'farm': '🏡', 'field': '🌾', 'crop': '🌾',
  };
  
  for (const [key, icon] of Object.entries(nature)) {
    if (lowerTitle.includes(key)) return icon;
  }
  
  // 家庭人物
  const family = {
    'mom': '👩', 'mum': '👩', 'mother': '👩',
    'dad': '👨', 'father': '👨',
    'baby': '👶', 'child': '👦', 'children': '👧',
    'boy': '👦', 'girl': '👧', 'man': '👨',
    'woman': '👩', 'person': '🧑', 'people': '👥',
    'family': '👨‍👩‍👧', 'friend': '👫', 'classmate': '👥',
    'teacher': '👩‍🏫', 'doctor': '👨‍⚕️', 'nurse': '👩‍⚕️',
    'cook': '👨‍🍳', 'chef': '👨‍🍳', 'driver': '🚗',
    'pilot': '👨‍✈️', 'police': '👮', 'soldier': '💂',
    'firefighter': '👨‍🚒', 'artist': '👨‍🎨', 'musician': '👨‍🎤',
    'dancer': '💃', 'singer': '🎤', 'actor': '🎭',
    'actress': '🎭', ' magician': '🎩',
  };
  
  for (const [key, icon] of Object.entries(family)) {
    if (lowerTitle.includes(key)) return icon;
  }
  
  // 学校学习
  const school = {
    'school': '🏫', 'classroom': '🏫', 'library': '📚',
    'book': '📚', 'pencil': '✏️', 'pen': '🖊️',
    'crayon': '🖍️', 'marker': '📍', 'ruler': '📏',
    'scissors': '✂️', 'glue': '🧴', 'paper': '📄',
    'notebook': '📓', 'journal': '📔', 'diary': '📔',
    'backpack': '🎒', 'bag': '👜', 'lunchbox': '🍱',
    'computer': '💻', 'laptop': '💻', 'tablet': '📱',
    'phone': '📱', 'television': '📺', 'tv': '📺',
    'clock': '⏰', 'calendar': '📅', 'map': '🗺️',
    'globe': '🌍', 'world': '🌍',
  };
  
  for (const [key, icon] of Object.entries(school)) {
    if (lowerTitle.includes(key)) return icon;
  }
  
  // 运动游戏
  const sports = {
    'ball': '⚽', 'football': '⚽', 'soccer': '⚽',
    'basketball': '🏀', 'baseball': '⚾', 'tennis': '🎾',
    'golf': '⛳', 'swim': '🏊', 'swimming': '🏊',
    'run': '🏃', 'running': '🏃', 'walk': '🚶',
    'dance': '💃', 'dancing': '💃', 'jump': '⬆️',
    'hop': '⬆️', 'skip': '➰', 'climb': '🧗',
    'game': '🎮', 'play': '🎮', 'toy': '🧸',
    'kite': '🪁', 'slide': '🛝', 'swing': '🎠',
    'party': '🎉', 'birthday': '🎂', 'gift': '🎁',
    'present': '🎁', 'balloon': '🎈', 'mask': '🎭',
    'dress up': '👗', 'costume': '👘',
  };
  
  for (const [key, icon] of Object.entries(sports)) {
    if (lowerTitle.includes(key)) return icon;
  }
  
  // 音乐艺术
  const music = {
    'music': '🎵', 'song': '🎤', 'sing': '🎤',
    'guitar': '🎸', 'piano': '🎹', 'drum': '🥁',
    'trumpet': '🎺', 'violin': '🎻', 'flute': '🪈',
    'band': '🎷', 'concert': '🎵', 'show': '🎭',
    'paint': '🎨', 'draw': '🎨', 'art': '🎨',
    'color': '🎨', 'craft': '🎨', 'cut': '✂️',
  };
  
  for (const [key, icon] of Object.entries(music)) {
    if (lowerTitle.includes(key)) return icon;
  }
  
  // 身体部位
  const body = {
    'head': '💭', 'face': '😊', 'eye': '👁️',
    'ear': '👂', 'nose': '👃', 'mouth': '👄',
    'hand': '✋', 'foot': '🦶', 'feet': '🦶',
    'arm': '💪', 'leg': '🦵', 'tooth': '🦷',
    'hair': '💇', 'skin': '🧑', 'heart': '❤️',
  };
  
  for (const [key, icon] of Object.entries(body)) {
    if (lowerTitle.includes(key)) return icon;
  }
  
  // 衣服配饰
  const clothes = {
    'shirt': '👕', 'pants': '👖', 'dress': '👗',
    'shoe': '👟', 'sock': '🧦', 'hat': '🧢',
    'cap': '🧢', 'coat': '🧥', 'jacket': '🧥',
    'glove': '🧤', 'scarf': '🧣', 'umbrella': '☂️',
    'glasses': '👓', 'watch': '⌚', 'ring': '💍',
    'necklace': '📿', 'earring': '✨',
  };
  
  for (const [key, icon] of Object.entries(clothes)) {
    if (lowerTitle.includes(key)) return icon;
  }
  
  // 房子建筑
  const house = {
    'house': '🏠', 'home': '🏠', 'door': '🚪',
    'window': '🪟', 'roof': '🏠', 'floor': '🏠',
    'wall': '🧱', 'room': '🚪', 'kitchen': '🍳',
    'bathroom': '🛁', 'bedroom': '🛏️', 'living room': '🛋️',
    'garage': '🏗️', 'garden': '🌻', 'pool': '🏊',
  };
  
  for (const [key, icon] of Object.entries(house)) {
    if (lowerTitle.includes(key)) return icon;
  }
  
  // 情绪
  const emotions = {
    'happy': '😊', 'smile': '😊', 'funny': '😄',
    'sad': '😢', 'cry': '😢', 'angry': '😠',
    'mad': '😠', 'scared': '😨', 'fear': '😨',
    'surprise': '😲', 'surprised': '😲', 'amazing': '😲',
    'tired': '😴', 'sleepy': '😴', 'sleep': '😴',
    'dream': '💭', 'sick': '🤒', 'ill': '🤒',
    'mess': '😵', 'dirty': '😵', 'clean': '✨',
    'naughty': '😈', 'bad': '😈', 'good': '👍',
    'nice': '👍', 'beautiful': '😍', 'pretty': '😍',
    'love': '❤️', 'like': '❤️', 'hate': '👎',
    'please': '🙏', 'thank': '🙏', 'sorry': '😔',
    'excited': '🤩', 'bored': '🥱', 'worried': '😟',
  };
  
  for (const [key, icon] of Object.entries(emotions)) {
    if (lowerTitle.includes(key)) return icon;
  }
  
  // 动作行为
  const actions = {
    'eat': '🍽️', 'drink': '🥤', 'sleep': '😴',
    'wake': '⏰', 'wash': '🧼', 'brush': '🪥',
    'bath': '🛁', 'shower': '🚿', 'dress': '👗',
    'cook': '🍳', 'make': '🔧', 'help': '🤝',
    'share': '🤝', 'give': '🎁', 'take': '✋',
    'open': '🚪', 'close': '🚪', 'push': '🚪',
    'pull': '🚪', 'stop': '🛑', 'go': '🟢',
    'come': '👋', 'look': '👀', 'see': '👁️',
    'hear': '👂', 'listen': '👂', 'smell': '👃',
    'taste': '👅', 'feel': '🫀', 'think': '💭',
    'know': '🧠', 'learn': '📚', 'read': '📖',
    'write': '✏️', 'draw': '🎨', 'paint': '🎨',
  };
  
  for (const [key, icon] of Object.entries(actions)) {
    if (lowerTitle.includes(key)) return icon;
  }
  
  // 时间空间
  const time = {
    'morning': '🌅', 'afternoon': '☀️', 'evening': '🌆',
    'night': '🌙', 'today': '📅', 'yesterday': '📅',
    'tomorrow': '📅', 'week': '📅', 'month': '📅',
    'year': '🗓️', 'hour': '⏰', 'minute': '⏰',
    'second': '⏱️', 'time': '⏰', 'when': '🕐',
    'first': '1️⃣', 'next': '➡️', 'last': '⬅️',
    'new': '🆕', 'old': '🕰️', 'big': '🔴',
    'small': '🔵', 'long': '📏', 'short': '📏',
  };
  
  for (const [key, icon] of Object.entries(time)) {
    if (lowerTitle.includes(key)) return icon;
  }
  
  // 其他常用
  const other = {
    'money': '💰', 'coin': '🪙', 'shop': '🏪',
    'store': '🏪', 'market': '🛒', 'buy': '🛒',
    'sell': '💰', 'hospital': '🏥', 'doctor': '👨‍⚕️',
    'post office': '🏣', 'bank': '🏦', 'park': '🏞️',
    'zoo': '🦁', 'museum': '🏛️', 'cinema': '🎬',
    'theater': '🎭', 'restaurant': '🍽️', 'hotel': '🏨',
    'beach': '🏖️', 'camp': '🏕️', 'picnic': '🧺',
    'trip': '✈️', 'journey': '🧳', 'vacation': '🏖️',
    'holiday': '🎉', 'winter': '❄️', 'summer': '☀️',
    'spring': '🌸', 'autumn': '🍂', 'fall': '🍂',
    'christmas': '🎄', 'halloween': '🎃', 'easter': '🥚',
    'new year': '🎆', 'birthday': '🎂', 'anniversary': '💝',
  };
  
  for (const [key, icon] of Object.entries(other)) {
    if (lowerTitle.includes(key)) return icon;
  }
  
  // 如果没有匹配的，返回null
  return null;
}

/**
 * 清理书名，移除数字编号和下划线
 */
export function cleanTitle(title) {
  // 移除形如 "01_" 或 "1-" 的前缀
  return title.replace(/^[\d]+[_-]\s*/, '').trim();
}
