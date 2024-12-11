# Используем официальный образ Node.js в качестве базового
FROM node:22 AS build

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Строим проект
RUN npm run build

# Используем nginx для обслуживания статических файлов
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Указываем команду для запуска nginx
CMD ["nginx", "-g", "daemon off;"]
