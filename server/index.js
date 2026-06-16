import express from "express";
import crypto from "node:crypto";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { applySeoToHtml, buildSitemapXml, getMetaForPath } from "../lib/seo.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadLocalEnvFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
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
      if (!key || process.env[key] !== undefined) {
        continue;
      }

      let value = trimmed.slice(separatorIndex + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      process.env[key] = value;
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn("[env] failed to load .env file", error);
    }
  }
}

loadLocalEnvFile(path.join(root, ".env"));

function normalizeBasePath(basePath = process.env.APP_BASE_PATH || "/") {
  const trimmed = String(basePath).trim();
  if (!trimmed || trimmed === "/") {
    return "/";
  }

  return `/${trimmed.replace(/^\/+|\/+$/g, "")}`;
}

const isProduction = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT || 3001);
const appBasePath = normalizeBasePath();
const dataDir = path.resolve(process.env.DATA_DIR || path.join(root, "data"));
const uploadsDir = path.join(dataDir, "uploads");
const equipmentFile = path.join(dataDir, "equipment.json");
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN?.trim() || "";
const telegramChatId = process.env.TELEGRAM_CHAT_ID?.trim() || "";
const telegramThreadId = process.env.TELEGRAM_THREAD_ID?.trim() || "";
const leadsTimezone = process.env.LEADS_TIMEZONE?.trim() || "Europe/Minsk";
const adminUsername = process.env.ADMIN_USERNAME || "admin";
const adminPassword = process.env.ADMIN_PASSWORD || "Arentex2026!";
const sessionCookieName = "arentex_admin_session";
const sessions = new Map();
const belarusPhonePattern = /^\+375(?:25|29|33|44)\d{7}$/;

const leadSchema = z
  .object({
    name: z.string().trim().optional(),
    phone: z
      .string()
      .trim()
      .min(1)
      .refine((value) => belarusPhonePattern.test(value), {
        message: "Введите номер в формате +375291234567"
      }),
    task: z.string().trim().optional(),
    equipmentId: z.string().trim().optional(),
    rentalPeriod: z.string().trim().optional(),
    address: z.string().trim().optional(),
    sourcePage: z.string(),
    selectedEquipment: z.array(z.string()).default([]),
    formType: z.string(),
    utm: z.record(z.string()).default({})
  })
  .refine((data) => Boolean(data.task?.length || data.equipmentId?.length), {
    path: ["task"]
  });

const equipmentItemSchema = z.object({
  id: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  legacySlugs: z.array(z.string().trim().min(1)).optional(),
  title: z.string().trim().min(1),
  category: z.string().trim().min(1),
  shortDescription: z.string().trim().min(1),
  description: z.string().trim().optional(),
  hourlyPrice: z.number().nonnegative().optional(),
  pricePerShift: z.number().nonnegative(),
  priceLabel: z.string().trim().optional(),
  availability: z.enum(["today", "tomorrow", "request"]),
  specs: z.record(z.union([z.string(), z.number()])),
  attachments: z.array(z.string()),
  useCases: z.array(z.string()),
  imagePlaceholderType: z.enum(["excavator", "loader", "backhoe", "lift", "truck"]),
  imageUrl: z.string().trim().optional(),
  mobileImageUrl: z.string().trim().optional(),
  withOperatorAvailable: z.boolean(),
  deliveryAvailable: z.boolean()
});

const equipmentSchema = z.array(equipmentItemSchema);

const uploadSchema = z.object({
  fileName: z.string().trim().min(1),
  dataUrl: z.string().trim().startsWith("data:image/")
});

function parseCookies(cookieHeader = "") {
  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const [key, ...value] = part.split("=");
        return [decodeURIComponent(key), decodeURIComponent(value.join("="))];
      })
  );
}

function isAuthenticated(request) {
  const cookies = parseCookies(request.headers.cookie);
  const token = cookies[sessionCookieName];
  if (!token) return false;

  const session = sessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    sessions.delete(token);
    return false;
  }

  session.expiresAt = Date.now() + 1000 * 60 * 60 * 12;
  return true;
}

function requireAdmin(request, response, next) {
  if (isAuthenticated(request)) {
    next();
    return;
  }

  response.status(401).json({ success: false, message: "Необходим вход в админ-панель" });
}

function setSessionCookie(response, token) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.setHeader(
    "Set-Cookie",
    `${sessionCookieName}=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 12}${secure}`
  );
}

function clearSessionCookie(response) {
  response.setHeader(
    "Set-Cookie",
    `${sessionCookieName}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`
  );
}

async function ensureDataDirectories() {
  await fsp.mkdir(dataDir, { recursive: true });
  await fsp.mkdir(path.join(uploadsDir, "equipment"), { recursive: true });
}

async function readEquipment() {
  try {
    const raw = await fsp.readFile(equipmentFile, "utf8");
    return equipmentSchema.parse(JSON.parse(raw));
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function writeEquipment(items) {
  const parsed = equipmentSchema.parse(items);
  await ensureDataDirectories();
  await fsp.writeFile(equipmentFile, JSON.stringify(parsed, null, 2) + "\n", "utf8");
  return parsed;
}

function safeFileName(fileName) {
  const extension = path.extname(fileName).toLowerCase();
  const safeExtension = [".jpg", ".jpeg", ".png", ".webp"].includes(extension) ? extension : ".jpg";
  const base = path
    .basename(fileName, extension)
    .toLowerCase()
    .replace(/[^a-z0-9а-яё_-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70);

  return `${base || "equipment"}-${Date.now()}${safeExtension}`;
}

function escapeTelegramHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatLeadDate(date) {
  return new Intl.DateTimeFormat("ru-BY", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: leadsTimezone
  }).format(date);
}

function getTelegramThreadId() {
  if (!telegramThreadId) {
    return undefined;
  }

  const parsedValue = Number.parseInt(telegramThreadId, 10);
  if (!Number.isInteger(parsedValue)) {
    throw new Error("TELEGRAM_THREAD_ID должен быть целым числом");
  }

  return parsedValue;
}

function getTelegramChatIds() {
  return [...new Set(
    telegramChatId
      .split(/[\s,;]+/)
      .map((value) => value.trim())
      .filter(Boolean)
  )];
}

function formatLeadMessage(lead, equipmentTitles, request) {
  const lines = [
    "<b>Новая заявка с сайта</b>",
    "",
    `<b>Дата:</b> ${escapeTelegramHtml(formatLeadDate(new Date()))}`,
    `<b>Форма:</b> ${escapeTelegramHtml(lead.formType)}`,
    `<b>Телефон:</b> ${escapeTelegramHtml(lead.phone)}`,
    `<b>Имя:</b> ${escapeTelegramHtml(lead.name || "Не указано")}`,
    `<b>Задача:</b> ${escapeTelegramHtml(lead.task || "Не указана")}`,
    `<b>Техника:</b> ${escapeTelegramHtml(equipmentTitles.join(", ") || "Не выбрана")}`,
    `<b>Период:</b> ${escapeTelegramHtml(lead.rentalPeriod || "Не указан")}`,
    `<b>Адрес:</b> ${escapeTelegramHtml(lead.address || "Не указан")}`,
    `<b>Страница:</b> ${escapeTelegramHtml(lead.sourcePage)}`
  ];

  const utmEntries = Object.entries(lead.utm || {}).filter(([, value]) => value?.trim());
  if (utmEntries.length) {
    lines.push(
      "",
      "<b>UTM:</b>",
      ...utmEntries.map(([key, value]) => `${escapeTelegramHtml(key)}: ${escapeTelegramHtml(value)}`)
    );
  }

  const ipAddress = request.headers["x-forwarded-for"] || request.socket?.remoteAddress;
  const userAgent = request.headers["user-agent"];
  if (ipAddress || userAgent) {
    lines.push("", "<b>Техническая информация:</b>");
    if (ipAddress) {
      lines.push(`IP: ${escapeTelegramHtml(String(ipAddress))}`);
    }
    if (userAgent) {
      lines.push(`User-Agent: ${escapeTelegramHtml(String(userAgent))}`);
    }
  }

  return lines.join("\n");
}

async function sendLeadToTelegram(lead, request) {
  const chatIds = getTelegramChatIds();
  if (!telegramBotToken || !chatIds.length) {
    throw new Error("Telegram не настроен: задайте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID");
  }

  const messageThreadId = getTelegramThreadId();
  const equipment = await readEquipment();
  const equipmentMap = new Map(equipment.map((item) => [item.id, item.title]));
  const equipmentIds = [...new Set([lead.equipmentId, ...lead.selectedEquipment].filter(Boolean))];
  const equipmentTitles = equipmentIds.map((id) => equipmentMap.get(id) || id);

  const messageText = formatLeadMessage(lead, equipmentTitles, request);
  const telegramResults = [];

  for (const chatId of chatIds) {
    const telegramPayload = {
      chat_id: chatId,
      text: messageText,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      ...(messageThreadId ? { message_thread_id: messageThreadId } : {})
    };

    const telegramResponse = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(telegramPayload)
    });

    const telegramResult = await telegramResponse.json().catch(() => null);
    if (!telegramResponse.ok || !telegramResult?.ok) {
      const description =
        telegramResult && typeof telegramResult.description === "string"
          ? telegramResult.description
          : `HTTP ${telegramResponse.status}`;
      throw new Error(`Не удалось отправить заявку в Telegram: ${description}`);
    }

    telegramResults.push(telegramResult);
  }

  return telegramResults;
}

async function createApp() {
  const app = express();
  await ensureDataDirectories();

  if (appBasePath !== "/") {
    app.use((request, _response, next) => {
      if (request.url === appBasePath) {
        request.url = "/";
      } else if (request.url.startsWith(`${appBasePath}/`)) {
        request.url = request.url.slice(appBasePath.length) || "/";
      }

      next();
    });
  }

  app.use(express.json({ limit: "20mb" }));
  app.use("/uploads", express.static(uploadsDir));

  app.get("/sitemap.xml", async (_request, response, next) => {
    try {
      response.type("application/xml").send(buildSitemapXml(await readEquipment()));
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/equipment", async (_request, response, next) => {
    try {
      response.json({ items: await readEquipment() });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/leads", async (request, response, next) => {
    const parsed = leadSchema.safeParse(request.body);

    if (!parsed.success) {
      response.status(400).json({
        success: false,
        errors: parsed.error.flatten()
      });
      return;
    }

    const lead = {
      createdAt: new Date().toISOString(),
      ...parsed.data
    };

    try {
      console.log("[lead]", lead);
      const telegramResults = await sendLeadToTelegram(parsed.data, request);
      response.json({
        success: true,
        telegramMessageId: telegramResults[0]?.result?.message_id || null,
        telegramMessageIds: telegramResults.map((result) => result.result?.message_id).filter(Boolean)
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/admin/session", (request, response) => {
    response.json({
      authenticated: isAuthenticated(request),
      username: isAuthenticated(request) ? adminUsername : null
    });
  });

  app.post("/api/admin/login", (request, response) => {
    const { username, password } = request.body || {};

    if (username !== adminUsername || password !== adminPassword) {
      response.status(401).json({ success: false, message: "Неверный логин или пароль" });
      return;
    }

    const token = crypto.randomBytes(32).toString("hex");
    sessions.set(token, {
      username,
      expiresAt: Date.now() + 1000 * 60 * 60 * 12
    });
    setSessionCookie(response, token);
    response.json({ success: true });
  });

  app.post("/api/admin/logout", (request, response) => {
    const cookies = parseCookies(request.headers.cookie);
    if (cookies[sessionCookieName]) {
      sessions.delete(cookies[sessionCookieName]);
    }
    clearSessionCookie(response);
    response.json({ success: true });
  });

  app.get("/api/admin/equipment", requireAdmin, async (_request, response, next) => {
    try {
      response.json({ items: await readEquipment() });
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/admin/equipment", requireAdmin, async (request, response, next) => {
    try {
      response.json({ success: true, items: await writeEquipment(request.body.items) });
    } catch (error) {
      if (error instanceof z.ZodError) {
        response.status(400).json({ success: false, errors: error.flatten() });
        return;
      }

      next(error);
    }
  });

  app.post("/api/admin/uploads", requireAdmin, async (request, response, next) => {
    try {
      const parsed = uploadSchema.parse(request.body);
      const match = parsed.dataUrl.match(/^data:(image\/(?:png|jpe?g|webp));base64,(.+)$/);

      if (!match) {
        response.status(400).json({ success: false, message: "Поддерживаются JPG, PNG и WEBP" });
        return;
      }

      const buffer = Buffer.from(match[2], "base64");
      if (buffer.length > 8 * 1024 * 1024) {
        response.status(400).json({ success: false, message: "Файл больше 8 МБ" });
        return;
      }

      await ensureDataDirectories();
      const fileName = safeFileName(parsed.fileName);
      const relativeUrl = `/uploads/equipment/${fileName}`;
      await fsp.writeFile(path.join(uploadsDir, "equipment", fileName), buffer);
      response.json({ success: true, url: relativeUrl });
    } catch (error) {
      if (error instanceof z.ZodError) {
        response.status(400).json({ success: false, errors: error.flatten() });
        return;
      }

      next(error);
    }
  });

  if (isProduction) {
    const clientPath = path.join(root, "dist");
    app.use(express.static(clientPath));
    app.get("*", async (request, response, next) => {
      try {
        const template = await fsp.readFile(path.join(clientPath, "index.html"), "utf8");
        const html = applySeoToHtml(template, getMetaForPath(request.path, await readEquipment()));
        response.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (error) {
        next(error);
      }
    });
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      root,
      server: {
        middlewareMode: true
      },
      appType: "custom"
    });

    app.use(vite.middlewares);
    app.use("*", async (request, response, next) => {
      try {
        const url = request.originalUrl;
        let template = fs.readFileSync(path.resolve(root, "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        template = applySeoToHtml(template, getMetaForPath(url, await readEquipment()));
        response.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (error) {
        vite.ssrFixStacktrace(error);
        next(error);
      }
    });
  }

  app.use((error, request, response, _next) => {
    console.error("[server-error]", error);

    const message = error instanceof Error ? error.message : "Внутренняя ошибка сервера";
    if (request.originalUrl.startsWith("/api/")) {
      response.status(500).json({
        success: false,
        message
      });
      return;
    }

    response.status(500).send("Internal Server Error");
  });

  return app;
}

createApp().then((app) => {
  app.listen(port, () => {
    console.log(`Express server running at http://localhost:${port}`);
  });
});
