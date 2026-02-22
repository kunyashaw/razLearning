# RAZ Learning

> 📹 演示视频: 查看 `razLearningDemo.mp4` 文件

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

> ⚠️ **免责声明**：本项目不提供绘本资源，会员绘本需自行购买。支持正版，建议通过闲鱼等平台购买 RAZ 电子版资源。

将绘本资源放在 `myBooks/` 目录下：

### 目录结构

```
myBooks/
├── raz/                    # RAZ 绘本
│   ├── aa/                 # 最低级别
│   │   ├── pdf/
│   │   │   └── 01_BookName.pdf
│   │   ├── audio/
│   │   │   └── 01_BookName.mp3
│   │   ├── video/
│   │   │   └── 01_BookName.mp4
│   │   └── cover/
│   │       └── 01_BookName.jpg
│   ├── a/                  # 级别 a
│   ├── b/                  # 级别 b
│   └── ...                 # 继续到 z, Z
├── oxford/                # 牛津树绘本
│   ├── L1/                 # Level 1
│   │   ├── pdf/
│   │   │   └── 01_BookName.pdf
│   │   ├── audio/
│   │   ├── video/
│   │   │   ├── earTraining/    # 磨耳朵视频
│   │   │   └── bilingual/     # 双语讲解视频
│   │   └── cover/
│   └── L2/                 # Level 2
│       └── ...
└── cover/                  # 通用封面目录
```

### 文件命名规范

| 类型 | 格式 | 示例 |
|------|------|------|
| PDF 文件 | `{序号}_{书名}.pdf` | `01_The Zoo.pdf` |
| 音频文件 | `{序号}_{书名}.mp3` | `01_The Zoo.mp3` |
| 视频文件 | `{序号}_{书名}.mp4` | `01_The Zoo.mp4` |
| 封面图片 | `{序号}_{书名}.jpg` | `01_The Zoo.jpg` |

### 命名规则

- **序号**：2 位数字，从 `01` 开始
- **书名**：首字母大写，单词间用空格
- **序号与书名之间用下划线 `_` 分隔**

### 数据文件

还需要在项目根目录放置 `books.json`（RAZ）或 `classified_oxford_books.json`（牛津树）：

```json
{
  "name": "01_Vegetables",
  "type": "raz",
  "level": "A",
  "relativePath": "raz\\a\\pdf\\01_Vegetables.pdf"
}
```

### 获取资源

- **闲鱼**：搜索 "RAZ 电子书" 或 "RAZ Plus"
- **淘宝**：RAZ 分级绘本 PDF 版
- **自己扫描**：购买纸质书后自行扫描

> 💡 建议购买前先与卖家确认资源格式是否包含 PDF 和音频

## License

MIT
