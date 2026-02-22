import { defineStore } from 'pinia'

export const useRewardStore = defineStore('reward', {
  state: () => {
    const savedTotalBooks = parseInt(localStorage.getItem('totalBooksRead') || '0')
    
    // 初始化已解锁列表（新手勋章 special_0 默认解锁）
    let unlockedRewards = JSON.parse(localStorage.getItem('unlockedRewards') || '[]')
    
    // 确保新手勋章总是解锁的
    if (!unlockedRewards.includes('special_0')) {
      unlockedRewards.unshift('special_0')
    }
    
    return {
      unlockedRewards,
      unlockedTimes: JSON.parse(localStorage.getItem('unlockedTimes') || '{}'),
      currentStreak: parseInt(localStorage.getItem('currentStreak') || '0'),
      totalBooksRead: savedTotalBooks,
    }
  },

  getters: {
    completedCount: (state) => {
      const specialCount = state.unlockedRewards.filter(r => r.startsWith('special_')).length
      const cycleCount = state.unlockedRewards.filter(r => r.startsWith('cycle_')).length
      return specialCount + cycleCount
    },
    
    nextRewardProgress: (state) => {
      const specialMilestones = [1, 5, 10, 20, 30, 50, 100, 200, 500, 1000]
      let nextSpecial = null
      for (const m of specialMilestones) {
        if (!state.unlockedRewards.includes(`special_${m}`)) {
          nextSpecial = m
          break
        }
      }
      
      const currentCycle = Math.floor(state.totalBooksRead / 10)
      const nextCycle = currentCycle + 1
      const currentInCycle = state.totalBooksRead % 10
      
      if (nextSpecial && nextSpecial <= nextCycle * 10) {
        const booksUntil = nextSpecial - state.totalBooksRead
        const specialNames = {1: '初学者', 5: '学习者', 10: '探索者', 20: '小读者', 30: '阅读家', 50: '知识家', 100: '故事家', 200: '文学家', 500: '学者', 1000: '传奇'}
        return {
          current: state.totalBooksRead,
          total: nextSpecial,
          percentage: Math.min((state.totalBooksRead / nextSpecial) * 100, 100),
          nextMilestone: nextSpecial,
          booksUntilNext: Math.max(0, booksUntil),
          nextType: 'special',
          nextName: specialNames[nextSpecial] || '新徽章'
        }
      } else {
        return {
          current: currentInCycle,
          total: 10,
          percentage: Math.min((currentInCycle / 10) * 100, 100),
          nextMilestone: nextCycle * 10,
          booksUntilNext: Math.max(0, 10 - currentInCycle),
          nextType: 'cycle',
          nextName: '学习之星'
        }
      }
    },

    rewardsByMilestone: (state) => {
      const rewards = []
      
      // 特殊里程碑 - 奢华勋章设计
      const specialBadges = [
        { name: '新手', icon: '🎯', bg: 'from-gray-400 to-gray-600', border: 'border-gray-400', desc: '开始学习之旅', milestone: 0, level: 'bronze', glow: '' },
        { name: '初学者', icon: '🌱', bg: 'from-green-400 to-green-600', border: 'border-green-400', desc: '读完第1本绘本', milestone: 1, level: 'bronze', glow: '' },
        { name: '学习者', icon: '📖', bg: 'from-blue-400 to-blue-600', border: 'border-blue-400', desc: '读完5本绘本', milestone: 5, level: 'silver', glow: '' },
        { name: '探索者', icon: '🔦', bg: 'from-cyan-400 to-cyan-600', border: 'border-cyan-400', desc: '读完10本绘本', milestone: 10, level: 'silver', glow: '' },
        { name: '小读者', icon: '📚', bg: 'from-indigo-400 to-indigo-600', border: 'border-indigo-400', desc: '读完20本绘本', milestone: 20, level: 'silver', glow: '' },
        { name: '阅读家', icon: '🏆', bg: 'from-amber-400 to-amber-600', border: 'border-amber-500', desc: '读完30本绘本', milestone: 30, level: 'gold', glow: 'shadow-amber-500/40' },
        { name: '知识家', icon: '🧠', bg: 'from-purple-500 to-purple-700', border: 'border-purple-400', desc: '读完50本绘本', milestone: 50, level: 'gold', glow: 'shadow-purple-500/40' },
        { name: '故事家', icon: '🎭', bg: 'from-pink-500 to-pink-700', border: 'border-pink-400', desc: '读完100本绘本', milestone: 100, level: 'gold', glow: 'shadow-pink-500/40' },
        { name: '文学家', icon: '📜✨', bg: 'from-rose-500 to-rose-700', border: 'border-rose-400', desc: '读完200本绘本', milestone: 200, level: 'platinum', glow: 'shadow-rose-500/50' },
        { name: '学者', icon: '🎓💎', bg: 'from-violet-500 to-violet-800', border: 'border-violet-400', desc: '读完500本绘本', milestone: 500, level: 'platinum', glow: 'shadow-violet-500/50' },
        { name: '传奇', icon: '👑💎🌟', bg: 'from-yellow-400 via-orange-500 to-red-500', border: 'border-yellow-400', desc: '读完1000本绘本', milestone: 1000, level: 'legend', glow: 'shadow-yellow-500/60 animate-pulse' },
      ]
      
      for (const item of specialBadges) {
        const rewardId = `special_${item.milestone}`
        rewards.push({
          id: rewardId,
          milestone: item.milestone,
          name: item.name,
          icon: item.icon,
          bg: item.bg,
          border: item.border,
          glow: item.glow,
          level: item.level,
          desc: item.desc,
          unlocked: state.unlockedRewards.includes(rewardId),
          unlockedAt: state.unlockedTimes[rewardId] || '',
          isSpecial: true
        })
      }
      
      // 循环里程碑 - 学习之星（每10本一个）
      const cycleCount = Math.floor(state.totalBooksRead / 10)
      for (let i = 1; i <= Math.min(cycleCount, 100); i++) {
        const milestone = i * 10
        let icon, bg, border, glow, title
        
        if (i >= 75) {
          icon = '🌠💫✨'
          bg = 'from-purple-600 via-violet-600 to-purple-800'
          border = 'border-purple-400'
          glow = 'shadow-purple-500/60 animate-pulse'
          title = '超级学圣'
        } else if (i >= 50) {
          icon = '🌟✨💎'
          bg = 'from-yellow-500 via-orange-500 to-red-500'
          border = 'border-yellow-400'
          glow = 'shadow-yellow-500/50'
          title = '超级学霸'
        } else if (i >= 25) {
          icon = '🌟✨'
          bg = 'from-amber-500 to-orange-600'
          border = 'border-amber-400'
          glow = 'shadow-amber-500/40'
          title = '学习之星'
        } else if (i >= 10) {
          icon = '⭐🌟'
          bg = 'from-blue-500 to-indigo-600'
          border = 'border-blue-400'
          glow = 'shadow-blue-500/30'
          title = '学习之星'
        } else {
          icon = '⭐'
          bg = 'from-blue-400 to-blue-600'
          border = 'border-blue-400'
          glow = ''
          title = '学习之星'
        }
        
        rewards.push({
          id: `cycle_${milestone}_${i}`,
          milestone,
          name: title,
          icon: icon,
          bg: bg,
          border: border,
          glow: glow,
          level: i >= 50 ? 'platinum' : i >= 25 ? 'gold' : i >= 10 ? 'silver' : 'bronze',
          desc: `累计读完 ${milestone} 本绘本`,
          unlocked: true,
          unlockedAt: '', // 循环勋章不显示获取时间
          isCycle: true,
          count: i
        })
      }
      
      return rewards
    }
  },

  actions: {
    unlockReward(id) {
      if (!this.unlockedRewards.includes(id)) {
        this.unlockedRewards.push(id)
        this.unlockedTimes[id] = new Date().toISOString()
        this.saveData()
        return true
      }
      return false
    },

    addBooksRead(count) {
      const oldCount = this.totalBooksRead
      this.totalBooksRead += count
      
      let newReward = null
      
      const specialMilestones = [1, 5, 10, 20, 30, 50, 100, 200, 500, 1000]
      for (const m of specialMilestones) {
        if (oldCount < m && this.totalBooksRead >= m) {
          const id = `special_${m}`
          if (this.unlockReward(id)) {
            newReward = { milestone: m, isSpecial: true }
          }
        }
      }
      
      const oldCycles = Math.floor(oldCount / 10)
      const newCycles = Math.floor(this.totalBooksRead / 10)
      for (let i = oldCycles + 1; i <= Math.min(newCycles, 100); i++) {
        const milestone = i * 10
        const id = `cycle_${milestone}_${i}`
        this.unlockReward(id)
        if (!newReward) {
          newReward = { milestone, isCycle: true, count: i }
        }
      }
      
      this.saveData()
      return newReward
    },

    saveData() {
      localStorage.setItem('unlockedRewards', JSON.stringify(this.unlockedRewards))
      localStorage.setItem('unlockedTimes', JSON.stringify(this.unlockedTimes))
      localStorage.setItem('currentStreak', this.currentStreak.toString())
      localStorage.setItem('totalBooksRead', this.totalBooksRead.toString())
    },

    clearAllData() {
      this.unlockedRewards = []
      this.unlockedTimes = {}
      this.currentStreak = 0
      this.totalBooksRead = 0
      localStorage.setItem('unlockedRewards', '[]')
      localStorage.setItem('unlockedTimes', '{}')
      localStorage.setItem('currentStreak', '0')
      localStorage.setItem('totalBooksRead', '0')
    }
  }
})
