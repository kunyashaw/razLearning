# RAZ Learning

一个基于 Vue 3 + Vite 的分级阅读学习 web 应用，支持 RAZ 和牛津树两大绘本系列。

## 功能特性

### 核心功能
- **分级阅读** - 支持 RAZ (aa-Z) 和牛津树 (L1-L12) 分级绘本
- **PDF 渲染** - 高性能 PDF 阅读器，支持缩放、翻页
- **语音合成 (TTS)** - 将文本转换为语音播放
- **语音识别 (ASR)** - 支持录音识别用户发音
- **自动播放** - 连续播放绘本内容

### 学习体验
- **进度追踪** - 自动记录学习进度
- **奖励系统** - 完成绘本获得奖励徽章
- **主题切换** - 多主题皮肤可选

### 技术栈
- Vue 3 + Composition API
- Vite 7 构建工具
- Pinia 状态管理
- Vue Router 路由
- Tailwind CSS 样式
- PDF.js PDF 渲染

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

构建产物输出到 `dist/` 目录

## 项目结构

```
src/
├── components/     # 公共组件
│   ├── PDFViewer.vue
│   ├── RewardBadge.vue
│   └── ThemeModal.vue
├── views/          # 页面视图
│   ├── RazView.vue
│   ├── OxfordView.vue
│   └── BookView.vue
├── services/       # 业务服务
├── stores/         # Pinia 状态管理
└── utils/          # 工具函数
```

## 资源目录

将绘本资源放在 `myBooks/` 目录下：

```
myBooks/
├── raz/           # RAZ 绘本 (按级别 aa, a, b...)
│   └── pdf/
├── oxford/       # 牛津树绘本 (按级别 L1, L2...)
│   └── pdf/
└── cover/        # 封面图片
```

## License

MIT
