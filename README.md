# Movies

## Описание
Это проект для управления списками фильмов и жанров. Пользователь может создавать и управлять списками фильмов, добавлять и редактировать фильмы, отмечать их как просмотренные, а также генерировать случайный фильм дня.

## Технологии
- **Backend**: FastAPI, SQLAlchemy, SQLite
- **Frontend**: React, Axios
- **Контейнеризация**: Docker, Docker Compose
- **Управление зависимостями**: pip (Python), npm (JavaScript)

## Возможности
**Настройки:**
- Пользователь может выбрать один или два списка фильмов

**Управление списками фильмов:**
- Добавление фильма в список
- Редактирование информации о фильме
- Удаление фильма из списков
- Отметка фильма как просмотренного
- Изменение порядка фильмов в списке перетаскиванием

**Управление жанрами:**
- Добавление и удаление жанров

**Генерация случайного фильма дня:**
- Атоматически устанавливается случайный фильм дня
- Можно вручную сгенерировать новый случайный фильм дня, нажав соответствующую кнопку

## Установка и запуск

   Клонируйте репозиторий и перейдите в директорию проекта:
   ```
   git@github.com:olga3ok/movies.git
   cd movies
   ```
### Docker
```
docker-compose up --build
```
Приложение будет доступно по адресу http://localhost:3000
### Backend
```
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```
### Frontend
```
cd frontend
npm install
npm run build
npm start
```
Backend будет доступен по адресу http://localhost:8000, а frontend по адресу http://localhost:3000.