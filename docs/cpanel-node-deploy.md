# Деплой на cPanel c Node.js

После подключения заявок в Telegram сайт больше нельзя выкладывать как чистую статику. Для работы форм нужен Node.js app в cPanel.

## Что загружать

Соберите пакет командой:

```bash
VITE_APP_BASE_PATH=/test npm run build:cpanel
```

После этого появится папка:

```bash
.deploy/cpanel-node/tehrent-node
```

Ее можно заархивировать и загрузить на хостинг.

## Настройка в cPanel

В `Setup Node.js App` создайте приложение с такими параметрами:

- `Node.js version`: `20.x` или `22.x`
- `Application mode`: `Production`
- `Application root`: например `nodeapps/tehrent`
- `Application URL`: основной домен или поддомен
- `Application startup file`: `app.js`

## Команда после загрузки

В терминале cPanel внутри папки приложения выполните:

```bash
npm install --omit=dev
```

Сборку на сервере запускать не нужно: папка `dist` уже включена в пакет.

## ENV-переменные

Добавьте в настройках приложения:

```env
NODE_ENV=production
APP_BASE_PATH=/test
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=5343786910
TELEGRAM_THREAD_ID=
LEADS_TIMEZONE=Europe/Minsk
```

## Что уже входит в пакет

- готовая фронтенд-сборка `dist`
- сервер `Express`
- `data/equipment.json`
- загруженные изображения из `public/uploads`, перенесенные в `data/uploads`
- `app.js` как точка входа для cPanel

## Проверка

После `Restart App` откройте сайт и отправьте тестовую заявку. Она должна прийти в Telegram.
