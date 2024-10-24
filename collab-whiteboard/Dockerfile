# Sử dụng Node.js image
FROM node:14

# Tạo thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy mã nguồn vào image
COPY . .

# Chạy build
RUN npm run build

# Chạy ứng dụng
CMD ["npm", "start"]
