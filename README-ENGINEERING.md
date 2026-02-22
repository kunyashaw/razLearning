# RAZ Learning App - 工程说明文档

## 一、PDF文本解析规则

### 1.1 页面处理优先级规则

```
第1页（书名页） → 提取绘本书名（去掉数字前缀和下划线）
最后一页 → 强制显示 "the end"（优先级最高，即使包含 written/readinga 也显示）
中间页面：
  - 包含 "written" → 跳过不解析
  - 包含 "readinga" → 跳过不解析
  - 其他正常解析
```

### 1.2 单词过滤规则

过滤以下词汇：
- `the`, `end` - 最后一页显示用
- `themeAccent` - 主题色相关的词
- `bookTitle` - 书名中的词（长度>2）

### 1.3 文本提取逻辑

1. 使用 PDF.js 获取每页文本内容
2. 通过 y 坐标识别页码，过滤页码所在行
3. 按 y 坐标分组实现按行显示
4. 每行内按 x 坐标从左到右排序
5. 保留原始顺序，不去重

---

## 二、RAZ 资源存储规范

### 2.1 目录结构

```
myBooks/raz/{level}/
├── {level}.json          # 级别元数据（可选）
├── pdf/
│   ├── 01_BookName.pdf
│   ├── 02_BookName.pdf
│   └── ...
├── audio/
│   ├── 01_BookName.mp3
│   ├── 02_BookName.mp3
│   └── ...
├── video/
│   ├── 01_BookName.mp4
│   └── ...
└── cover/
    ├── 01_BookName.jpg
    └── ...
```

### 2.2 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 文件夹 | 级别字母（aa, a, b, c...） | `aa`, `a`, `b` |
| PDF文件 | `{序号}_{书名}.pdf` | `01_The Zoo.pdf` |
| 音频文件 | `{序号}_{书名}.mp3` | `01_The Zoo.mp3` |
| 视频文件 | `{序号}_{书名}.mp4` | `01_The Zoo.mp4` |
| 封面图片 | `{序号}_{书名}.jpg` | `01_The Zoo.jpg` |

### 2.3 序号规则

- 序号：2位数字，从 `01` 开始
- 书名：首字母大写，单词间用空格
- 下划线分隔序号和书名

### 2.4 books.json 结构

```json
{
  "name": "01_Vegetables",
  "type": "raz",
  "level": "A",
  "relativePath": "raz\\a\\pdf\\01_Vegetables.pdf"
}
```

---

## 三、牛津树资源存储规范

### 3.1 目录结构

```
myBooks/oxford/{level}/
├── pdf/
│   ├── 01_BookName.pdf
│   └── ...
├── audio/
│   └── ...
├── video/
│   ├── earTraining/    # 磨耳朵视频
│   └── bilingual/     # 双语讲解视频
└── cover/
    └── ...
```

### 3.2 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 文件夹 | `L{级别数字}` | `L1`, `L2`, `L3` |
| PDF文件 | `{序号}_{书名}.pdf` | `01_What a Mess.pdf` |
| 视频-磨耳朵 | 同上 | `01_What a Mess.mp4` |
| 视频-双语 | 同上 | `01_What a Mess.mp4` |

---

## 四、API 服务配置

### 4.1 百度语音API

**TTS（文字转语音）**
- API Key: <你的API Key>
- Secret Key: <你的Secret Key>
- APP ID: <你的APP ID>
- 接口地址: `https://tsn.baidu.com/text2audio`

**ASR（语音转文字）**
- 同上百度账号
- 接口地址: `https://vop.baidu.com/server_api`
- 模型: dev_pid=1737 (英语)

### 4.2 Vite 代理配置

```javascript
server: {
  proxy: {
    '/baidu-token': { target: 'https://aip.baidubce.com' },
    '/baidu-tts': { target: 'https://tsn.baidu.com' },
    '/baidu-asr': { target: 'https://vop.baidu.com' }
  }
}
```

---

## 五、前端组件说明

### 5.1 PDFViewer.vue

主要功能：
- PDF 渲染（支持缩放、翻页）
- 音频/视频播放
- PDF 文本提取（按行）
- TTS 语音合成（百度）
- ASR 语音识别（百度）
- 自动播放模式

### 5.2 BookView.vue

主要功能：
- 绘本详情页
- 学习进度追踪
- 确认完成弹窗（带倒计时）

---

## 六、部署说明

### 6.1 构建命令

```bash
npm run build
```

### 6.2 部署目录

构建产物在 `dist/` 目录，需将以下内容部署到服务器：
- `dist/` 整个目录
- `myBooks/` 资源目录（PDF、音视频等）

### 6.3 开发模式

```bash
npm run dev
# 访问 http://localhost:5173
```

---

## 七、常见问题

### 7.1 语音播放无声音
- 检查浏览器是否静音
- 检查网络是否能访问百度TTS服务
- 查看控制台日志排查错误

### 7.2 PDF解析失败
- 确保PDF文件可读
- 检查PDF是否为有效格式

### 7.3 语音识别失败
- 检查麦克风权限
- 确保录音格式为PCM 16kHz
- 检查网络是否能访问百度ASR服务
