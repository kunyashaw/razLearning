<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
    <!-- 粒子背景 -->
    <div class="particles absolute inset-0 overflow-hidden">
      <div
        v-for="(particle, index) in particles"
        :key="index"
        class="particle absolute"
        :style="getParticleStyle(particle)"
      >
        {{ particle.emoji }}
      </div>
    </div>

    <!-- 3D 奖励卡片 -->
    <div class="reward-card-container pointer-events-auto" @click="close">
      <div class="reward-card" :class="[rewardType, { 'is-flipped': isFlipped }]">
        <div class="card-front">
          <div class="reward-3d">
            <div class="reward-glow"></div>
            <div class="reward-main">
              <div v-if="rewardType === 'trophy'" class="trophy-3d">
                <div class="trophy-cup">
                  <div class="trophy-handle left"></div>
                  <div class="trophy-body">
                    <div class="trophy-base">
                      <div class="trophy-star">★</div>
                    </div>
                    <div class="trophy-bowl"></div>
                  </div>
                  <div class="trophy-handle right"></div>
                </div>
              </div>

              <div v-else-if="rewardType === 'shield'" class="shield-3d">
                <div class="shield-shape">
                  <div class="shield-inner">
                    <div class="shield-glow"></div>
                    <span class="shield-icon">🛡️</span>
                  </div>
                </div>
              </div>

              <div v-else-if="rewardType === 'star'" class="star-3d">
                <div class="star-shape">
                  <div class="star-rays"></div>
                  <span class="star-icon">⭐</span>
                </div>
              </div>

              <div v-else-if="rewardType === 'fire'" class="fire-3d">
                <div class="fire-container">
                  <div class="fire-core"></div>
                  <div class="fire-flame flame-1"></div>
                  <div class="fire-flame flame-2"></div>
                  <div class="fire-flame flame-3"></div>
                </div>
              </div>

              <div v-else-if="rewardType === 'certificate'" class="certificate-3d">
                <div class="certificate-frame">
                  <div class="certificate-inner">
                    <span class="cert-icon">📜</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="reward-info">
            <h3 class="reward-title">{{ title }}</h3>
            <p class="reward-desc">{{ description }}</p>
          </div>
        </div>

        <div class="card-back">
          <div class="milestone-number">{{ milestone }}</div>
          <p class="milestone-text">本绘本</p>
        </div>
      </div>
    </div>

    <!-- 进度提示 -->
    <div class="progress-hint pointer-events-auto">
      <div class="hint-content">
        <span class="hint-icon">📚</span>
        <span class="hint-text">已读 {{ booksRead }} 本，继续加油！</span>
      </div>
    </div>

    <!-- 关闭按钮 - 顶部水平居中 -->
    <button class="close-btn pointer-events-auto" @click="close" title="点击关闭" :style="closeBtnStyle">
      <span class="close-icon">✕</span>
      <span class="close-text">关闭</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'

const props = defineProps({
  visible: Boolean,
  rewardType: {
    type: String,
    default: 'trophy'
  },
  milestone: {
    type: Number,
    default: 5
  },
  booksRead: {
    type: Number,
    default: 0
  },
  themeColor: {
    type: String,
    default: '#f472b6'
  }
})

const emit = defineEmits(['close'])

const isFlipped = ref(false)
const particles = ref([])

const title = computed(() => {
  const titles = {
    trophy: '🏆 奖杯解锁',
    shield: '🛡️ 盾牌成就',
    star: '⭐ 星星勋章',
    fire: '🔥 火焰之力',
    certificate: '📜 荣誉证书'
  }
  return titles[props.rewardType] || '🎉 成就解锁'
})

const description = computed(() => {
  return `恭喜解锁 ${props.milestone} 本绘本的成就！`
})

const closeBtnStyle = computed(() => {
  return {
    background: `linear-gradient(135deg, ${props.themeColor}, ${props.themeColor}dd)`,
    boxShadow: `0 4px 20px ${props.themeColor}80`
  }
})

const getParticleStyle = (particle) => {
  return {
    left: particle.x + '%',
    top: particle.y + '%',
    fontSize: particle.size + 'px',
    opacity: particle.opacity,
    transform: `rotate(${particle.rotation}deg) translateX(${particle.distance}px)`,
    animation: `particleFloat ${particle.duration}ms ease-out forwards`
  }
}

const createParticles = () => {
  const emojis = ['⭐', '🌟', '✨', '💫', '🎉', '🎊', '🏆', '🎯']
  const newParticles = []
  
  for (let i = 0; i < 50; i++) {
    newParticles.push({
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      rotation: Math.random() * 360,
      distance: Math.random() * 100 + 50,
      opacity: Math.random() * 0.8 + 0.2,
      duration: Math.random() * 1500 + 1000
    })
  }
  
  particles.value = newParticles
}

const close = () => {
  isFlipped.value = false
  emit('close')
}

watch(() => props.visible, (val) => {
  if (val) {
    setTimeout(() => {
      isFlipped.value = true
    }, 300)
    createParticles()
  }
})

onMounted(() => {
  if (props.visible) {
    setTimeout(() => {
      isFlipped.value = true
    }, 300)
    createParticles()
  }
})
</script>

<style scoped>
@keyframes particleFloat {
  0% {
    opacity: 1;
    transform: translateY(0) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: translateY(-200px) rotate(360deg);
  }
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes rotate3d {
  0% {
    transform: rotateY(0deg) rotateX(0deg);
  }
  100% {
    transform: rotateY(360deg) rotateX(10deg);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

@keyframes flameFlicker {
  0%, 100% {
   transform: scaleY(1) scaleX(1);
   opacity: 0.9;
 }
 25% {
   transform: scaleY(1.1) scaleX(0.9);
   opacity: 1;
 }
 50% {
   transform: scaleY(0.9) scaleX(1.1);
   opacity: 0.8;
 }
 75% {
   transform: scaleY(1.05) scaleX(0.95);
   opacity: 1;
 }
}

.particles {
  position: absolute;
}

.particle {
  position: absolute;
  animation: particleFloat 2s ease-out forwards;
}

.reward-card-container {
  perspective: 1000px;
}

.reward-card {
  width: 280px;
  height: 380px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.reward-card.is-flipped {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 2px rgba(255, 255, 255, 0.1);
}

.card-front {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 30px;
}

.card-back {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: rotateY(180deg);
}

.reward-3d {
  position: relative;
  animation: float 3s ease-in-out infinite;
}

.reward-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%);
  animation: glowPulse 2s ease-in-out infinite;
}

.reward-main {
  position: relative;
  z-index: 1;
}

/* Trophy 3D */
.trophy-3d {
  perspective: 500px;
}

.trophy-cup {
  position: relative;
  width: 120px;
  height: 140px;
  transform-style: preserve-3d;
  animation: float 2s ease-in-out infinite;
}

.trophy-body {
  position: relative;
  width: 100%;
  height: 100%;
}

.trophy-bowl {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 60px;
  background: linear-gradient(135deg, #ffd700 0%, #ffaa00 50%, #ffd700 100%);
  border-radius: 0 0 40px 40px;
  box-shadow:
    inset 0 -10px 20px rgba(255, 255, 255, 0.3),
    0 10px 20px rgba(0, 0, 0, 0.3);
}

.trophy-base {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 40px;
  background: linear-gradient(135deg, #ffd700 0%, #cc8800 100%);
  border-radius: 5px;
}

.trophy-star {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 30px;
  color: #fff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

.trophy-handle {
  position: absolute;
  top: 30px;
  width: 20px;
  height: 50px;
  border: 8px solid #ffd700;
  border-radius: 0 20px 20px 0;
}

.trophy-handle.left {
  left: 10px;
  border-left: none;
  transform: scaleX(-1);
}

.trophy-handle.right {
  right: 10px;
}

/* Shield 3D */
.shield-3d {
  perspective: 500px;
}

.shield-shape {
  width: 140px;
  height: 160px;
  position: relative;
  transform-style: preserve-3d;
  animation: float 3s ease-in-out infinite;
}

.shield-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    inset 0 0 30px rgba(255, 255, 255, 0.2),
    0 0 30px rgba(102, 126, 234, 0.5);
}

.shield-glow {
  position: absolute;
  inset: -10px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  filter: blur(20px);
  opacity: 0.5;
  z-index: -1;
}

.shield-icon {
  font-size: 60px;
  animation: rotate3d 5s linear infinite;
}

/* Star 3D */
.star-3d {
  perspective: 500px;
}

.star-shape {
  width: 150px;
  height: 150px;
  position: relative;
  animation: float 3s ease-in-out infinite;
}

.star-rays {
  position: absolute;
  inset: -20px;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(255, 215, 0, 0.8) 10deg,
    transparent 20deg,
    transparent 40deg,
    rgba(255, 215, 0, 0.8) 50deg,
    transparent 60deg,
    transparent 80deg,
    rgba(255, 215, 0, 0.8) 90deg,
    transparent 100deg,
    transparent 120deg,
    rgba(255, 215, 0, 0.8) 130deg,
    transparent 140deg,
    transparent 160deg,
    rgba(255, 215, 0, 0.8) 170deg,
    transparent 180deg,
    transparent 200deg,
    rgba(255, 215, 0, 0.8) 210deg,
    transparent 220deg,
    transparent 240deg,
    rgba(255, 215, 0, 0.8) 250deg,
    transparent 260deg,
    transparent 280deg,
    rgba(255, 215, 0, 0.8) 290deg,
    transparent 300deg,
    transparent 320deg,
    rgba(255, 215, 0, 0.8) 330deg,
    transparent 340deg,
    transparent 360deg
  );
  animation: shimmer 2s linear infinite;
  border-radius: 50%;
}

.star-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 70px;
  filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
  animation: rotate3d 10s linear infinite;
}

/* Fire 3D */
.fire-3d {
  perspective: 500px;
}

.fire-container {
  width: 100px;
  height: 140px;
  position: relative;
  animation: float 2s ease-in-out infinite;
}

.fire-core {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 60px;
  background: linear-gradient(to top, #ff6b35, #f7931e, #ffcc02);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  filter: blur(5px);
}

.fire-flame {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  animation: flameFlicker 0.5s ease-in-out infinite;
}

.flame-1 {
  width: 60px;
  height: 80px;
  background: linear-gradient(to top, #ff4500, #ff6b35, #ffa500);
  z-index: 3;
}

.flame-2 {
  width: 50px;
  height: 60px;
  background: linear-gradient(to top, #ff6b35, #ffa500, #ffcc02);
  bottom: 30px;
  animation-delay: 0.1s;
  z-index: 2;
}

.flame-3 {
  width: 40px;
  height: 40px;
  background: linear-gradient(to top, #ffa500, #ffcc02, #fff);
  bottom: 40px;
  animation-delay: 0.2s;
  z-index: 1;
}

/* Certificate 3D */
.certificate-3d {
  perspective: 500px;
}

.certificate-frame {
  width: 160px;
  height: 120px;
  position: relative;
  animation: float 3s ease-in-out infinite;
}

.certificate-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f5f5dc 0%, #fff8dc 50%, #f5f5dc 100%);
  border: 8px solid #8b4513;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    inset 0 0 20px rgba(139, 69, 19, 0.2),
    0 10px 30px rgba(0, 0, 0, 0.3);
}

.cert-icon {
  font-size: 50px;
  animation: shimmer 3s ease-in-out infinite;
}

.reward-info {
  text-align: center;
  margin-top: 20px;
}

.reward-title {
  font-size: 24px;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  margin-bottom: 10px;
}

.reward-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.card-back {
  padding: 30px;
  text-align: center;
}

.milestone-number {
  font-size: 72px;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
}

.milestone-text {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 10px;
}

.progress-hint {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 12px 24px;
  border-radius: 30px;
  backdrop-filter: blur(10px);
}

.hint-content {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  font-size: 16px;
}

.close-btn {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  min-width: 120px;
  min-height: 50px;
  border-radius: 25px;
  border: 3px solid #fff;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.close-btn:hover {
  transform: translateX(-50%) scale(1.05);
  filter: brightness(1.1);
}

.close-icon {
  font-size: 28px;
  font-weight: bold;
  line-height: 1;
}

.close-text {
  font-size: 12px;
  font-weight: 600;
}
</style>
