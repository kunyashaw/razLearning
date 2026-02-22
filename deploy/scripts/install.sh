#!/bin/bash

# =====================================================
# RAZ英语学习站点 - CentOS 7 部署脚本
# =====================================================

# 配置变量
APP_NAME="raz-app"
APP_DIR="/www/wwwroot/${APP_NAME}"
NGINX_CONF_DIR="/etc/nginx/conf.d"
NGINX_CONF_FILE="${NGINX_CONF_DIR}/raz-app.conf"
LOG_DIR="/var/log/nginx"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查是否以root运行
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "请使用 root 用户运行此脚本"
        exit 1
    fi
}

# 安装nginx
install_nginx() {
    log_info "检查 nginx 安装状态..."
    
    if command -v nginx &> /dev/null; then
        log_info "nginx 已安装，版本: $(nginx -v 2>&1 | grep -o 'nginx/[0-9.]*')"
    else
        log_info "正在安装 nginx..."
        
        # 安装epel源
        yum install -y epel-release
        
        # 安装nginx
        yum install -y nginx
        
        # 设置开机自启
        systemctl enable nginx
        
        log_info "nginx 安装完成"
    fi
}

# 配置nginx
configure_nginx() {
    log_info "配置 nginx..."
    
    # 备份默认配置
    if [ -f /etc/nginx/nginx.conf ]; then
        cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak.$(date +%Y%m%d)
    fi
    
    # 创建应用目录
    mkdir -p ${APP_DIR}
    mkdir -p ${APP_DIR}/myBooks
    mkdir -p ${LOG_DIR}
    
    # 设置目录权限
    chown -R nginx:nginx ${APP_DIR}
    chmod -R 755 ${APP_DIR}
    
    log_info "nginx 配置完成"
}

# 复制应用文件
deploy_app() {
    log_info "部署应用文件..."
    
    # 检查dist目录是否存在
    if [ ! -d "./dist" ]; then
        log_error "未找到 dist 目录，请先运行 npm run build"
        exit 1
    fi
    
    # 清空旧文件
    rm -rf ${APP_DIR}/*
    
    # 复制构建文件
    cp -r ./dist/* ${APP_DIR}/
    
    # 如果存在myBooks目录，复制到应用目录
    if [ -d "./myBooks" ]; then
        cp -r ./myBooks ${APP_DIR}/
        log_info "已复制 myBooks 资源目录"
    fi
    
    # 设置权限
    chown -R nginx:nginx ${APP_DIR}
    chmod -R 755 ${APP_DIR}
    
    log_info "应用文件部署完成"
}

# 复制nginx配置
copy_nginx_config() {
    log_info "复制 nginx 配置文件..."
    
    # 备份现有配置
    if [ -f "${NGINX_CONF_FILE}" ]; then
        cp ${NGINX_CONF_FILE} ${NGINX_CONF_FILE}.bak.$(date +%Y%m%d)
    fi
    
    # 复制配置文件
    cp ./deploy/config/nginx-raz.conf ${NGINX_CONF_FILE}
    
    # 测试配置
    nginx -t
    
    if [ $? -eq 0 ]; then
        log_info "nginx 配置测试通过"
    else
        log_error "nginx 配置测试失败"
        exit 1
    fi
}

# 配置防火墙
configure_firewall() {
    log_info "配置防火墙..."
    
    # 开放80端口
    if command -v firewall-cmd &> /dev/null; then
        firewall-cmd --permanent --add-service=http
        firewall-cmd --reload
        log_info "防火墙配置完成"
    else
        log_warn "未找到 firewall-cmd，跳过防火墙配置"
    fi
}

# 设置nginx开机自启
setup_autostart() {
    log_info "设置 nginx 开机自启..."
    
    # 启用nginx服务
    systemctl enable nginx
    
    # 检查是否设置成功
    if systemctl is-enabled nginx &> /dev/null; then
        log_info "nginx 开机自启设置成功"
    else
        log_error "nginx 开机自启设置失败"
    fi
}

# 启动nginx
start_nginx() {
    log_info "启动 nginx..."
    
    # 如果已经在运行，先重载配置
    if systemctl is-active nginx &> /dev/null; then
        systemctl reload nginx
        log_info "nginx 配置已重载"
    else
        systemctl start nginx
        
        if [ $? -eq 0 ]; then
            log_info "nginx 启动成功"
        else
            log_error "nginx 启动失败，请检查日志"
            exit 1
        fi
    fi
}

# 检查服务状态
check_status() {
    log_info "检查服务状态..."
    
    echo ""
    echo "========================================"
    echo "Nginx 状态:"
    systemctl status nginx --no-pager | head -10
    echo ""
    echo "========================================"
    echo "监听端口:"
    netstat -tlnp | grep nginx || ss -tlnp | grep nginx
    echo ""
    echo "========================================"
    echo "应用目录: ${APP_DIR}"
    ls -lh ${APP_DIR}
}

# 创建更新脚本
create_update_script() {
    log_info "创建更新脚本..."
    
    cat > /usr/local/bin/update-raz-app << 'EOF'
#!/bin/bash
# RAZ应用更新脚本

APP_DIR="/www/wwwroot/raz-app"

echo "正在更新 RAZ 应用..."

# 检查dist目录
if [ ! -d "./dist" ]; then
    echo "错误：未找到 dist 目录"
    exit 1
fi

# 备份当前版本
BACKUP_DIR="/www/backups/raz-app-$(date +%Y%m%d-%H%M%S)"
mkdir -p ${BACKUP_DIR}
cp -r ${APP_DIR}/* ${BACKUP_DIR}/ 2>/dev/null
echo "已备份到: ${BACKUP_DIR}"

# 更新文件
rm -rf ${APP_DIR}/*
cp -r ./dist/* ${APP_DIR}/

# 如果存在myBooks，选择性更新
if [ -d "./myBooks" ]; then
    read -p "是否更新 myBooks 资源目录？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf ${APP_DIR}/myBooks
        cp -r ./myBooks ${APP_DIR}/
        echo "myBooks 已更新"
    fi
fi

# 设置权限
chown -R nginx:nginx ${APP_DIR}
chmod -R 755 ${APP_DIR}

# 重载nginx
systemctl reload nginx

echo "更新完成！"
EOF

    chmod +x /usr/local/bin/update-raz-app
    log_info "更新脚本已创建: update-raz-app"
}

# 显示使用说明
show_usage() {
    echo ""
    echo "========================================"
    echo "部署完成！"
    echo "========================================"
    echo ""
    echo "访问地址:"
    echo "  - 本机: http://localhost"
    echo "  - 局域网: http://$(hostname -I | awk '{print $1}')"
    echo ""
    echo "常用命令:"
    echo "  systemctl start nginx    # 启动 nginx"
    echo "  systemctl stop nginx     # 停止 nginx"
    echo "  systemctl restart nginx  # 重启 nginx"
    echo "  systemctl status nginx   # 查看状态"
    echo ""
    echo "更新应用:"
    echo "  1. 上传新的 dist 目录到服务器"
    echo "  2. 运行: update-raz-app"
    echo ""
    echo "日志文件:"
    echo "  /var/log/nginx/raz-app.access.log"
    echo "  /var/log/nginx/raz-app.error.log"
    echo ""
    echo "应用目录: ${APP_DIR}"
    echo "========================================"
}

# 主函数
main() {
    log_info "开始部署 RAZ 英语学习站点..."
    echo ""
    
    check_root
    install_nginx
    configure_nginx
    deploy_app
    copy_nginx_config
    configure_firewall
    setup_autostart
    start_nginx
    create_update_script
    check_status
    show_usage
    
    log_info "部署完成！"
}

# 运行主函数
main
