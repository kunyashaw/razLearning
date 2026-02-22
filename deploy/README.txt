RAZ英语学习站点 - 部署文件说明

目录结构

deploy/
├── config/
│   ├── nginx-raz.conf      # nginx配置文件
│   └── nginx.service       # systemd服务文件
├── scripts/
│   └── install.sh          # 一键部署脚本
├── CENTOS7-README.md       # CentOS7部署详细指南
└── README.txt              # 本文件

部署步骤

1. 使用OnePanel（最简单）
   - 登录OnePanel
   - 创建网站，根目录指向 /www/wwwroot/raz-app
   - 上传 dist/ 和 myBooks/ 目录
   - 复制 nginx-raz.conf 内容到网站配置
   - OnePanel会自动管理nginx启动和自启

2. 使用一键脚本
   ssh root@服务器IP
   cd /root
   unzip raz-deploy.zip
   cd deploy
   chmod +x scripts/install.sh
   ./scripts/install.sh

3. 手动部署
   查看 CENTOS7-README.md 详细步骤

文件清单

必需文件：
- dist/              # 前端构建产物
- myBooks/           # 绘本资源文件
- deploy/config/nginx-raz.conf  # nginx配置

可选文件：
- deploy/scripts/install.sh     # 自动化脚本

服务器要求

- 操作系统: CentOS 7
- 内存: 512MB+
- 磁盘: 1GB+（根据资源文件大小）
- 端口: 80（HTTP）
- 软件: nginx

访问地址

部署完成后：
- http://服务器IP
- http://localhost（本机）

注意事项

1. myBooks目录必须上传到服务器，包含绘本资源
2. 目录结构：myBooks/raz/aa/pdf/, myBooks/raz/aa/video/, myBooks/raz/aa/audio/
3. 确保nginx用户对myBooks有读取权限
4. 如果使用OnePanel，建议完全使用OnePanel管理nginx

技术支持

- 作者: kunyashaw
- 项目路径: D:\code\opencode\raz
