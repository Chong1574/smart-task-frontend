FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Vite necesita escuchar en 0.0.0.0 dentro de Docker
CMD ["npm", "run", "dev", "--", "--host"]