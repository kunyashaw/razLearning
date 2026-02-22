import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: 'rainbow',
    wallpaper: null,
    cartoonMode: true,
    isCustom: false,
    customColor: '#ef4444',
    _initialized: false
  }),

  getters: {
    themeData: (state) => {
      const themes = {
        rainbow: {
          name: '彩虹',
          emoji: '🌈',
          bg: '#e3f2fd',
          accent: '#ff6b6b',
          decorations: ['🌈', '☁️', '⭐', '🌸', '🦋', '🦄']
        },
        forest: {
          name: '森林',
          emoji: '🌲',
          bg: 'linear-gradient(135deg, #ecfccb 0%, #dcfce7 100%)',
          accent: '#22c55e',
          decorations: ['🌲', '🍃', '🌿', '🦋', '🌸', '🐿️']
        },
        ocean: {
          name: '海洋',
          emoji: '🌊',
          bg: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
          accent: '#0ea5e9',
          decorations: ['🌊', '🐚', '🐠', '🐬', '🦀', '⭐']
        },
        space: {
          name: '太空',
          emoji: '⭐',
          bg: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
          accent: '#6366f1',
          decorations: ['⭐', '🌙', '🚀', '🪐', '☄️', '👽']
        },
        candy: {
          name: '糖果',
          emoji: '🍭',
          bg: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
          accent: '#ec4899',
          decorations: ['🍭', '🍬', '🧁', '🍩', '🍡', '🎀']
        },
        animal: {
          name: '动物',
          emoji: '🦁',
          bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          accent: '#f59e0b',
          decorations: ['🦁', '🐘', '🦒', '🦓', '🐼', '🌿']
        },
        nezha: {
          name: '哪吒',
          emoji: '🎨',
          bg: 'linear-gradient(135deg, #fee2e2 0%, #ffedd5 100%)',
          accent: '#ef4444',
          decorations: ['🔥', '🎨', '🦚', '🌊', '☯️', '💫']
        },
        aocing: {
          name: '敖丙',
          emoji: '🐉',
          bg: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)',
          accent: '#3b82f6',
          decorations: ['🐉', '❄️', '💎', '🌊', '🔮', '✨']
        },
        zootopia: {
          name: '疯狂动物城',
          emoji: '🐰',
          bg: 'linear-gradient(135deg, #fef9c3 0%, #fef08a 100%)',
          accent: '#eab308',
          decorations: ['🐰', '🦊', '🐼', '🚗', '🏙️', '🌴']
        },
        spongebob: {
          name: '海绵宝宝',
          emoji: '🧽',
          bg: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)',
          accent: '#eab308',
          decorations: ['🧽', '⭐', '🐌', '🦀', '🐙', '🌊']
        },
        shukebeta: {
          name: '舒克贝塔',
          emoji: '🐭',
          bg: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
          accent: '#f97316',
          decorations: ['🐭', '✈️', '🛫', '☁️', '🌤️', '🛬']
        },
        eyecare: {
          name: '护眼',
          emoji: '👁️',
          bg: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
          accent: '#22c55e',
          decorations: ['👁️', '🌿', '🍃', '🌱', '☘️', '🌵']
        },
        night: {
          name: '夜间',
          emoji: '🌙',
          bg: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          accent: '#94a3b8',
          decorations: ['🌙', '⭐', '✨', '🌟', '💫', '☁️'],
          isDark: true
        },
        default: {
          name: '默认',
          emoji: '🌈',
          bg: 'linear-gradient(135deg, #ffebf3 0%, #e0f2fe 50%, #fef3c7 100%)',
          accent: '#f472b6',
          decorations: ['🌈', '☁️', '⭐', '🌸', '🦋']
        }
      };
      
      if (state.isCustom) {
        return {
          name: '自定义',
          emoji: '🎨',
          bg: `linear-gradient(135deg, ${state.customColor}20, white)`,
          accent: state.customColor,
          decorations: ['🎨', '✨', '🌟', '💫', '⭐']
        };
      }
      
      return themes[state.currentTheme] || themes.rainbow;
    },
    
    backgroundStyle: (state) => {
      if (state.wallpaper) {
        return {
          backgroundImage: `url(${state.wallpaper})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        };
      }
      return {};
    }
  },
  
  actions: {
    initTheme() {
      if (!this._initialized) {
        this.loadSavedTheme()
        this._initialized = true
      }
    },
    
    setTheme(themeName) {
      this.currentTheme = themeName;
      this.isCustom = false;
      this.saveTheme();
    },
    
    setCustomColor(color) {
      this.customColor = color;
      this.isCustom = true;
      this.saveTheme();
    },
    
    setWallpaper(url) {
      this.wallpaper = url;
    },
    
    clearWallpaper() {
      this.wallpaper = null;
    },
    
    saveTheme() {
      const themeData = {
        theme: this.currentTheme,
        custom: this.isCustom,
        color: this.customColor
      };
      localStorage.setItem('theme', JSON.stringify(themeData));
      
      if (this.wallpaper) {
        localStorage.setItem('wallpaper', this.wallpaper);
      }
    },
    
    loadSavedTheme() {
      const savedTheme = localStorage.getItem('theme');
      const savedWallpaper = localStorage.getItem('wallpaper');
      
      if (savedTheme) {
        try {
          const themeData = JSON.parse(savedTheme);
          if (themeData.theme) {
            this.currentTheme = themeData.theme;
          }
          if (typeof themeData.custom === 'boolean') {
            this.isCustom = themeData.custom;
          }
          if (themeData.color) {
            this.customColor = themeData.color;
          }
        } catch (e) {
          console.warn('Failed to parse saved theme:', e);
        }
      }
      
      if (savedWallpaper) {
        this.wallpaper = savedWallpaper;
      }
    }
  }
});
