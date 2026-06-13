import { LogOut, Plus, Save, Trash2, Upload } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { categories, type Availability, type Equipment, type ImagePlaceholderType } from "@/lib/equipment";

type AdminResponse = {
  items?: Equipment[];
  authenticated?: boolean;
  message?: string;
};

type SpecEntry = {
  key: string;
  value: string;
};

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
      "Масса": "",
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

async function jsonRequest<T>(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options?.headers
    }
  });
  const contentType = response.headers.get("content-type") || "";
  const raw = await response.text();
  let data: (T & { message?: string }) | null = null;

  if (raw.trim()) {
    if (contentType.includes("application/json")) {
      try {
        data = JSON.parse(raw) as T & { message?: string };
      } catch {
        throw new Error("Сервер вернул некорректный JSON");
      }
    } else {
      throw new Error("Сервер вернул не JSON. Проверьте, что backend админки запущен.");
    }
  }

  if (!response.ok) {
    throw new Error(data?.message || "Ошибка запроса");
  }

  if (!data) {
    throw new Error("Сервер вернул пустой ответ");
  }

  return data;
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Не удалось прочитать файл"));
    reader.readAsDataURL(file);
  });
}

function TextField({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-black uppercase text-ink/44">{label}</span>
      <input
        className="focus-ring h-11 rounded-[10px] border border-ink/10 bg-white px-3 text-sm font-semibold text-ink"
        value={value}
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
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [login, setLogin] = useState("admin");
  const [password, setPassword] = useState("");
  const [items, setItems] = useState<Equipment[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const selected = useMemo(() => items.find((item) => item.id === selectedId), [items, selectedId]);

  async function loadEquipment() {
    const data = await jsonRequest<AdminResponse>("/api/admin/equipment");
    const nextItems = data.items || [];
    setItems(nextItems);
    setSelectedId((current) => (nextItems.some((item) => item.id === current) ? current : nextItems[0]?.id || ""));
  }

  useEffect(() => {
    void jsonRequest<AdminResponse>("/api/admin/session")
      .then((data) => {
        setAuthenticated(Boolean(data.authenticated));
        if (data.authenticated) {
          void loadEquipment();
        }
      })
      .finally(() => setAuthChecked(true));
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
    updateSelected({ [field]: next });
  }

  function addArrayItem(field: "attachments" | "useCases") {
    if (!selected) return;
    updateSelected({ [field]: [...selected[field], ""] });
  }

  function removeArrayItem(field: "attachments" | "useCases", index: number) {
    if (!selected) return;
    updateSelected({ [field]: selected[field].filter((_, itemIndex) => itemIndex !== index) });
  }

  function specEntries(item: Equipment): SpecEntry[] {
    return Object.entries(item.specs).map(([key, value]) => ({ key, value: String(value) }));
  }

  function updateSpecs(entries: SpecEntry[]) {
    const specs = Object.fromEntries(entries.filter((entry) => entry.key.trim()).map((entry) => [entry.key, entry.value]));
    updateSelected({ specs });
  }

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setStatus("");
    try {
      await jsonRequest("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ username: login, password })
      });
      setAuthenticated(true);
      setPassword("");
      await loadEquipment();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Не удалось войти");
    }
  }

  async function handleLogout() {
    await jsonRequest("/api/admin/logout", { method: "POST", body: "{}" });
    setAuthenticated(false);
    setItems([]);
    setSelectedId("");
  }

  async function saveEquipment() {
    setSaving(true);
    setStatus("");
    try {
      const cleaned = items.map((item) => ({
        ...item,
        slug: item.slug || slugify(item.title) || item.id,
        priceLabel: item.priceLabel || undefined,
        hourlyPrice: item.hourlyPrice,
        imageUrl: item.imageUrl || undefined,
        mobileImageUrl: item.mobileImageUrl || undefined,
        description: item.description || undefined,
        attachments: item.attachments.filter(Boolean),
        useCases: item.useCases.filter(Boolean)
      }));
      const data = await jsonRequest<AdminResponse>("/api/admin/equipment", {
        method: "PUT",
        body: JSON.stringify({ items: cleaned })
      });
      setItems(data.items || cleaned);
      setStatus("Сохранено");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Не удалось сохранить");
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
    setStatus("Загружаю фото...");
    try {
      const dataUrl = await fileToDataUrl(file);
      const data = await jsonRequest<{ success: boolean; url: string }>("/api/admin/uploads", {
        method: "POST",
        body: JSON.stringify({ fileName: file.name, dataUrl })
      });
      updateSelected({ [field]: data.url });
      setStatus("Фото загружено. Не забудьте сохранить каталог.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Не удалось загрузить фото");
    }
  }

  if (!authChecked) {
    return <div className="grid min-h-screen place-items-center bg-paper text-ink">Загрузка...</div>;
  }

  if (!authenticated) {
    return (
      <main className="grid min-h-screen place-items-center bg-paper p-4 text-ink">
        <form onSubmit={handleLogin} className="w-full max-w-[420px] rounded-[20px] bg-white p-6 shadow-card">
          <h1 className="text-3xl font-black">Админ-панель</h1>
          <p className="mt-2 text-sm font-semibold leading-6 text-ink/58">Войдите, чтобы редактировать каталог техники.</p>
          <div className="mt-6 grid gap-4">
            <TextField label="Логин" value={login} onChange={setLogin} />
            <label className="grid gap-1.5">
              <span className="text-xs font-black uppercase text-ink/44">Пароль</span>
              <input
                className="focus-ring h-11 rounded-[10px] border border-ink/10 bg-white px-3 text-sm font-semibold text-ink"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            <Button type="submit" className="w-full">
              Войти
            </Button>
          </div>
          {status ? <p className="mt-4 text-sm font-bold text-accent">{status}</p> : null}
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper p-4 text-ink md:p-6">
      <div className="mx-auto max-w-[1480px]">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-[18px] bg-night p-4 text-white shadow-card">
          <div>
            <p className="text-xs font-black uppercase text-accent">Arentex.by</p>
            <h1 className="text-2xl font-black">Управление каталогом</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={addEquipment} className="gap-2">
              <Plus size={17} /> Добавить технику
            </Button>
            <Button type="button" onClick={saveEquipment} disabled={saving} className="gap-2">
              <Save size={17} /> {saving ? "Сохраняю..." : "Сохранить"}
            </Button>
            <Button type="button" variant="ghost" onClick={handleLogout} className="gap-2">
              <LogOut size={17} /> Выйти
            </Button>
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
                        <TextField label="URL" value={selected[field] || ""} onChange={(value) => updateSelected({ [field]: value })} />
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
