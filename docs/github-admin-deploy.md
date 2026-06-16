# GitHub-админка и деплой на хостинг

## Как это работает

1. Админ открывает `/admin`.
2. Админ вводит `owner`, `repo`, `branch` и GitHub token.
3. Админка читает `data/equipment.json` из репозитория и даёт редактировать каталог.
4. После сохранения админка обновляет:
   - `data/equipment.json`
   - `public/data/equipment.json`
   - изображения в `public/uploads/equipment`
5. GitHub Actions запускает сборку и отправляет содержимое `dist/` на хостинг по FTP.

## Что нужно настроить в GitHub

### 1. Token для администратора

Нужен `Fine-grained personal access token` с доступом к репозиторию сайта.

Минимальные права:

- `Contents: Read and write`
- `Metadata: Read`

### 2. Secrets для автодеплоя

В репозитории откройте `Settings -> Secrets and variables -> Actions` и добавьте:

- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_PASSWORD`
- `FTP_TARGET_DIR`

Опционально:

- `FTP_PORT`

## Ветка деплоя

Workflow по умолчанию слушает `main` и `master`.

Если сайт у вас деплоится из другой ветки, поменяйте список в файле:

- `.github/workflows/deploy-static-site.yml`

## ENV-переменные фронтенда

Можно заранее зашить настройки репозитория в сборку через `.env`:

```env
VITE_GITHUB_REPO_OWNER=your-github-login
VITE_GITHUB_REPO_NAME=your-site-repository
VITE_GITHUB_BRANCH=main
VITE_GITHUB_DATA_PATH=data/equipment.json
VITE_GITHUB_PUBLIC_DATA_PATH=public/data/equipment.json
VITE_GITHUB_UPLOADS_DIR=public/uploads/equipment
```

Тогда админу останется ввести только GitHub token.

## Прием заявок в Telegram

Заявки с форм отправляются сервером в Telegram Bot API, поэтому сайт должен работать как `Node web service`, а не как полностью статический хостинг.

Что нужно:

- создать бота через `@BotFather`
- получить `TELEGRAM_BOT_TOKEN`
- добавить бота в нужный чат или канал
- получить `TELEGRAM_CHAT_ID`
- если используется тема в группе, опционально указать `TELEGRAM_THREAD_ID`

Переменные окружения:

```env
TELEGRAM_BOT_TOKEN=1234567890:your-bot-token
TELEGRAM_CHAT_ID=-1001234567890
TELEGRAM_THREAD_ID=
LEADS_TIMEZONE=Europe/Minsk
```

Если `TELEGRAM_BOT_TOKEN` или `TELEGRAM_CHAT_ID` не заданы, `/api/leads` вернет ошибку и форма не отправится.
