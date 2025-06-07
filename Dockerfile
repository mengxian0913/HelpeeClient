# 使用 Node 官方映像
FROM node:20-alpine AS builder

# 設定工作目錄
WORKDIR /app

# 複製專案檔案
COPY . .

# 安裝依賴並建構
RUN npm install && npm run build

# --- 生產環境階段 (使用輕量化映像)
FROM nginx:alpine

# 複製 build 後的靜態檔案到 Nginx 預設目錄
COPY --from=builder /app/dist /usr/share/nginx/html

# 複製自訂 Nginx 設定檔（如果你有）
# COPY nginx.conf /etc/nginx/nginx.conf

# 暴露 port 80 給 Cloud Run 使用
EXPOSE 80

# 啟動 Nginx
CMD ["nginx", "-g", "daemon off;"]
