# 가져올 이미지를 정의
FROM node:16
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
#컨테이너 포 5173을 외부로 노출
EXPOSE 5173 
CMD ["npm", "run","start"]