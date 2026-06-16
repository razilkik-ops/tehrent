import fsSync from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const distPath = path.join(root, "dist");
const buildRoot = path.join(root, ".deploy", "cpanel-static");
const siteRoot = path.join(buildRoot, "site");
const envFilePath = path.join(root, ".env");

function parseEnvFile(filePath) {
  if (!fsSync.existsSync(filePath)) {
    return {};
  }

  const raw = fsSync.readFileSync(filePath, "utf8");
  const entries = {};

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex <= 0) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    entries[key] = value;
  }

  return entries;
}

async function resetDirectory(targetPath) {
  await fs.rm(targetPath, { recursive: true, force: true });
  await fs.mkdir(targetPath, { recursive: true });
}

async function writeTelegramConfig(env) {
  const botToken = env.TELEGRAM_BOT_TOKEN?.trim() || "";
  const chatId = env.TELEGRAM_CHAT_ID?.trim() || "";
  const threadId = env.TELEGRAM_THREAD_ID?.trim() || "";
  const timezone = env.LEADS_TIMEZONE?.trim() || "Europe/Minsk";

  const configContent = `<?php

return [
    'bot_token' => ${JSON.stringify(botToken)},
    'chat_id' => ${JSON.stringify(chatId)},
    'thread_id' => ${JSON.stringify(threadId)},
    'timezone' => ${JSON.stringify(timezone)}
];
`;

  await fs.mkdir(path.join(siteRoot, "api"), { recursive: true });
  await fs.writeFile(path.join(siteRoot, "api", "telegram-config.php"), configContent, "utf8");
}

async function adjustHtaccess(basePath) {
  const htaccessPath = path.join(siteRoot, ".htaccess");
  if (!fsSync.existsSync(htaccessPath)) {
    return;
  }

  const normalizedBase = !basePath || basePath === "/" ? "/" : `/${basePath.replace(/^\/+|\/+$/g, "")}/`;
  const raw = await fs.readFile(htaccessPath, "utf8");
  const next = raw.replace(/RewriteBase\s+.+/g, `RewriteBase ${normalizedBase}`);
  await fs.writeFile(htaccessPath, next, "utf8");
}

async function writeReadme(basePath) {
  const content = `Static cPanel package for tehrent

Upload contents of this package to:
- /public_html${basePath === "/" ? "" : basePath}

This package already includes:
- compiled frontend assets
- PHP Telegram lead handler at api/leads.php
- Telegram config generated from local .env

After upload:
1. Extract archive in the target folder.
2. Overwrite old files if cPanel asks.
3. Open the site and submit a test lead.
`;

  await fs.writeFile(path.join(siteRoot, "README-CPANEL-STATIC.txt"), content, "utf8");
}

const envFromFile = parseEnvFile(envFilePath);
const env = {
  ...envFromFile,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || envFromFile.TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || envFromFile.TELEGRAM_CHAT_ID,
  TELEGRAM_THREAD_ID: process.env.TELEGRAM_THREAD_ID || envFromFile.TELEGRAM_THREAD_ID,
  LEADS_TIMEZONE: process.env.LEADS_TIMEZONE || envFromFile.LEADS_TIMEZONE
};

const basePath = process.env.VITE_APP_BASE_PATH?.trim() || "/";

await resetDirectory(siteRoot);
await fs.cp(distPath, siteRoot, { recursive: true });
await writeTelegramConfig(env);
await adjustHtaccess(basePath);
await writeReadme(basePath);

console.log(`Prepared static cPanel package at ${siteRoot}`);
