import { LogOut, Plus, Save, Trash2, Upload } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import {
  buildGitHubConnectionSettings,
  defaultGitHubSettings,
  loadCatalogFromGitHub,
  saveCatalogToGitHub,
  type GitHubConnectionSettings,
  type GitHubStoredSettings,
  uploadImageToGitHub,
  verifyGitHubConnection
} from "@/lib/github-admin";
import { categories, type Availability, type Equipment, type ImagePlaceholderType } from "@/lib/equipment";
import { toAbsoluteUrl } from "@/lib/seo.js";
import { usePageMeta } from "@/src/usePageMeta";

type SpecEntry = {
  key: string;
  value: string;
};

const githubSettingsStorageKey = "arentex_admin_github_settings";
const githubSessionTokenStorageKey = "arentex_admin_github_token_session";
const githubPersistentTokenStorageKey = "arentex_admin_github_token_persistent";

const availabilityOptions: Array<{ value: Availability; label: string }> = [
  { value: "today", label: "В наличии" },
  { value: "tomorrow", label: "Будет завтра" },
  { value: "request", label: "Под заказ" }
];

const imageTypes: Array<{ value: ImagePlaceholderType; label: string }> = [
  { value: "excavator", label: "Экскаватор" },
  { value: "loader", label: "Погрузчик" },
  { value: "backhoe", label: "Экскаватор-погрузчик" },
  { value: "lift", label: "Автовышка" },
  { value: "truck", label: "Самосвал" }
];

function slugify(value: string) {
  const map: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "c",
    ч: "ch",
    ш: "sh",
    щ: "sch",
    ы: "y",
    э: "e",
    ю: "yu",
    я: "ya",
    ь: "",
    ъ: ""
  };

  return value
    .toLowerCase()
    .split("")
    .map((char) => map[char] ?? char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function makeEmptyEquipment(): Equipment {
  const id = `eq-${Date.now()}`;

  return {
    id,
    slug: id,
    title: "Новая техника",
    category: "Мини-экскаваторы",
    shortDescription: "Короткое описание техники.",
    description: "",
    hourlyPrice: 85,
    pricePerShift: 680,
    priceLabel: "",
    availability: "today",
    specs: {
      Масса: "",
      "Глубина копания": ""
    },
    attachments: ["Ковш"],
    useCases: ["Копка траншей"],
    imagePlaceholderType: "excavator",
    imageUrl: "",
    mobileImageUrl: "",
    withOperatorAvailable: true,
    deliveryAvailable: true
  };
}

function readStoredSettings(): GitHubStoredSettings {
  if (typeof window === "undefined") {
    return defaultGitHubSettings;
  }

  try {
    const raw = window.localStorage.getItem(githubSettingsStorageKey);
    if (!raw) {
      return defaultGitHubSettings;
    }

    return {
      ...defaultGitHubSettings,
      ...(JSON.parse(raw) as Partial<GitHubStoredSettings>)
    };
  } catch {
    return defaultGitHubSettings;
  }
}

function readStoredToken() {
  if (typeof window === "undefined") {
    return { token: "", rememberToken: false };
  }

  const persistentToken = window.localStorage.getItem(githubPersistentTokenStorageKey);
  if (persistentToken) {
    return { token: persistentToken, rememberToken: true };
  }

  return {
    token: window.sessionStorage.getItem(githubSessionTokenStorageKey) || "",
    rememberToken: false
  };
}

function storeConnection(settings: GitHubStoredSettings, token: string, rememberToken: boolean) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(githubSettingsStorageKey, JSON.stringify(settings));

  if (rememberToken) {
    window.localStorage.setItem(githubPersistentTokenStorageKey, token);
    window.sessionStorage.removeItem(githubSessionTokenStorageKey);
    return;
  }

  window.localStorage.removeItem(githubPersistentTokenStorageKey);
  window.sessionStorage.setItem(githubSessionTokenStorageKey, token);
}

function clearStoredToken() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(githubPersistentTokenStorageKey);
  window.sessionStorage.removeItem(githubSessionTokenStorageKey);
}

function trimArray(values: string[]) {
  return values.map((value) => value.trim()).filter(Boolean);
}

function cleanEquipment(items: Equipment[]) {
  return items.map((item) => {
    const slug = item.slug.trim() || slugify(item.title) || item.id;
    const legacySlugs = trimArray(item.legacySlugs || []).filter((legacySlug) => legacySlug !== slug);
    const specs = Object.fromEntries(
      Object.entries(item.specs)
        .map(([key, value]) => [key.trim(), String(value).trim()] as const)
        .filter(([key, value]) => key && value)
    );

    return {
      ...item,
      id: item.id.trim() || `eq-${Date.now()}`,
      slug,
      legacySlugs: legacySlugs.length ? legacySlugs : undefined,
      title: item.title.trim() || "Новая техника",
      category: item.category.trim() || "Мини-экскаваторы",
      shortDescription: item.shortDescription.trim() || "Описание будет добавлено позже.",
      description: item.description?.trim() || undefined,
      hourlyPrice: item.hourlyPrice,
      pricePerShift: item.pricePerShift || 0,
      priceLabel: item.priceLabel?.trim() || undefined,
      specs,
      attachments: trimArray(item.attachments),
      useCases: trimArray(item.useCases),
      imageUrl: item.imageUrl?.trim() || undefined,
      mobileImageUrl: item.mobileImageUrl?.trim() || undefined
    };
  });
}

function fileLabel(field: "imageUrl" | "mobileImageUrl") {
  return field === "imageUrl" ? "desktop" : "mobile";
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-black uppercase text-ink/44">{label}</span>
      <input
        className="focus-ring h-11 rounded-[10px] border border-ink/10 bg-white px-3 text-sm font-semibold text-ink"
        value={value}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value?: number;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-black uppercase text-ink/44">{label}</span>
      <input
        className="focus-ring h-11 rounded-[10px] border border-ink/10 bg-white px-3 text-sm font-semibold text-ink"
        value={value ?? ""}
        placeholder={placeholder}
        inputMode="numeric"
        onChange={(event) => onChange(event.target.value === "" ? undefined : Number(event.target.value))}
      />
    </label>
  );
}

export function AdminPage() {
  const storedTokenState = readStoredToken();
  const [booting, setBooting] = useState(true);
  const [connected, setConnected] = useState(false);
  const [connection, setConnection] = useState<GitHubConnectionSettings | null>(null);
  const [settings, setSettings] = useState<GitHubStoredSettings>(readStoredSettings);
  const [token, setToken] = useState(storedTokenState.token);
  const [rememberToken, setRememberToken] = useState(storedTokenState.rememberToken);
  const [items, setItems] = useState<Equipment[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [connecting, setConnecting] = useState(false);

  usePageMeta({
    title: "Админ-панель | Arentex.by",
    description: "Служебный раздел управления каталогом спецтехники.",
    canonical: toAbsoluteUrl("/admin"),
    robots: "noindex, nofollow",
    type: "website",
    structuredData: []
  });

  const selected = useMemo(() => items.find((item) => item.id === selectedId), [items, selectedId]);

  async function connectToGitHub(nextSettings = settings, nextToken = token, silent = false) {
    const trimmedToken = nextToken.trim();
    if (!nextSettings.owner.trim() || !nextSettings.repo.trim() || !trimmedToken) {
      setBooting(false);
      setConnected(false);
      setConnection(null);
      if (!silent) {
        setStatus("Укажите owner, repo и GitHub token.");
      }
      return;
    }

    setConnecting(true);
    if (!silent) {
      setStatus("");
    }

    try {
      const nextConnection = buildGitHubConnectionSettings(nextSettings, trimmedToken);
      await verifyGitHubConnection(nextConnection);
      const repoItems = await loadCatalogFromGitHub(nextConnection);

      setConnection(nextConnection);
      setConnected(true);
      setItems(repoItems);
      setSelectedId((current) => (repoItems.some((item) => item.id === current) ? current : repoItems[0]?.id || ""));
      storeConnection(nextSettings, trimmedToken, rememberToken);
      setStatus(
        silent ? "" : "Подключено к GitHub. После сохранения GitHub Actions автоматически отправит обновления на хостинг."
      );
    } catch (error) {
      setConnected(false);
      setConnection(null);
      setStatus(error instanceof Error ? error.message : "Не удалось подключиться к GitHub");
    } finally {
      setConnecting(false);
      setBooting(false);
    }
  }

  useEffect(() => {
    const storedSettings = readStoredSettings();
    const storedToken = readStoredToken();

    setSettings(storedSettings);
    setToken(storedToken.token);
    setRememberToken(storedToken.rememberToken);

    if (storedSettings.owner && storedSettings.repo && storedToken.token) {
      void connectToGitHub(storedSettings, storedToken.token, true);
      return;
    }

    setBooting(false);
  }, []);

  function updateSelected(patch: Partial<Equipment>) {
    if (!selected) return;

    setItems((current) =>
      current.map((item) =>
        item.id === selected.id
          ? {
              ...item,
              ...patch
            }
          : item
      )
    );
  }

  function updateArray(field: "attachments" | "useCases", index: number, value: string) {
    if (!selected) return;
    const next = [...selected[field]];
    next[index] = value;
    updateSelected({ [field]: next } as Partial<Equipment>);
  }

  function addArrayItem(field: "attachments" | "useCases") {
    if (!selected) return;
    updateSelected({ [field]: [...selected[field], ""] } as Partial<Equipment>);
  }

  function removeArrayItem(field: "attachments" | "useCases", index: number) {
    if (!selected) return;
    updateSelected({ [field]: selected[field].filter((_, itemIndex) => itemIndex !== index) } as Partial<Equipment>);
  }

  function specEntries(item: Equipment): SpecEntry[] {
    return Object.entries(item.specs).map(([key, value]) => ({ key, value: String(value) }));
  }

  function updateSpecs(entries: SpecEntry[]) {
    const specs = Object.fromEntries(entries.filter((entry) => entry.key.trim()).map((entry) => [entry.key, entry.value]));
    updateSelected({ specs });
  }

  async function handleConnect(event: FormEvent) {
    event.preventDefault();
    await connectToGitHub();
  }

  function handleDisconnect() {
    clearStoredToken();
    setConnected(false);
    setConnection(null);
    setToken("");
    setItems([]);
    setSelectedId("");
    setStatus("Подключение к GitHub отключено.");
  }

  async function saveEquipment() {
    if (!connection) {
      setStatus("Сначала подключите GitHub.");
      return;
    }

    setSaving(true);
    setStatus("");

    try {
      const cleaned = cleanEquipment(items);
      await saveCatalogToGitHub(connection, cleaned);
      setItems(cleaned);
      setStatus("Каталог сохранён в репозитории. После завершения GitHub Actions сайт на хостинге обновится автоматически.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Не удалось сохранить каталог");
    } finally {
      setSaving(false);
    }
  }

  function addEquipment() {
    const next = makeEmptyEquipment();
    setItems((current) => [next, ...current]);
    setSelectedId(next.id);
  }

  function deleteEquipment() {
    if (!selected || !window.confirm(`Удалить ${selected.title}?`)) return;
    const nextItems = items.filter((item) => item.id !== selected.id);
    setItems(nextItems);
    setSelectedId(nextItems[0]?.id || "");
  }

  async function uploadImage(file: File, field: "imageUrl" | "mobileImageUrl") {
    if (!connection || !selected) {
      setStatus("Сначала подключите GitHub.");
      return;
    }

    setStatus("Загружаю фото в репозиторий...");

    try {
      const slug = selected.slug || slugify(selected.title) || selected.id;
      const url = await uploadImageToGitHub(connection, file, slug, fileLabel(field));
      updateSelected({ [field]: url } as Partial<Equipment>);
      setStatus("Фото загружено в репозиторий. Нажмите «Сохранить», чтобы обновить карточку на сайте.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Не удалось загрузить фото");
    }
  }

  if (booting) {
    return <div className="grid min-h-screen place-items-center bg-paper text-ink">Проверяю подключение к GitHub...</div>;
  }

  if (!connected) {
    return (
      <main className="grid min-h-screen place-items-center bg-paper p-4 text-ink">
        <div className="grid w-full max-w-[980px] gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleConnect} className="rounded-[20px] bg-white p-6 shadow-card">
            <p className="text-xs font-black uppercase text-accent">GitHub-backed admin</p>
            <h1 className="mt-2 text-3xl font-black">Подключение админки</h1>
            <p className="mt-3 text-sm font-semibold leading-6 text-ink/58">
              Админка сохраняет каталог и фотографии прямо в git-репозиторий. После коммита GitHub Actions собирает сайт
              и отправляет файлы на обычный хостинг по FTP/SFTP.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <TextField
                label="GitHub owner"
                value={settings.owner}
                placeholder="ваш-логин-или-организация"
                autoComplete="username"
                onChange={(value) => setSettings((current) => ({ ...current, owner: value }))}
              />
              <TextField
                label="Репозиторий"
                value={settings.repo}
                placeholder="site-repo"
                onChange={(value) => setSettings((current) => ({ ...current, repo: value }))}
              />
              <TextField
                label="Ветка"
                value={settings.branch}
                placeholder="main"
                onChange={(value) => setSettings((current) => ({ ...current, branch: value }))}
              />
              <TextField
                label="GitHub token"
                type="password"
                autoComplete="current-password"
                value={token}
                placeholder="ghp_..."
                onChange={setToken}
              />
            </div>

            <details className="mt-5 rounded-[14px] bg-paper p-4">
              <summary className="cursor-pointer text-sm font-black text-ink">Расширенные пути</summary>
              <div className="mt-4 grid gap-4">
                <TextField
                  label="Файл каталога в repo"
                  value={settings.catalogPath}
                  onChange={(value) => setSettings((current) => ({ ...current, catalogPath: value }))}
                />
                <TextField
                  label="Публичный JSON для сайта"
                  value={settings.publicCatalogPath}
                  onChange={(value) => setSettings((current) => ({ ...current, publicCatalogPath: value }))}
                />
                <TextField
                  label="Папка изображений"
                  value={settings.uploadsDir}
                  onChange={(value) => setSettings((current) => ({ ...current, uploadsDir: value }))}
                />
              </div>
            </details>

            <label className="mt-5 flex items-center gap-3 rounded-[12px] bg-paper px-4 py-3 text-sm font-bold text-ink">
              <input
                type="checkbox"
                checked={rememberToken}
                onChange={(event) => setRememberToken(event.target.checked)}
              />
              Запомнить токен на этом устройстве
            </label>

            <Button type="submit" className="mt-5 w-full" disabled={connecting}>
              {connecting ? "Подключаю..." : "Подключить GitHub"}
            </Button>

            {status ? <p className="mt-4 text-sm font-bold text-accent">{status}</p> : null}
          </form>

          <section className="rounded-[20px] bg-night p-6 text-white shadow-card">
            <h2 className="text-2xl font-black">Что нужно для работы</h2>
            <div className="mt-4 grid gap-3 text-sm font-semibold leading-6 text-white/78">
              <p>1. Репозиторий сайта на GitHub.</p>
              <p>2. Fine-grained token с доступом к репозиторию и правом Contents: Read and write.</p>
              <p>3. GitHub Actions workflow, который после push заливает сборку сайта на хостинг.</p>
              <p>4. Секреты `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` и `FTP_TARGET_DIR` в настройках GitHub.</p>
            </div>
            <div className="mt-5 rounded-[16px] bg-white/10 p-4 text-sm font-semibold leading-6 text-white/84">
              Токен используется только из браузера администратора. Для публичного доступа к `/admin` настоящей защитой
              здесь является именно GitHub token с правами на запись.
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper p-4 text-ink md:p-6">
      <div className="mx-auto max-w-[1480px]">
        <header className="rounded-[18px] bg-night p-4 text-white shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-accent">Arentex.by</p>
              <h1 className="text-2xl font-black">Управление каталогом</h1>
              <p className="mt-2 text-sm font-semibold text-white/72">
                Репозиторий: {connection?.owner}/{connection?.repo} • ветка {connection?.branch}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="outline" onClick={addEquipment} className="gap-2">
                <Plus size={17} /> Добавить технику
              </Button>
              <Button type="button" onClick={saveEquipment} disabled={saving} className="gap-2">
                <Save size={17} /> {saving ? "Сохраняю..." : "Сохранить"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setConnected(false);
                  setConnection(null);
                  setStatus("Параметры GitHub можно изменить и подключить заново.");
                }}
              >
                Сменить GitHub
              </Button>
              <Button type="button" variant="ghost" onClick={handleDisconnect} className="gap-2">
                <LogOut size={17} /> Отключить
              </Button>
            </div>
          </div>
          <div className="mt-4 rounded-[12px] bg-white/10 px-4 py-3 text-sm font-semibold text-white/82">
            После нажатия «Сохранить» JSON обновляется в GitHub, а затем workflow автоматически собирает и заливает сайт
            на ваш обычный хостинг.
          </div>
        </header>

        {status ? <p className="mt-4 rounded-[12px] bg-white px-4 py-3 text-sm font-bold text-ink shadow-sm">{status}</p> : null}

        <div className="mt-5 grid gap-5 lg:grid-cols-[340px_1fr]">
          <aside className="rounded-[18px] bg-white p-3 shadow-card">
            <div className="grid gap-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`rounded-[12px] px-3 py-3 text-left transition ${
                    item.id === selectedId ? "bg-accent text-ink" : "bg-paper hover:bg-accent/15"
                  }`}
                >
                  <span className="block text-sm font-black">{item.title}</span>
                  <span className="mt-1 block text-xs font-semibold opacity-60">{item.category}</span>
                </button>
              ))}
            </div>
          </aside>

          {selected ? (
            <section className="grid gap-5">
              <div className="rounded-[18px] bg-white p-5 shadow-card">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase text-accent">Карточка товара</p>
                    <h2 className="mt-1 text-2xl font-black">{selected.title}</h2>
                  </div>
                  <Button type="button" variant="outline" onClick={deleteEquipment} className="gap-2 text-red-700">
                    <Trash2 size={17} /> Удалить
                  </Button>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <TextField label="ID" value={selected.id} onChange={(value) => updateSelected({ id: value })} />
                  <TextField
                    label="URL slug"
                    value={selected.slug}
                    onChange={(value) => updateSelected({ slug: value })}
                    placeholder="kubota-kx41-3v"
                  />
                  <TextField
                    label="Старые slug через запятую"
                    value={selected.legacySlugs?.join(", ") || ""}
                    onChange={(value) =>
                      updateSelected({
                        legacySlugs: value
                          .split(",")
                          .map((entry) => entry.trim())
                          .filter(Boolean)
                      })
                    }
                    placeholder="kubota-kx41-3w"
                  />
                  <TextField
                    label="Название"
                    value={selected.title}
                    onChange={(value) => updateSelected({ title: value, slug: selected.slug || slugify(value) })}
                  />
                  <label className="grid gap-1.5">
                    <span className="text-xs font-black uppercase text-ink/44">Категория</span>
                    <select
                      className="focus-ring h-11 rounded-[10px] border border-ink/10 bg-white px-3 text-sm font-semibold text-ink"
                      value={selected.category}
                      onChange={(event) => updateSelected({ category: event.target.value })}
                    >
                      {[...new Set([...categories, selected.category])].map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-1.5">
                    <span className="text-xs font-black uppercase text-ink/44">Статус</span>
                    <select
                      className="focus-ring h-11 rounded-[10px] border border-ink/10 bg-white px-3 text-sm font-semibold text-ink"
                      value={selected.availability}
                      onChange={(event) => updateSelected({ availability: event.target.value as Availability })}
                    >
                      {availabilityOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-1.5">
                    <span className="text-xs font-black uppercase text-ink/44">Тип изображения</span>
                    <select
                      className="focus-ring h-11 rounded-[10px] border border-ink/10 bg-white px-3 text-sm font-semibold text-ink"
                      value={selected.imagePlaceholderType}
                      onChange={(event) => updateSelected({ imagePlaceholderType: event.target.value as ImagePlaceholderType })}
                    >
                      {imageTypes.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="grid gap-1.5">
                    <span className="text-xs font-black uppercase text-ink/44">Короткое описание</span>
                    <textarea
                      className="focus-ring min-h-28 rounded-[10px] border border-ink/10 bg-white px-3 py-3 text-sm font-semibold leading-6 text-ink"
                      value={selected.shortDescription}
                      onChange={(event) => updateSelected({ shortDescription: event.target.value })}
                    />
                  </label>
                  <label className="grid gap-1.5">
                    <span className="text-xs font-black uppercase text-ink/44">Полное описание</span>
                    <textarea
                      className="focus-ring min-h-28 rounded-[10px] border border-ink/10 bg-white px-3 py-3 text-sm font-semibold leading-6 text-ink"
                      value={selected.description || ""}
                      onChange={(event) => updateSelected({ description: event.target.value })}
                    />
                  </label>
                </div>
              </div>

              <div className="grid gap-5 xl:grid-cols-2">
                <div className="rounded-[18px] bg-white p-5 shadow-card">
                  <h3 className="text-xl font-black">Цены и условия</h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <NumberField label="Цена за час" value={selected.hourlyPrice} onChange={(value) => updateSelected({ hourlyPrice: value })} />
                    <NumberField label="Смена" value={selected.pricePerShift} onChange={(value) => updateSelected({ pricePerShift: value ?? 0 })} />
                    <TextField label="Текст цены" value={selected.priceLabel || ""} onChange={(value) => updateSelected({ priceLabel: value })} />
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <label className="flex items-center gap-3 rounded-[12px] bg-paper px-3 py-3 text-sm font-black">
                      <input
                        type="checkbox"
                        checked={selected.withOperatorAvailable}
                        onChange={(event) => updateSelected({ withOperatorAvailable: event.target.checked })}
                      />
                      Оператор доступен
                    </label>
                    <label className="flex items-center gap-3 rounded-[12px] bg-paper px-3 py-3 text-sm font-black">
                      <input
                        type="checkbox"
                        checked={selected.deliveryAvailable}
                        onChange={(event) => updateSelected({ deliveryAvailable: event.target.checked })}
                      />
                      Доставка доступна
                    </label>
                  </div>
                </div>

                <div className="rounded-[18px] bg-white p-5 shadow-card">
                  <h3 className="text-xl font-black">Фотографии</h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {(["imageUrl", "mobileImageUrl"] as const).map((field) => (
                      <div key={field} className="rounded-[14px] bg-paper p-3">
                        <p className="text-xs font-black uppercase text-ink/44">
                          {field === "imageUrl" ? "Основная фотография" : "Мобильная фотография"}
                        </p>
                        {selected[field] ? (
                          <img src={selected[field]} alt="" className="mt-3 aspect-[4/3] w-full rounded-[10px] object-cover" />
                        ) : (
                          <div className="mt-3 grid aspect-[4/3] place-items-center rounded-[10px] bg-white text-sm font-bold text-ink/42">
                            Фото не выбрано
                          </div>
                        )}
                        <TextField label="URL" value={selected[field] || ""} onChange={(value) => updateSelected({ [field]: value } as Partial<Equipment>)} />
                        <label className="mt-3 inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-night px-4 text-sm font-black text-white">
                          <Upload size={16} /> Загрузить
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="hidden"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file) void uploadImage(file, field);
                              event.target.value = "";
                            }}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-5 xl:grid-cols-3">
                <div className="rounded-[18px] bg-white p-5 shadow-card xl:col-span-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-black">Характеристики</h3>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => updateSpecs([...specEntries(selected), { key: "", value: "" }])}
                    >
                      Добавить
                    </Button>
                  </div>
                  <div className="mt-4 grid gap-3">
                    {specEntries(selected).map((entry, index, entries) => (
                      <div key={`${entry.key}-${index}`} className="grid gap-2 rounded-[12px] bg-paper p-3">
                        <input
                          className="focus-ring h-10 rounded-[8px] border border-ink/10 bg-white px-3 text-sm font-bold"
                          placeholder="Название"
                          value={entry.key}
                          onChange={(event) => {
                            const next = [...entries];
                            next[index] = { ...entry, key: event.target.value };
                            updateSpecs(next);
                          }}
                        />
                        <div className="grid grid-cols-[1fr_auto] gap-2">
                          <input
                            className="focus-ring h-10 rounded-[8px] border border-ink/10 bg-white px-3 text-sm font-bold"
                            placeholder="Значение"
                            value={entry.value}
                            onChange={(event) => {
                              const next = [...entries];
                              next[index] = { ...entry, value: event.target.value };
                              updateSpecs(next);
                            }}
                          />
                          <button
                            type="button"
                            className="grid size-10 place-items-center rounded-[8px] bg-white text-red-700"
                            onClick={() => updateSpecs(entries.filter((_, itemIndex) => itemIndex !== index))}
                            aria-label="Удалить характеристику"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {(["attachments", "useCases"] as const).map((field) => (
                  <div key={field} className="rounded-[18px] bg-white p-5 shadow-card">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-xl font-black">{field === "attachments" ? "Навесное" : "Для каких работ"}</h3>
                      <Button type="button" size="sm" variant="outline" onClick={() => addArrayItem(field)}>
                        Добавить
                      </Button>
                    </div>
                    <div className="mt-4 grid gap-2">
                      {selected[field].map((value, index) => (
                        <div key={index} className="grid grid-cols-[1fr_auto] gap-2">
                          <input
                            className="focus-ring h-10 rounded-[8px] border border-ink/10 bg-paper px-3 text-sm font-bold"
                            value={value}
                            onChange={(event) => updateArray(field, index, event.target.value)}
                          />
                          <button
                            type="button"
                            className="grid size-10 place-items-center rounded-[8px] bg-paper text-red-700"
                            onClick={() => removeArrayItem(field, index)}
                            aria-label="Удалить строку"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className="rounded-[18px] bg-white p-8 text-center font-bold text-ink/58 shadow-card">
              Добавьте первую карточку техники.
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
