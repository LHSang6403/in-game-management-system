# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy file package.json và package-lock.json (nếu có) và cài đặt dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy toàn bộ mã nguồn, bao gồm thư mục prisma
COPY . .

# Build ứng dụng (ví dụ: chuyển mã TypeScript sang JavaScript vào thư mục dist)
RUN npm run build

# Stage 2: Chạy ứng dụng
FROM node:20-alpine

WORKDIR /app

# Copy thư mục build từ stage builder
COPY --from=builder /app/dist ./dist
# Copy package.json (để có thể cài đặt production dependencies)
COPY --from=builder /app/package*.json ./

# Cài đặt production dependencies
RUN npm install --production --legacy-peer-deps

# Expose cổng ứng dụng (điều chỉnh theo cổng bạn mong muốn)
EXPOSE 3005

# Khởi động ứng dụng ở chế độ production
CMD ["npm", "run", "start:prod"]
